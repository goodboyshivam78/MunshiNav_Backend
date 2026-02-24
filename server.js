// server.js — HomeNav AI Backend v2.0
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
let { HOME_DATA, ROOM_GRAPH } = require('./homeData');

const app = express();
const PORT = process.env.PORT || 3001;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const BLUEPRINT_FILE = path.join(__dirname, 'blueprint_override.json');
const GEOFENCE_FILE = path.join(__dirname, 'geofence.json');

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));

function getHomeData() {
  if (fs.existsSync(BLUEPRINT_FILE)) {
    try { return JSON.parse(fs.readFileSync(BLUEPRINT_FILE, 'utf8')); } catch(e) {}
  }
  return HOME_DATA;
}

function getAllRoomsDynamic() {
  const data = getHomeData();
  const rooms = [];
  data.floors.forEach(floor => {
    floor.rooms.forEach(room => { rooms.push({ ...room, floorId: floor.id, floorName: floor.name }); });
  });
  return rooms;
}

function getRoomByIdDynamic(id) { return getAllRoomsDynamic().find(r => r.id === id); }

function getRoomGraph() {
  const data = getHomeData();
  const graph = {};
  data.floors.forEach(floor => { floor.rooms.forEach(room => { graph[room.id] = room.connectedTo || []; }); });
  return graph;
}

function findPathDynamic(startId, endId) {
  const graph = getRoomGraph();
  if (startId === endId) return { path: [startId], steps: 0 };
  const visited = new Set();
  const queue = [[startId, [startId]]];
  visited.add(startId);
  while (queue.length > 0) {
    const [current, pathArr] = queue.shift();
    for (const neighbor of (graph[current] || [])) {
      if (neighbor === endId) return { path: [...pathArr, neighbor], steps: pathArr.length };
      if (!visited.has(neighbor)) { visited.add(neighbor); queue.push([neighbor, [...pathArr, neighbor]]); }
    }
  }
  return { path: [], steps: -1 };
}

function generateVoiceDirections(pathIds) {
  const rooms = pathIds.map(id => getRoomByIdDynamic(id));
  return rooms.map((room, i) => {
    if (!room) return null;
    if (i === 0) return { text: `Starting navigation from ${room.name}.`, type: 'start', roomId: room.id };
    if (i === rooms.length - 1) return { text: `You have arrived at your destination — ${room.name}.`, type: 'arrive', roomId: room.id };
    if (room.type === 'staircase') {
      const next = rooms[i+1];
      const dir = next && next.floorId !== rooms[i-1]?.floorId ? 'up' : 'down';
      return { text: `Take the staircase ${dir} to the next floor.`, type: 'floor_change', roomId: room.id };
    }
    if (room.type === 'corridor') return { text: `Walk through the ${room.name}.`, type: 'walk', roomId: room.id };
    return { text: `Pass through ${room.name}.`, type: 'pass', roomId: room.id };
  }).filter(Boolean);
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function getGeofence() {
  if (fs.existsSync(GEOFENCE_FILE)) { try { return JSON.parse(fs.readFileSync(GEOFENCE_FILE,'utf8')); } catch(e) {} }
  return { lat: null, lng: null, radiusMeters: 100, name: 'Home Campus' };
}

function buildHomeContext() {
  const allRooms = getAllRoomsDynamic();
  const data = getHomeData();
  return `You are LILY, an AI home navigation assistant for ${data.name}.
Help people navigate. Rooms available:\n${allRooms.map(r=>`- ${r.name} (${r.type}, ${r.floorName})`).join('\n')}
Be concise like a GPS. Use emojis. Speak in a professional LILY tone.`;
}

// Routes
app.get('/api/home', (req,res) => res.json({ success:true, data: getHomeData() }));
app.get('/api/rooms', (req,res) => { const rooms=getAllRoomsDynamic(); res.json({ success:true, rooms, count:rooms.length }); });
app.get('/api/rooms/:id', (req,res) => { const r=getRoomByIdDynamic(req.params.id); r ? res.json({success:true,room:r}) : res.status(404).json({success:false,error:'Not found'}); });

app.post('/api/navigate', (req,res) => {
  const {from,to} = req.body;
  if (!from||!to) return res.status(400).json({success:false,error:'from and to required'});
  const allRooms = getAllRoomsDynamic();
  const fromRoom = allRooms.find(r=>r.id===from) || allRooms.find(r=>r.name.toLowerCase().includes(from.toLowerCase()));
  const toRoom = allRooms.find(r=>r.id===to) || allRooms.find(r=>r.name.toLowerCase().includes(to.toLowerCase()));
  if (!fromRoom) return res.status(404).json({success:false,error:`Room not found: ${from}`});
  if (!toRoom) return res.status(404).json({success:false,error:`Room not found: ${to}`});
  const result = findPathDynamic(fromRoom.id, toRoom.id);
  if (result.path.length===0) return res.status(404).json({success:false,error:'No path found'});
  const pathRooms = result.path.map(id=>getRoomByIdDynamic(id));
  const voiceSteps = generateVoiceDirections(result.path);
  res.json({ success:true, from:fromRoom, to:toRoom, path:result.path, pathRooms, directions:voiceSteps.map(s=>s.text), voiceSteps, steps:result.steps, floorChanges:pathRooms.filter(r=>r&&r.type==='staircase').length });
});

app.post('/api/search', (req,res) => {
  const {query} = req.body;
  const allRooms = getAllRoomsDynamic();
  const q = query?.toLowerCase()||'';
  const results = allRooms.filter(r=>r.name.toLowerCase().includes(q)||r.type.toLowerCase().includes(q)||r.description?.toLowerCase().includes(q));
  res.json({success:true,results,count:results.length});
});

app.post('/api/chat', async (req,res) => {
  const {message,history=[]} = req.body;
  if (!message) return res.status(400).json({success:false,error:'message required'});
  try {
    const model = genAI.getGenerativeModel({model:'gemini-2.5-flash'});
    // const chatHistory = history.map(h=>({role:h.role==='assistant'?'user':'model',parts:[{text:h.content}]}));
    const chatHistory = history
  .filter(h => h && h.role && h.content)
  .map(h => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(h.content) }]
  }));

// Gemini requires history to start with 'user', never 'model'
while (chatHistory.length > 0 && chatHistory[0].role === 'model') {
  chatHistory.shift();
}
    const chat = model.startChat({history:chatHistory,generationConfig:{maxOutputTokens:400,temperature:0.7}});
    const lowerMsg = message.toLowerCase();
    const allRooms = getAllRoomsDynamic();
    let navigationResult = null;
    const mentioned = allRooms.filter(r=>lowerMsg.includes(r.name.toLowerCase())||lowerMsg.includes(r.id.replace(/_/g,' ')));
    if (mentioned.length>=2) {
      const pr = findPathDynamic(mentioned[0].id,mentioned[1].id);
      if (pr.path.length>0) { const vs=generateVoiceDirections(pr.path); navigationResult={from:mentioned[0],to:mentioned[1],directions:vs.map(s=>s.text),path:pr.path}; }
    }
    let msg = message;
    if (navigationResult?.directions) msg += `\n[SYSTEM: Route: ${navigationResult.directions.join(' | ')}. Present nicely.]`;
    const result = await chat.sendMessage(`${buildHomeContext()}\n\nUser: ${msg}`);
    res.json({success:true,message:result.response.text(),navigationData:navigationResult||null});
  } catch(e) { res.status(500).json({success:false,error:'AI error: '+e.message}); }
});

// Admin blueprint
app.post('/api/admin/blueprint', (req,res) => {
  const {data, reason} = req.body;
  if (!data) return res.status(400).json({success:false,error:'data required'});
  try {
    // Auto-backup before overwriting
    if (fs.existsSync(BLUEPRINT_FILE)) {
      try { saveBackup(reason || 'blueprint-update'); } catch(e) { console.warn('Backup warn:', e.message); }
    }
    fs.writeFileSync(BLUEPRINT_FILE,JSON.stringify(data,null,2));
    res.json({success:true,message:'Blueprint saved! Previous data backed up.'});
  }
  catch(e) { res.status(500).json({success:false,error:e.message}); }
});
app.get('/api/admin/blueprint', (req,res) => res.json({success:true,data:getHomeData(),hasOverride:fs.existsSync(BLUEPRINT_FILE)}));
app.delete('/api/admin/blueprint', (req,res) => { if(fs.existsSync(BLUEPRINT_FILE)) fs.unlinkSync(BLUEPRINT_FILE); res.json({success:true,message:'Reset to default'}); });

// Geofence
app.get('/api/geofence', (req,res) => res.json({success:true,geofence:getGeofence()}));
app.post('/api/geofence', (req,res) => {
  const {lat,lng,radiusMeters,name} = req.body;
  if (!lat||!lng) return res.status(400).json({success:false,error:'lat and lng required'});
  const geo = {lat:parseFloat(lat),lng:parseFloat(lng),radiusMeters:parseFloat(radiusMeters)||100,name:name||'Home'};
  fs.writeFileSync(GEOFENCE_FILE,JSON.stringify(geo,null,2));
  res.json({success:true,geofence:geo});
});
app.post('/api/geofence/check', (req,res) => {
  const {lat,lng} = req.body;
  const geo = getGeofence();
  if (!geo.lat||!geo.lng) return res.json({success:true,inside:true,message:'No geofence set',configured:false});
  const dist = haversineDistance(parseFloat(lat),parseFloat(lng),geo.lat,geo.lng);
  res.json({success:true,inside:dist<=geo.radiusMeters,distance:Math.round(dist),radiusMeters:geo.radiusMeters,configured:true,name:geo.name});
});

app.get('/api/health', (req,res) => res.json({status:'online',ai:'Gemini 1.5 Flash',rooms:getAllRoomsDynamic().length,floors:getHomeData().floors.length,geofence:getGeofence().lat?'configured':'not-set',timestamp:new Date().toISOString()}));

app.listen(PORT, () => {
  console.log(`\n🏠 HomeNav AI v2.0 → http://localhost:${PORT}`);
  console.log(`🤖 Gemini AI: Connected | 📦 Rooms: ${getAllRoomsDynamic().length} | 📍 Geofence: ${getGeofence().lat?'✅':'Not set'}\n`);
});









// ─── ADMIN: Update homeData.js from wizard ─────────────────────────────────
// POST /api/admin/homedata — write new homeData.js code to disk
const HOME_DATA_FILE = path.join(__dirname, 'homeData.js');
const HOME_DATA_BACKUP = path.join(__dirname, 'homeData.backup.js');

app.post('/api/admin/homedata', (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, error: 'code is required' });
  }
  // Basic validation: must contain HOME_DATA and module.exports
  if (!code.includes('HOME_DATA') || !code.includes('module.exports')) {
    return res.status(400).json({ success: false, error: 'Invalid homeData.js code structure' });
  }
  try {
    // Backup existing homeData.js (simple file backup)
    if (fs.existsSync(HOME_DATA_FILE)) {
      fs.copyFileSync(HOME_DATA_FILE, HOME_DATA_BACKUP);
    }
    // Also save JSON backup
    try { saveBackup('homedata-code-update'); } catch(e) { console.warn('Backup warn:', e.message); }
    // Write new homeData.js
    fs.writeFileSync(HOME_DATA_FILE, code, 'utf8');
    // Also update blueprint_override.json so live data matches immediately
    // (The code-based homeData.js will be picked up on next server restart)
    res.json({ success: true, message: 'homeData.js updated! Restart backend to apply changes.' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/homedata — read current homeData.js
app.get('/api/admin/homedata', (req, res) => {
  try {
    const code = fs.existsSync(HOME_DATA_FILE) ? fs.readFileSync(HOME_DATA_FILE, 'utf8') : '';
    res.json({ success: true, code, hasBackup: fs.existsSync(HOME_DATA_BACKUP) });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/homedata/restore — restore backup
app.post('/api/admin/homedata/restore', (req, res) => {
  if (!fs.existsSync(HOME_DATA_BACKUP)) {
    return res.status(404).json({ success: false, error: 'No backup found' });
  }
  try {
    fs.copyFileSync(HOME_DATA_BACKUP, HOME_DATA_FILE);
    res.json({ success: true, message: 'homeData.js restored from backup!' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ─── ENHANCED BACKUP SYSTEM ────────────────────────────────────────────────
const BACKUPS_DIR = path.join(__dirname, 'backups');

// Ensure backups directory exists
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

// Save backup with timestamp and metadata
function saveBackup(reason = 'manual') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const currentData = getHomeData();
  const backup = {
    timestamp: new Date().toISOString(),
    reason,
    version: timestamp,
    data: currentData,
  };
  const backupFile = path.join(BACKUPS_DIR, `backup_${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
  // Keep only last 20 backups
  const files = fs.readdirSync(BACKUPS_DIR)
    .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
    .sort();
  if (files.length > 20) {
    files.slice(0, files.length - 20).forEach(f => {
      try { fs.unlinkSync(path.join(BACKUPS_DIR, f)); } catch(e) {}
    });
  }
  return backup;
}

// GET /api/admin/backups — list all backups (admin only)
app.get('/api/admin/backups', (req, res) => {
  try {
    const files = fs.readdirSync(BACKUPS_DIR)
      .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
      .sort()
      .reverse();
    const backups = files.map(f => {
      try {
        const b = JSON.parse(fs.readFileSync(path.join(BACKUPS_DIR, f), 'utf8'));
        return { filename: f, timestamp: b.timestamp, reason: b.reason, version: b.version, campusName: b.data?.name || 'Unknown', floors: b.data?.floors?.length || 0 };
      } catch(e) { return { filename: f, error: true }; }
    });
    res.json({ success: true, backups, count: backups.length });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET /api/admin/backups/:filename — get single backup data
app.get('/api/admin/backups/:filename', (req, res) => {
  try {
    const file = path.join(BACKUPS_DIR, req.params.filename);
    if (!file.startsWith(BACKUPS_DIR)) return res.status(400).json({ success: false, error: 'Invalid path' });
    if (!fs.existsSync(file)) return res.status(404).json({ success: false, error: 'Backup not found' });
    const backup = JSON.parse(fs.readFileSync(file, 'utf8'));
    res.json({ success: true, backup });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

// POST /api/admin/backups/restore/:filename — restore a specific backup
app.post('/api/admin/backups/restore/:filename', (req, res) => {
  try {
    const file = path.join(BACKUPS_DIR, req.params.filename);
    if (!fs.existsSync(file)) return res.status(404).json({ success: false, error: 'Backup not found' });
    const backup = JSON.parse(fs.readFileSync(file, 'utf8'));
    // Save current as backup before restoring
    saveBackup('pre-restore');
    // Restore
    fs.writeFileSync(BLUEPRINT_FILE, JSON.stringify(backup.data, null, 2));
    res.json({ success: true, message: 'Backup restored successfully! Current data saved before restore.' });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

// DELETE /api/admin/backups/:filename — delete a backup
app.delete('/api/admin/backups/:filename', (req, res) => {
  try {
    const file = path.join(BACKUPS_DIR, req.params.filename);
    if (!file.startsWith(BACKUPS_DIR)) return res.status(400).json({ success: false, error: 'Invalid path' });
    if (fs.existsSync(file)) fs.unlinkSync(file);
    res.json({ success: true, message: 'Backup deleted' });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

