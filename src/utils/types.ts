// ==================== CORE TYPES ====================

export type Language = 'tr' | 'en';

export type BondTier =
  | 'stranger'      // 0-20
  | 'acquaintance'  // 21-40
  | 'friend'        // 41-60
  | 'bestFriend'    // 61-80
  | 'soulmate';     // 81-100

export type TaskType = 'daily' | 'weekly';
export type TaskStatus = 'active' | 'completed' | 'expired';

export type PetMood =
  | 'happy'
  | 'neutral'
  | 'hungry'
  | 'thirsty'
  | 'tired'
  | 'dirty'
  | 'sad';

export type ActionType =
  | 'feed'
  | 'water'
  | 'play'
  | 'walk'
  | 'bath'
  | 'sleep';

export type TrickType =
  | 'sit'
  | 'paw'
  | 'roll'
  | 'bark'
  | 'spin';

export type PetAgeStage = 'puppy' | 'adult' | 'senior';

export type MiniGameType =
  | 'ballCatch'
  | 'bubblePop'
  | 'boneSearch'
  | 'portionSelect'
  | 'dreamCatch';

export type ItemCategory =
  | 'hat'
  | 'collar'
  | 'floor'
  | 'wall'
  | 'bed'
  | 'toy'
  | 'food';

export type RandomEventTrigger = 'login' | 'action' | 'idle';

// ==================== INTERFACES ====================

export interface Stats {
  hunger: number;      // 0-100
  thirst: number;      // 0-100
  happiness: number;   // 0-100
  energy: number;      // 0-100
  hygiene: number;     // 0-100
}

export interface DogBreed {
  id: string;
  name: {
    tr: string;
    en: string;
  };
  description: {
    tr: string;
    en: string;
  };
  personality: {
    energyDecayMultiplier: number;
    happinessDecayMultiplier: number;
    hungerDecayMultiplier: number;
    playBonusMultiplier: number;
  };
  specialTrait: {
    id: string;
    description: {
      tr: string;
      en: string;
    };
  };
}

export interface Pet {
  breedId: string;
  customName: string;
  createdAt: number;
}

export interface Trick {
  id: TrickType;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  requiredBond: number;
  xpReward: number;
  coinReward: number;
}

export interface DailyGift {
  day: number;
  coins: number;
  xp: number;
  item?: string;
  isRare: boolean;
}

export interface SeasonalEvent {
  id: string;
  nameKey: string;
  startDate: string; // MM-DD format
  endDate: string;
  theme: string;
  specialItems: string[];
  specialTasks: string[];
}

export interface Task {
  id: string;
  type: TaskType;
  descriptionKey: string;
  target: number;
  current: number;
  reward: {
    coins: number;
    xp: number;
    item?: string;
  };
  completed: boolean;
}

export interface Streak {
  current: number;
  longest: number;
  lastLoginDate: string; // YYYY-MM-DD
  todayCollected: boolean;
}

export interface Achievement {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  category: 'care' | 'progress' | 'streak' | 'discovery';
  target: number;
  reward: {
    coins: number;
    item?: string;
  };
}

export interface AchievementProgress {
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
}

export interface Statistics {
  totalFeeds: number;
  totalWaters: number;
  totalPlays: number;
  totalWalks: number;
  totalBaths: number;
  totalSleeps: number;
  totalMiniGames: number;
  totalActions: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  daysPlayed: number;
  randomEventsWitnessed: number;
}

export interface EquippedItems {
  hat: string | null;
  collar: string | null;
  floor: string;
  wall: string;
  bed: string;
  toy: string;
}

export interface Inventory {
  ownedItems: string[];
  equippedItems: EquippedItems;
}

export interface Settings {
  language: Language;
  musicVolume: number;
  sfxVolume: number;
  petSoundVolume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

export interface Item {
  id: string;
  category: ItemCategory;
  nameKey: string;
  price: number;
  isRare: boolean;
  isDefault?: boolean;
  effect?: {
    type: 'playBonus' | 'happinessBonus';
    value: number;
  };
}

export interface RandomEvent {
  id: string;
  chance: number;
  trigger: RandomEventTrigger;
  minBond: number;
  messageKey: string;
  reward?: {
    coins?: number;
    xp?: number;
    happiness?: number;
    item?: string;
  };
  animation?: string;
}

// ==================== GAME STATE ====================

export interface GameState {
  // Version
  version: string;

  // Onboarding
  isOnboarded: boolean;

  // Pet
  pet: Pet | null;

  // Stats
  stats: Stats;

  // Time tracking
  lastUpdate: number;
  lastDailyReset: string;
  lastWeeklyReset: string;

  // Progress
  xp: number;
  level: number;
  bond: number;
  bondTier: BondTier;
  coins: number;

  // Streak
  streak: Streak;

  // Tasks
  dailyTasks: Task[];
  weeklyTask: Task | null;

  // Achievements
  achievements: Record<string, AchievementProgress>;

  // Statistics
  statistics: Statistics;

  // Inventory
  inventory: Inventory;

  // Settings
  settings: Settings;

  // Random events
  lastRandomEvent: number;
  seenEvents: string[];

  // Daily gift box
  lastDailyGiftDate: string;
  dailyGiftStreak: number;

  // Tricks
  unlockedTricks: TrickType[];
  lastTrickPerformed: number;

  // Pet age
  ageStage: PetAgeStage;
}

// ==================== ACTION PAYLOADS ====================

export interface ActionResult {
  statsChange: Partial<Stats>;
  coinsEarned: number;
  xpEarned: number;
  bondEarned: number;
}

export interface MiniGameResult {
  score: number;
  maxScore: number;
  bonusCoins: number;
  bonusStats: Partial<Stats>;
}
