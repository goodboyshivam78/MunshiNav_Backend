// pathfinder.js — BFS Pathfinding for Home Navigation

const { ROOM_GRAPH, HOME_DATA } = require('./homeData');

// Get all rooms flat list
function getAllRooms() {
  const rooms = [];
  HOME_DATA.floors.forEach(floor => {
    floor.rooms.forEach(room => {
      rooms.push({ ...room, floorId: floor.id, floorName: floor.name });
    });
  });
  return rooms;
}

// BFS to find shortest path between two rooms
function findPath(startId, endId) {
  if (startId === endId) {
    return { path: [startId], steps: 0 };
  }

  const visited = new Set();
  const queue = [[startId, [startId]]];
  visited.add(startId);

  while (queue.length > 0) {
    const [current, path] = queue.shift();
    const neighbors = ROOM_GRAPH[current] || [];

    for (const neighbor of neighbors) {
      if (neighbor === endId) {
        return { path: [...path, neighbor], steps: path.length };
      }
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return { path: [], steps: -1 }; // No path found
}

// Get room by ID
function getRoomById(id) {
  const all = getAllRooms();
  return all.find(r => r.id === id);
}

// Get room by name (fuzzy match)
function findRoomByName(query) {
  const all = getAllRooms();
  const q = query.toLowerCase().trim();

  // Exact match first
  let found = all.find(r => r.name.toLowerCase() === q);
  if (found) return found;

  // Partial match
  found = all.find(r => r.name.toLowerCase().includes(q));
  if (found) return found;

  // Type match
  found = all.find(r => r.type.toLowerCase().includes(q));
  if (found) return found;

  // Icon/keyword match
  const keywords = {
    'bathroom': ['bathroom', 'toilet', 'washroom', 'restroom', 'wc'],
    'bedroom': ['bedroom', 'room', 'sleep', 'bed'],
    'kitchen': ['kitchen', 'cook', 'food'],
    'living_room': ['living', 'hall', 'lounge', 'tv room'],
    'study_room': ['study', 'office', 'work', 'computer'],
    'dining_room': ['dining', 'eat', 'dinner', 'lunch'],
    'staircase': ['stairs', 'staircase', 'steps', 'stair'],
    'balcony': ['balcony', 'outside', 'terrace', 'outdoor'],
    'main_entrance': ['entrance', 'entry', 'front door', 'door', 'main door'],
  };

  for (const [roomId, kws] of Object.entries(keywords)) {
    if (kws.some(kw => q.includes(kw))) {
      found = all.find(r => r.id === roomId);
      if (found) return found;
    }
  }

  return null;
}

// Generate human-readable directions
function generateDirections(pathIds) {
  const rooms = pathIds.map(id => getRoomById(id));
  const steps = [];

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    if (!room) continue;

    if (i === 0) {
      steps.push(`📍 Start at: **${room.name}** ${room.icon}`);
    } else if (i === rooms.length - 1) {
      steps.push(`🎯 You have arrived at: **${room.name}** ${room.icon}`);
    } else {
      // Check if floor change
      const prev = rooms[i - 1];
      if (prev && prev.floorId !== room.floorId) {
        steps.push(`🪜 Take the staircase to **${room.floorName}**`);
      } else if (room.type === 'corridor') {
        steps.push(`🚶 Walk through the **${room.name}**`);
      } else if (room.type === 'staircase') {
        const next = rooms[i + 1];
        const direction = next && next.floorId === 'first' ? 'up' : 'down';
        steps.push(`🪜 Go **${direction}** the staircase`);
      } else {
        steps.push(`➡️ Pass through **${room.name}**`);
      }
    }
  }

  return steps;
}

module.exports = { findPath, getAllRooms, getRoomById, findRoomByName, generateDirections };
