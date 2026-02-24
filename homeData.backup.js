
const HOME_DATA = {
  name: "Munshi Singh Nivas",
  address: "Your Home — Wi-Fi Network",
  floors: [
    {
      id: "ground",
      name: "Ground Floor",
      label: "G",
      rooms: [
        {
          id: "baranda_fs3",
          name: "Baranda",
          type: "entrance",
          icon: "🚪",
          x: 3, y: 3,
          width: 42, height: 28,
          description: "Baranda on Ground Floor",
          connectedTo: ["mai_kothli_sss", "dokan_kothli_k3l", "c1_m1w"]
        },
        {
          id: "mai_kothli_sss",
          name: "Mai Kothli",
          type: "study",
          icon: "📚",
          x: 53, y: 3,
          width: 42, height: 28,
          description: "Mai Kothli on Ground Floor",
          connectedTo: ["baranda_fs3"]
        },
        {
          id: "dokan_kothli_k3l",
          name: "Dokan Kothli",
          type: "study",
          icon: "📚",
          x: 3, y: 38,
          width: 42, height: 28,
          description: "Dokan Kothli on Ground Floor",
          connectedTo: ["baranda_fs3"]
        },
        {
          id: "c1_m1w",
          name: "C1",
          type: "corridor",
          icon: "🛤️",
          x: 53, y: 38,
          width: 44, height: 10,
          description: "C1 on Ground Floor",
          connectedTo: ["baranda_fs3", "c2_die", "dadi_room_o38", "stairs_oxj", "seating_hall_e06"]
        },
        {
          id: "c2_die",
          name: "C2",
          type: "corridor",
          icon: "🛤️",
          x: 3, y: 73,
          width: 44, height: 10,
          description: "C2 on Ground Floor",
          connectedTo: ["c1_m1w", "mai_room1_ciy", "mai_room2_c0p", "mai_kitchen_5n6"]
        },
        {
          id: "dadi_room_o38",
          name: "Dadi Room",
          type: "bedroom",
          icon: "🛏️",
          x: 53, y: 73,
          width: 42, height: 28,
          description: "Dadi Room on Ground Floor",
          connectedTo: ["c1_m1w"]
        },
        {
          id: "mai_room1_ciy",
          name: "Mai Room1",
          type: "bedroom",
          icon: "🛏️",
          x: 3, y: 108,
          width: 42, height: 28,
          description: "Mai Room1 on Ground Floor",
          connectedTo: ["c2_die"]
        },
        {
          id: "mai_room2_c0p",
          name: "Mai Room2",
          type: "bedroom",
          icon: "🛏️",
          x: 53, y: 108,
          width: 42, height: 28,
          description: "Mai Room2 on Ground Floor",
          connectedTo: ["c2_die"]
        },
        {
          id: "mai_kitchen_5n6",
          name: "Mai Kitchen",
          type: "kitchen",
          icon: "🍳",
          x: 3, y: 143,
          width: 42, height: 28,
          description: "Mai Kitchen on Ground Floor",
          connectedTo: ["c2_die"]
        },
        {
          id: "stairs_oxj",
          name: "Stairs",
          type: "staircase",
          icon: "🪜",
          x: 53, y: 143,
          width: 42, height: 28,
          description: "Stairs on Ground Floor",
          connectedTo: ["c1_m1w", "c11_2nl"]
        },
        {
          id: "devta_room_y4g",
          name: "Devta Room",
          type: "bedroom",
          icon: "🛏️",
          x: 53, y: 178,
          width: 42, height: 28,
          description: "Devta Room on Ground Floor",
          connectedTo: ["seating_hall_e06"]
        },
        {
          id: "bari_mummy_room_7fs",
          name: "Bari Mummy Room",
          type: "bedroom",
          icon: "🛏️",
          x: 3, y: 213,
          width: 42, height: 28,
          description: "Bari Mummy Room on Ground Floor",
          connectedTo: ["seating_hall_e06"]
        },
        {
          id: "mummy_room_b79",
          name: "Mummy Room",
          type: "bedroom",
          icon: "🛏️",
          x: 53, y: 213,
          width: 42, height: 28,
          description: "Mummy Room on Ground Floor",
          connectedTo: ["c3_6gn"]
        },
        {
          id: "seating_hall_e06",
          name: "Seating Hall",
          type: "living",
          icon: "🛋️",
          x: 53, y: 213,
          width: 42, height: 28,
          description: "Seating Hall on Ground Floor",
          connectedTo: ["c1_m1w", "devta_room_y4g", "bari_mummy_room_7fs", "c3_6gn"]
        },
        {
          id: "c3_6gn",
          name: "C3",
          type: "corridor",
          icon: "🛤️",
          x: 3, y: 248,
          width: 44, height: 10,
          description: "C3 on Ground Floor",
          connectedTo: ["mummy_room_b79", "seating_hall_e06", "angan_3ks"]
        },
        {
          id: "angan_3ks",
          name: "Angan",
          type: "living",
          icon: "🛋️",
          x: 53, y: 248,
          width: 42, height: 28,
          description: "Angan on Ground Floor",
          connectedTo: ["c3_6gn", "bari_mummy_chula_p1s", "mummy_chula_ex7", "bari_mummy_kitchen_lg5", "mummy_kitchen_ij5", "old_bathroom_l0x", "c4_ucr"]
        },
        {
          id: "bari_mummy_chula_p1s",
          name: "Bari Mummy Chula",
          type: "kitchen",
          icon: "🍳",
          x: 3, y: 283,
          width: 42, height: 28,
          description: "Bari Mummy Chula on Ground Floor",
          connectedTo: ["angan_3ks"]
        },
        {
          id: "mummy_chula_ex7",
          name: "Mummy Chula",
          type: "kitchen",
          icon: "🍳",
          x: 53, y: 283,
          width: 42, height: 28,
          description: "Mummy Chula on Ground Floor",
          connectedTo: ["angan_3ks"]
        },
        {
          id: "bari_mummy_kitchen_lg5",
          name: "Bari Mummy Kitchen",
          type: "kitchen",
          icon: "🍳",
          x: 3, y: 318,
          width: 42, height: 28,
          description: "Bari Mummy Kitchen on Ground Floor",
          connectedTo: ["angan_3ks"]
        },
        {
          id: "mummy_kitchen_ij5",
          name: "Mummy Kitchen",
          type: "kitchen",
          icon: "🍳",
          x: 53, y: 318,
          width: 42, height: 28,
          description: "Mummy Kitchen on Ground Floor",
          connectedTo: ["angan_3ks"]
        },
        {
          id: "old_bathroom_l0x",
          name: "Old Bathroom",
          type: "bathroom",
          icon: "🚿",
          x: 3, y: 353,
          width: 42, height: 28,
          description: "Old Bathroom on Ground Floor",
          connectedTo: ["angan_3ks"]
        },
        {
          id: "c4_ucr",
          name: "C4",
          type: "corridor",
          icon: "🛤️",
          x: 53, y: 353,
          width: 44, height: 10,
          description: "C4 on Ground Floor",
          connectedTo: ["angan_3ks", "piche_angan_ji1"]
        },
        {
          id: "piche_angan_ji1",
          name: "Piche Angan",
          type: "living",
          icon: "🛋️",
          x: 3, y: 388,
          width: 42, height: 28,
          description: "Piche Angan on Ground Floor",
          connectedTo: ["c4_ucr", "c5_s7x", "dada_ji_room_osj", "western_bathroom_zqm", "traditional_bathroom_hkc"]
        },
        {
          id: "c5_s7x",
          name: "C5",
          type: "corridor",
          icon: "🛤️",
          x: 53, y: 388,
          width: 44, height: 10,
          description: "C5 on Ground Floor",
          connectedTo: ["piche_angan_ji1", "bari_mummy_jarna_ghr_f2a", "mummy_jarna_ghr_ewc"]
        },
        {
          id: "bari_mummy_jarna_ghr_f2a",
          name: "Bari Mummy Jarna Ghr",
          type: "living",
          icon: "🛋️",
          x: 3, y: 423,
          width: 42, height: 28,
          description: "Bari Mummy Jarna Ghr on Ground Floor",
          connectedTo: ["c5_s7x"]
        },
        {
          id: "mummy_jarna_ghr_ewc",
          name: "Mummy Jarna Ghr",
          type: "living",
          icon: "🛋️",
          x: 53, y: 423,
          width: 42, height: 28,
          description: "Mummy Jarna Ghr on Ground Floor",
          connectedTo: ["c5_s7x"]
        },
        {
          id: "dada_ji_room_osj",
          name: "Dada Ji Room",
          type: "bedroom",
          icon: "🛏️",
          x: 3, y: 458,
          width: 42, height: 28,
          description: "Dada Ji Room on Ground Floor",
          connectedTo: ["piche_angan_ji1"]
        },
        {
          id: "western_bathroom_zqm",
          name: "Western Bathroom",
          type: "bathroom",
          icon: "🚿",
          x: 53, y: 458,
          width: 42, height: 28,
          description: "Western Bathroom on Ground Floor",
          connectedTo: ["piche_angan_ji1"]
        },
        {
          id: "traditional_bathroom_hkc",
          name: "Traditional Bathroom",
          type: "bathroom",
          icon: "🚿",
          x: 3, y: 493,
          width: 42, height: 28,
          description: "Traditional Bathroom on Ground Floor",
          connectedTo: ["piche_angan_ji1"]
        },
        {
          id: "bittu_bhiya_room_f7m",
          name: "Bittu Bhiya Room",
          type: "bedroom",
          icon: "🛏️",
          x: 53, y: 493,
          width: 42, height: 28,
          description: "Bittu Bhiya Room on Ground Floor",
          connectedTo: ["bare_papa_nivas_4fj"]
        }
      ]
    },
    {
      id: "first",
      name: "First Floor",
      label: "F",
      rooms: [
        {
          id: "khali_chhat_byk",
          name: "Khali chhat",
          type: "outdoor",
          icon: "🌿",
          x: 3, y: 3,
          width: 42, height: 28,
          description: "Khali chhat on First Floor",
          connectedTo: ["c11_2nl"]
        },
        {
          id: "bare_papa_nivas_4fj",
          name: "Bare Papa Nivas",
          type: "entrance",
          icon: "🚪",
          x: 53, y: 3,
          width: 42, height: 28,
          description: "Bare Papa Nivas on First Floor",
          connectedTo: ["c11_2nl", "bittu_bhiya_room_f7m", "c12_wtd"]
        },
        {
          id: "bare_papa_room_aiq",
          name: "Bare Papa Room",
          type: "bedroom",
          icon: "🛏️",
          x: 3, y: 38,
          width: 42, height: 28,
          description: "Bare Papa Room on First Floor",
          connectedTo: ["c12_wtd"]
        },
        {
          id: "bare_papa_kitchen_bf1",
          name: "Bare papa Kitchen",
          type: "kitchen",
          icon: "🍳",
          x: 53, y: 38,
          width: 42, height: 28,
          description: "Bare papa Kitchen on First Floor",
          connectedTo: ["c12_wtd"]
        },
        {
          id: "c11_2nl",
          name: "C11",
          type: "corridor",
          icon: "🛤️",
          x: 3, y: 73,
          width: 44, height: 10,
          description: "C11 on First Floor",
          connectedTo: ["khali_chhat_byk", "bare_papa_nivas_4fj", "stairs_oxj"]
        },
        {
          id: "c12_wtd",
          name: "C12",
          type: "corridor",
          icon: "🛤️",
          x: 53, y: 73,
          width: 44, height: 10,
          description: "C12 on First Floor",
          connectedTo: ["bare_papa_room_aiq", "bare_papa_kitchen_bf1", "bare_papa_nivas_4fj"]
        }
      ]
    }
  ]
};

// ROOM_GRAPH — Connection map for pathfinding
const ROOM_GRAPH = {
  "baranda_fs3": ["mai_kothli_sss", "dokan_kothli_k3l", "c1_m1w"],
  "mai_kothli_sss": ["baranda_fs3"],
  "dokan_kothli_k3l": ["baranda_fs3"],
  "c1_m1w": ["baranda_fs3", "c2_die", "dadi_room_o38", "stairs_oxj", "seating_hall_e06"],
  "c2_die": ["c1_m1w", "mai_room1_ciy", "mai_room2_c0p", "mai_kitchen_5n6"],
  "dadi_room_o38": ["c1_m1w"],
  "mai_room1_ciy": ["c2_die"],
  "mai_room2_c0p": ["c2_die"],
  "mai_kitchen_5n6": ["c2_die"],
  "stairs_oxj": ["c1_m1w", "c11_2nl"],
  "devta_room_y4g": ["seating_hall_e06"],
  "bari_mummy_room_7fs": ["seating_hall_e06"],
  "mummy_room_b79": ["c3_6gn"],
  "seating_hall_e06": ["c1_m1w", "devta_room_y4g", "bari_mummy_room_7fs", "c3_6gn"],
  "c3_6gn": ["mummy_room_b79", "seating_hall_e06", "angan_3ks"],
  "angan_3ks": ["c3_6gn", "bari_mummy_chula_p1s", "mummy_chula_ex7", "bari_mummy_kitchen_lg5", "mummy_kitchen_ij5", "old_bathroom_l0x", "c4_ucr"],
  "bari_mummy_chula_p1s": ["angan_3ks"],
  "mummy_chula_ex7": ["angan_3ks"],
  "bari_mummy_kitchen_lg5": ["angan_3ks"],
  "mummy_kitchen_ij5": ["angan_3ks"],
  "old_bathroom_l0x": ["angan_3ks"],
  "c4_ucr": ["angan_3ks", "piche_angan_ji1"],
  "piche_angan_ji1": ["c4_ucr", "c5_s7x", "dada_ji_room_osj", "western_bathroom_zqm", "traditional_bathroom_hkc"],
  "c5_s7x": ["piche_angan_ji1", "bari_mummy_jarna_ghr_f2a", "mummy_jarna_ghr_ewc"],
  "bari_mummy_jarna_ghr_f2a": ["c5_s7x"],
  "mummy_jarna_ghr_ewc": ["c5_s7x"],
  "dada_ji_room_osj": ["piche_angan_ji1"],
  "western_bathroom_zqm": ["piche_angan_ji1"],
  "traditional_bathroom_hkc": ["piche_angan_ji1"],
  "khali_chhat_byk": ["c11_2nl"],
  "bare_papa_nivas_4fj": ["c11_2nl", "bittu_bhiya_room_f7m", "c12_wtd"],
  "bare_papa_room_aiq": ["c12_wtd"],
  "bittu_bhiya_room_f7m": ["bare_papa_nivas_4fj"],
  "bare_papa_kitchen_bf1": ["c12_wtd"],
  "c11_2nl": ["khali_chhat_byk", "bare_papa_nivas_4fj", "stairs_oxj"],
  "c12_wtd": ["bare_papa_room_aiq", "bare_papa_kitchen_bf1", "bare_papa_nivas_4fj"]
};

module.exports = { HOME_DATA, ROOM_GRAPH };