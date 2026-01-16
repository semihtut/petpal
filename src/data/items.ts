import type { Item } from '../utils/types';

export const items: Item[] = [
  // ==================== HATS ====================
  {
    id: 'hat_01',
    category: 'hat',
    nameKey: 'item.hat.beanie',
    price: 100,
    isRare: false,
  },
  {
    id: 'hat_02',
    category: 'hat',
    nameKey: 'item.hat.cowboy',
    price: 150,
    isRare: false,
  },
  {
    id: 'hat_03',
    category: 'hat',
    nameKey: 'item.hat.crown',
    price: 300,
    isRare: false,
  },
  {
    id: 'hat_04',
    category: 'hat',
    nameKey: 'item.hat.party',
    price: 120,
    isRare: false,
  },
  {
    id: 'hat_05',
    category: 'hat',
    nameKey: 'item.hat.chef',
    price: 180,
    isRare: false,
  },
  {
    id: 'hat_06',
    category: 'hat',
    nameKey: 'item.hat.pirate',
    price: 200,
    isRare: false,
  },
  {
    id: 'hat_07',
    category: 'hat',
    nameKey: 'item.hat.halo',
    price: 250,
    isRare: false,
  },
  {
    id: 'hat_08',
    category: 'hat',
    nameKey: 'item.hat.flower',
    price: 280,
    isRare: false,
  },
  {
    id: 'hat_09',
    category: 'hat',
    nameKey: 'item.hat.unicorn',
    price: 400,
    isRare: true,
  },
  {
    id: 'hat_10',
    category: 'hat',
    nameKey: 'item.hat.golden',
    price: 500,
    isRare: true,
  },

  // ==================== COLLARS ====================
  {
    id: 'collar_01',
    category: 'collar',
    nameKey: 'item.collar.red',
    price: 80,
    isRare: false,
  },
  {
    id: 'collar_02',
    category: 'collar',
    nameKey: 'item.collar.blue',
    price: 80,
    isRare: false,
  },
  {
    id: 'collar_03',
    category: 'collar',
    nameKey: 'item.collar.bow',
    price: 150,
    isRare: false,
  },
  {
    id: 'collar_04',
    category: 'collar',
    nameKey: 'item.collar.bell',
    price: 120,
    isRare: false,
  },
  {
    id: 'collar_05',
    category: 'collar',
    nameKey: 'item.collar.bandana',
    price: 100,
    isRare: false,
  },
  {
    id: 'collar_06',
    category: 'collar',
    nameKey: 'item.collar.diamond',
    price: 350,
    isRare: true,
  },
  {
    id: 'collar_07',
    category: 'collar',
    nameKey: 'item.collar.rainbow',
    price: 300,
    isRare: false,
  },
  {
    id: 'collar_08',
    category: 'collar',
    nameKey: 'item.collar.gold',
    price: 450,
    isRare: true,
  },

  // ==================== FLOORS ====================
  {
    id: 'floor_01',
    category: 'floor',
    nameKey: 'item.floor.wood',
    price: 0,
    isRare: false,
    isDefault: true,
  },
  {
    id: 'floor_02',
    category: 'floor',
    nameKey: 'item.floor.carpet',
    price: 150,
    isRare: false,
  },
  {
    id: 'floor_03',
    category: 'floor',
    nameKey: 'item.floor.grass',
    price: 200,
    isRare: false,
  },
  {
    id: 'floor_04',
    category: 'floor',
    nameKey: 'item.floor.marble',
    price: 300,
    isRare: false,
  },
  {
    id: 'floor_05',
    category: 'floor',
    nameKey: 'item.floor.cloud',
    price: 400,
    isRare: true,
  },

  // ==================== WALLS ====================
  {
    id: 'wall_01',
    category: 'wall',
    nameKey: 'item.wall.beige',
    price: 0,
    isRare: false,
    isDefault: true,
  },
  {
    id: 'wall_02',
    category: 'wall',
    nameKey: 'item.wall.blue',
    price: 100,
    isRare: false,
  },
  {
    id: 'wall_03',
    category: 'wall',
    nameKey: 'item.wall.pink',
    price: 100,
    isRare: false,
  },
  {
    id: 'wall_04',
    category: 'wall',
    nameKey: 'item.wall.forest',
    price: 250,
    isRare: false,
  },
  {
    id: 'wall_05',
    category: 'wall',
    nameKey: 'item.wall.space',
    price: 350,
    isRare: true,
  },

  // ==================== BEDS ====================
  {
    id: 'bed_01',
    category: 'bed',
    nameKey: 'item.bed.simple',
    price: 0,
    isRare: false,
    isDefault: true,
  },
  {
    id: 'bed_02',
    category: 'bed',
    nameKey: 'item.bed.pillow',
    price: 200,
    isRare: false,
  },
  {
    id: 'bed_03',
    category: 'bed',
    nameKey: 'item.bed.castle',
    price: 350,
    isRare: false,
  },
  {
    id: 'bed_04',
    category: 'bed',
    nameKey: 'item.bed.cloud',
    price: 500,
    isRare: true,
  },

  // ==================== TOYS ====================
  {
    id: 'toy_01',
    category: 'toy',
    nameKey: 'item.toy.ball',
    price: 0,
    isRare: false,
    isDefault: true,
  },
  {
    id: 'toy_02',
    category: 'toy',
    nameKey: 'item.toy.tennis',
    price: 100,
    isRare: false,
    effect: {
      type: 'playBonus',
      value: 0.05,
    },
  },
  {
    id: 'toy_03',
    category: 'toy',
    nameKey: 'item.toy.bone',
    price: 150,
    isRare: false,
  },
  {
    id: 'toy_04',
    category: 'toy',
    nameKey: 'item.toy.teddy',
    price: 200,
    isRare: false,
    effect: {
      type: 'happinessBonus',
      value: 0.03,
    },
  },
  {
    id: 'toy_05',
    category: 'toy',
    nameKey: 'item.toy.frisbee',
    price: 250,
    isRare: false,
    effect: {
      type: 'playBonus',
      value: 0.1,
    },
  },
];

export function getItemById(id: string): Item | undefined {
  return items.find((item) => item.id === id);
}

export function getItemsByCategory(category: Item['category']): Item[] {
  return items.filter((item) => item.category === category);
}
