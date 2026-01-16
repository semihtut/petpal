import type { Stats } from './types';

// ==================== GAME VERSION ====================
export const GAME_VERSION = '1.0.0';

// ==================== STAT DECAY RATES (per hour) ====================
export const BASE_DECAY_RATES: Stats = {
  hunger: 8,
  thirst: 10,
  happiness: 5,
  energy: 4,
  hygiene: 3,
};

// ==================== STAT LIMITS ====================
export const STAT_MIN = 0;
export const STAT_MAX = 100;
export const STAT_WARNING_THRESHOLD = 30;
export const STAT_CRITICAL_THRESHOLD = 20;

// ==================== INITIAL VALUES ====================
export const INITIAL_STATS: Stats = {
  hunger: 80,
  thirst: 80,
  happiness: 80,
  energy: 80,
  hygiene: 80,
};

export const INITIAL_COINS = 50;
export const INITIAL_XP = 0;
export const INITIAL_LEVEL = 1;
export const INITIAL_BOND = 0;

// ==================== ACTION EFFECTS ====================
export const ACTION_EFFECTS = {
  feed: {
    stats: { hunger: 40, energy: 5 },
    coins: 3,
    xp: 5,
    bond: 1,
  },
  water: {
    stats: { thirst: 50, energy: 5 },
    coins: 3,
    xp: 5,
    bond: 1,
  },
  play: {
    stats: { happiness: 30, energy: -15, hunger: -5 },
    coins: 5,
    xp: 10,
    bond: 2,
  },
  walk: {
    stats: { happiness: 20, energy: -10, hygiene: -10 },
    coins: 5,
    xp: 10,
    bond: 2,
  },
  bath: {
    stats: { hygiene: 60, happiness: 10 },
    coins: 3,
    xp: 5,
    bond: 1,
  },
  sleep: {
    stats: { energy: 40 },
    coins: 3,
    xp: 5,
    bond: 1,
  },
} as const;

// ==================== MINI GAME BONUSES ====================
export const MINI_GAME_BONUS = {
  ballCatch: { perCatch: 10, maxCatches: 5, bonusCoins: 5 },
  bubblePop: { minClean: 70, maxClean: 100, bonusCoins: 5 },
  boneSearch: { perBone: 5, totalBones: 5, bonusCoins: 3, rareItemChance: 0.1 },
  portionSelect: {
    portions: [
      { amount: 1, hunger: 20, happiness: 0 },
      { amount: 2, hunger: 40, happiness: 0 },
      { amount: 3, hunger: 60, happiness: 5 },
    ],
  },
  dreamCatch: { perCatch: 5, maxCatches: 10, bonusCoins: 5 },
} as const;

// ==================== XP AND LEVELING ====================
export const MAX_LEVEL = 20;

export function getXpForLevel(level: number): number {
  return 100 + (level - 1) * 50;
}

export function getTotalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXpForLevel(i);
  }
  return total;
}

// ==================== BOND TIERS ====================
export const BOND_TIERS = {
  stranger: { min: 0, max: 20 },
  acquaintance: { min: 21, max: 40 },
  friend: { min: 41, max: 60 },
  bestFriend: { min: 61, max: 80 },
  soulmate: { min: 81, max: 100 },
} as const;

export const MAX_BOND = 100;

// ==================== STREAK REWARDS ====================
export const STREAK_REWARDS = [
  { day: 1, coins: 10, xp: 0 },
  { day: 2, coins: 15, xp: 0 },
  { day: 3, coins: 20, xp: 10 },
  { day: 4, coins: 25, xp: 0 },
  { day: 5, coins: 30, xp: 15 },
  { day: 6, coins: 40, xp: 0 },
  { day: 7, coins: 50, xp: 25, special: true },
] as const;

// ==================== TIME CONSTANTS ====================
export const MS_PER_HOUR = 1000 * 60 * 60;
export const MS_PER_DAY = MS_PER_HOUR * 24;
export const DAILY_RESET_HOUR = 4; // 04:00
export const WEEKLY_RESET_DAY = 1; // Monday

// ==================== RANDOM EVENT CHANCES ====================
export const RANDOM_EVENT_CHANCE = {
  login: 0.1,
  action: 0.05,
  idle: 0.03,
} as const;

export const IDLE_TIME_FOR_EVENT = 5 * 60 * 1000; // 5 minutes

// ==================== DAILY TASKS COUNT ====================
export const DAILY_TASKS_COUNT = 3;

// ==================== DEFAULT ITEMS ====================
export const DEFAULT_EQUIPPED_ITEMS = {
  hat: null,
  collar: null,
  floor: 'floor_01',
  wall: 'wall_01',
  bed: 'bed_01',
  toy: 'toy_01',
} as const;

export const DEFAULT_OWNED_ITEMS = [
  'floor_01',
  'wall_01',
  'bed_01',
  'toy_01',
];
