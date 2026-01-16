import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  Stats,
  Pet,
  BondTier,
  ActionType,
  AchievementProgress,
  Settings,
  EquippedItems,
  RandomEvent,
  TrickType,
  PetAgeStage,
  DailyGift,
} from '../utils/types';
import {
  GAME_VERSION,
  INITIAL_STATS,
  INITIAL_COINS,
  INITIAL_XP,
  INITIAL_LEVEL,
  INITIAL_BOND,
  STAT_MIN,
  STAT_MAX,
  BASE_DECAY_RATES,
  MS_PER_HOUR,
  ACTION_EFFECTS,
  getXpForLevel,
  MAX_LEVEL,
  BOND_TIERS,
  MAX_BOND,
  DEFAULT_EQUIPPED_ITEMS,
  DEFAULT_OWNED_ITEMS,
} from '../utils/constants';
import { generateDailyTasks, generateWeeklyTask } from '../data/tasks';
import { getDogById } from '../data/dogs';
import { achievements } from '../data/achievements';
import { getRandomEvent } from '../data/randomEvents';
import { getDailyGift } from '../data/dailyGifts';
import { tricks, getAvailableTricks } from '../data/tricks';

const getInitialState = (): GameState => {
  const today = new Date().toISOString().split('T')[0];
  const monday = getMonday(new Date()).toISOString().split('T')[0];

  return {
    version: GAME_VERSION,
    isOnboarded: false,
    pet: null,
    stats: { ...INITIAL_STATS },
    lastUpdate: Date.now(),
    lastDailyReset: today,
    lastWeeklyReset: monday,
    xp: INITIAL_XP,
    level: INITIAL_LEVEL,
    bond: INITIAL_BOND,
    bondTier: 'stranger',
    coins: INITIAL_COINS,
    streak: {
      current: 0,
      longest: 0,
      lastLoginDate: '',
      todayCollected: false,
    },
    dailyTasks: [],
    weeklyTask: null,
    achievements: initializeAchievements(),
    statistics: {
      totalFeeds: 0,
      totalWaters: 0,
      totalPlays: 0,
      totalWalks: 0,
      totalBaths: 0,
      totalSleeps: 0,
      totalMiniGames: 0,
      totalActions: 0,
      totalCoinsEarned: 0,
      totalCoinsSpent: 0,
      daysPlayed: 0,
      randomEventsWitnessed: 0,
    },
    inventory: {
      ownedItems: [...DEFAULT_OWNED_ITEMS],
      equippedItems: { ...DEFAULT_EQUIPPED_ITEMS },
    },
    settings: {
      language: 'tr',
      musicVolume: 0.8,
      sfxVolume: 1,
      petSoundVolume: 0.6,
      musicEnabled: true,
      sfxEnabled: true,
    },
    lastRandomEvent: 0,
    seenEvents: [],
    lastDailyGiftDate: '',
    dailyGiftStreak: 0,
    unlockedTricks: ['sit'],
    lastTrickPerformed: 0,
    ageStage: 'puppy',
  };
};

function initializeAchievements(): Record<string, AchievementProgress> {
  const result: Record<string, AchievementProgress> = {};
  achievements.forEach((ach) => {
    result[ach.id] = {
      unlocked: false,
      progress: 0,
    };
  });
  return result;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getBondTier(bond: number): BondTier {
  if (bond >= BOND_TIERS.soulmate.min) return 'soulmate';
  if (bond >= BOND_TIERS.bestFriend.min) return 'bestFriend';
  if (bond >= BOND_TIERS.friend.min) return 'friend';
  if (bond >= BOND_TIERS.acquaintance.min) return 'acquaintance';
  return 'stranger';
}

function clampStat(value: number): number {
  return Math.max(STAT_MIN, Math.min(STAT_MAX, Math.round(value)));
}

interface GameActions {
  // Core
  initializeGame: (pet: Pet) => void;
  resetGame: () => void;

  // Stats
  updateStatsFromTime: () => { triggeredEvent: RandomEvent | null };
  performAction: (action: ActionType) => { coinsEarned: number; xpEarned: number };

  // Tasks
  checkAndResetTasks: () => void;
  updateTaskProgress: (taskType: string, amount?: number) => void;
  claimTaskReward: (taskId: string) => void;

  // Streak
  checkStreak: () => void;
  collectStreakReward: () => { coins: number; xp: number };

  // Shop
  purchaseItem: (itemId: string, price: number) => boolean;
  equipItem: (itemId: string, category: keyof EquippedItems) => void;
  unequipItem: (category: 'hat' | 'collar') => void;

  // Achievements
  checkAchievements: () => string[];
  updateAchievementProgress: (achievementId: string, progress: number) => void;

  // Settings
  updateSettings: (settings: Partial<Settings>) => void;

  // XP & Level
  addXp: (amount: number) => boolean;

  // Bond
  addBond: (amount: number) => void;

  // Coins
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;

  // Mini games
  completeMiniGame: (bonusCoins: number, bonusStats: Partial<Stats>) => void;

  // Random events
  triggerRandomEvent: (trigger: 'login' | 'action' | 'idle') => RandomEvent | null;
  recordEventWitnessed: (eventId: string) => void;

  // Statistics
  incrementStatistic: (key: keyof GameState['statistics'], amount?: number) => void;

  // Daily Gift
  canClaimDailyGift: () => boolean;
  claimDailyGift: () => DailyGift | null;

  // Tricks
  performTrick: (trickId: TrickType) => { xp: number; coins: number } | null;
  checkUnlockTricks: () => TrickType[];

  // Pet Age
  checkPetAge: () => PetAgeStage | null;
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      initializeGame: (pet: Pet) => {
        const today = new Date().toISOString().split('T')[0];
        const monday = getMonday(new Date()).toISOString().split('T')[0];

        set({
          isOnboarded: true,
          pet,
          stats: { ...INITIAL_STATS },
          lastUpdate: Date.now(),
          lastDailyReset: today,
          lastWeeklyReset: monday,
          dailyTasks: generateDailyTasks(3),
          weeklyTask: generateWeeklyTask(),
          streak: {
            current: 1,
            longest: 1,
            lastLoginDate: today,
            todayCollected: false,
          },
          statistics: {
            ...get().statistics,
            daysPlayed: 1,
          },
        });
      },

      resetGame: () => {
        set(getInitialState());
      },

      updateStatsFromTime: () => {
        const state = get();
        if (!state.pet) return { triggeredEvent: null };

        const now = Date.now();
        const elapsed = now - state.lastUpdate;
        const hours = elapsed / MS_PER_HOUR;

        // Time anomaly check (future time)
        if (elapsed < -60000) {
          set({ lastUpdate: now });
          return { triggeredEvent: null };
        }

        // Cap at 24 hours of decay
        const cappedHours = Math.min(hours, 24);

        const dog = getDogById(state.pet.breedId);
        const multipliers = dog?.personality || {
          energyDecayMultiplier: 1,
          happinessDecayMultiplier: 1,
          hungerDecayMultiplier: 1,
          playBonusMultiplier: 1,
        };

        const newStats: Stats = {
          hunger: clampStat(
            state.stats.hunger - BASE_DECAY_RATES.hunger * cappedHours * multipliers.hungerDecayMultiplier
          ),
          thirst: clampStat(state.stats.thirst - BASE_DECAY_RATES.thirst * cappedHours),
          happiness: clampStat(
            state.stats.happiness - BASE_DECAY_RATES.happiness * cappedHours * multipliers.happinessDecayMultiplier
          ),
          energy: clampStat(
            state.stats.energy - BASE_DECAY_RATES.energy * cappedHours * multipliers.energyDecayMultiplier
          ),
          hygiene: clampStat(state.stats.hygiene - BASE_DECAY_RATES.hygiene * cappedHours),
        };

        // Check for random event on login if enough time passed
        let triggeredEvent: RandomEvent | null = null;
        if (hours >= 1) {
          triggeredEvent = getRandomEvent('login', state.bond);
          if (triggeredEvent) {
            // Apply event rewards
            if (triggeredEvent.reward?.happiness) {
              newStats.happiness = clampStat(newStats.happiness + triggeredEvent.reward.happiness);
            }
          }
        }

        set({
          stats: newStats,
          lastUpdate: now,
        });

        return { triggeredEvent };
      },

      performAction: (action: ActionType) => {
        const state = get();
        if (!state.pet) return { coinsEarned: 0, xpEarned: 0 };

        const effect = ACTION_EFFECTS[action];
        const dog = getDogById(state.pet.breedId);
        const playMultiplier = dog?.personality.playBonusMultiplier || 1;

        const newStats = { ...state.stats };
        Object.entries(effect.stats).forEach(([stat, change]) => {
          let finalChange: number = change;
          if (action === 'play' && stat === 'happiness') {
            finalChange = Math.round(change * playMultiplier);
          }
          newStats[stat as keyof Stats] = clampStat(newStats[stat as keyof Stats] + finalChange);
        });

        // Update statistics
        const statisticsKey = `total${action.charAt(0).toUpperCase() + action.slice(1)}s` as keyof GameState['statistics'];

        set({
          stats: newStats,
          lastUpdate: Date.now(),
          statistics: {
            ...state.statistics,
            [statisticsKey]: (state.statistics[statisticsKey] as number) + 1,
            totalActions: state.statistics.totalActions + 1,
          },
        });

        // Add rewards
        get().addCoins(effect.coins);
        get().addXp(effect.xp);
        get().addBond(effect.bond);

        // Update task progress
        get().updateTaskProgress(action);
        get().updateTaskProgress('actions');

        return { coinsEarned: effect.coins, xpEarned: effect.xp };
      },

      checkAndResetTasks: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const monday = getMonday(new Date()).toISOString().split('T')[0];

        let newDailyTasks = state.dailyTasks;
        let newWeeklyTask = state.weeklyTask;

        // Reset daily tasks
        if (today !== state.lastDailyReset) {
          newDailyTasks = generateDailyTasks(3);
        }

        // Reset weekly task
        if (monday !== state.lastWeeklyReset) {
          newWeeklyTask = generateWeeklyTask();
        }

        set({
          dailyTasks: newDailyTasks,
          weeklyTask: newWeeklyTask,
          lastDailyReset: today,
          lastWeeklyReset: monday,
        });
      },

      updateTaskProgress: (taskType: string, amount: number = 1) => {
        const state = get();

        // Map action types to task types
        const taskTypeMap: Record<string, string[]> = {
          feed: ['daily_feed', 'weekly_feed_30'],
          water: ['daily_water'],
          play: ['daily_play', 'daily_minigame', 'weekly_minigames_20'],
          walk: ['daily_walk'],
          bath: ['daily_bath'],
          sleep: [],
          actions: ['daily_actions', 'weekly_actions_50'],
          minigame: ['daily_minigame', 'weekly_minigames_20'],
          login: ['weekly_login_7'],
          spend: ['weekly_spend_500'],
          bond: ['weekly_bond_10'],
        };

        const relevantTasks = taskTypeMap[taskType] || [];

        const newDailyTasks = state.dailyTasks.map((task) => {
          if (task.completed) return task;
          const isRelevant = relevantTasks.some((t) => task.id.startsWith(t));
          if (!isRelevant) return task;
          return {
            ...task,
            current: Math.min(task.current + amount, task.target),
          };
        });

        let newWeeklyTask = state.weeklyTask;
        if (newWeeklyTask && !newWeeklyTask.completed) {
          const isRelevant = relevantTasks.some((t) => newWeeklyTask!.id.startsWith(t));
          if (isRelevant) {
            newWeeklyTask = {
              ...newWeeklyTask,
              current: Math.min(newWeeklyTask.current + amount, newWeeklyTask.target),
            };
          }
        }

        set({
          dailyTasks: newDailyTasks,
          weeklyTask: newWeeklyTask,
        });
      },

      claimTaskReward: (taskId: string) => {
        const state = get();

        // Check daily tasks
        const dailyTask = state.dailyTasks.find((t) => t.id === taskId);
        if (dailyTask && dailyTask.current >= dailyTask.target && !dailyTask.completed) {
          get().addCoins(dailyTask.reward.coins);
          get().addXp(dailyTask.reward.xp);

          set({
            dailyTasks: state.dailyTasks.map((t) =>
              t.id === taskId ? { ...t, completed: true } : t
            ),
          });

          get().incrementStatistic('totalCoinsEarned', dailyTask.reward.coins);
          return;
        }

        // Check weekly task
        if (
          state.weeklyTask?.id === taskId &&
          state.weeklyTask.current >= state.weeklyTask.target &&
          !state.weeklyTask.completed
        ) {
          get().addCoins(state.weeklyTask.reward.coins);
          get().addXp(state.weeklyTask.reward.xp);

          set({
            weeklyTask: { ...state.weeklyTask, completed: true },
          });

          get().incrementStatistic('totalCoinsEarned', state.weeklyTask.reward.coins);
        }
      },

      checkStreak: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = state.streak.lastLoginDate;

        if (lastLogin === today) return; // Already logged in today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = state.streak.current;
        let newLongest = state.streak.longest;

        if (lastLogin === yesterdayStr) {
          // Continue streak
          newStreak += 1;
          newLongest = Math.max(newLongest, newStreak);
        } else if (lastLogin !== today) {
          // Streak broken
          newStreak = 1;
        }

        set({
          streak: {
            current: newStreak,
            longest: newLongest,
            lastLoginDate: today,
            todayCollected: false,
          },
          statistics: {
            ...state.statistics,
            daysPlayed: state.statistics.daysPlayed + 1,
          },
        });

        // Update login task
        get().updateTaskProgress('login');
      },

      collectStreakReward: () => {
        const state = get();
        if (state.streak.todayCollected) return { coins: 0, xp: 0 };

        const streakDay = ((state.streak.current - 1) % 7) + 1;
        const rewards = [
          { coins: 10, xp: 0 },
          { coins: 15, xp: 0 },
          { coins: 20, xp: 10 },
          { coins: 25, xp: 0 },
          { coins: 30, xp: 15 },
          { coins: 40, xp: 0 },
          { coins: 50, xp: 25 },
        ];

        const reward = rewards[streakDay - 1];
        get().addCoins(reward.coins);
        get().addXp(reward.xp);

        set({
          streak: {
            ...state.streak,
            todayCollected: true,
          },
        });

        get().incrementStatistic('totalCoinsEarned', reward.coins);

        return reward;
      },

      purchaseItem: (itemId: string, price: number) => {
        const state = get();
        if (state.coins < price) return false;
        if (state.inventory.ownedItems.includes(itemId)) return false;

        set({
          coins: state.coins - price,
          inventory: {
            ...state.inventory,
            ownedItems: [...state.inventory.ownedItems, itemId],
          },
          statistics: {
            ...state.statistics,
            totalCoinsSpent: state.statistics.totalCoinsSpent + price,
          },
        });

        get().updateTaskProgress('spend', price);
        return true;
      },

      equipItem: (itemId: string, category: keyof EquippedItems) => {
        const state = get();
        if (!state.inventory.ownedItems.includes(itemId)) return;

        set({
          inventory: {
            ...state.inventory,
            equippedItems: {
              ...state.inventory.equippedItems,
              [category]: itemId,
            },
          },
        });
      },

      unequipItem: (category: 'hat' | 'collar') => {
        const state = get();
        set({
          inventory: {
            ...state.inventory,
            equippedItems: {
              ...state.inventory.equippedItems,
              [category]: null,
            },
          },
        });
      },

      checkAchievements: () => {
        const state = get();
        const newlyUnlocked: string[] = [];

        // Achievement checks
        const checks: Record<string, () => number> = {
          ach_feed_100: () => state.statistics.totalFeeds,
          ach_water_100: () => state.statistics.totalWaters,
          ach_bath_50: () => state.statistics.totalBaths,
          ach_play_100: () => state.statistics.totalMiniGames,
          ach_walk_50: () => state.statistics.totalWalks,
          ach_sleep_30: () => state.statistics.totalSleeps,
          ach_level_5: () => state.level,
          ach_level_10: () => state.level,
          ach_level_15: () => state.level,
          ach_level_20: () => state.level,
          ach_bond_100: () => state.bond,
          ach_streak_7: () => state.streak.longest,
          ach_streak_30: () => state.streak.longest,
          ach_streak_90: () => state.streak.longest,
          ach_events_10: () => state.statistics.randomEventsWitnessed,
          ach_items_10: () => state.inventory.ownedItems.length,
          ach_minigames_50: () => state.statistics.totalMiniGames,
          ach_coins_1000: () => state.statistics.totalCoinsEarned,
        };

        achievements.forEach((ach) => {
          const progress = state.achievements[ach.id];
          if (progress.unlocked) return;

          const checkFn = checks[ach.id];
          if (!checkFn) return;

          const currentProgress = checkFn();
          if (currentProgress >= ach.target && !progress.unlocked) {
            newlyUnlocked.push(ach.id);
            get().addCoins(ach.reward.coins);
          }
        });

        if (newlyUnlocked.length > 0) {
          const newAchievements = { ...state.achievements };
          newlyUnlocked.forEach((id) => {
            newAchievements[id] = {
              ...newAchievements[id],
              unlocked: true,
              unlockedAt: Date.now(),
              progress: achievements.find((a) => a.id === id)!.target,
            };
          });
          set({ achievements: newAchievements });
        }

        return newlyUnlocked;
      },

      updateAchievementProgress: (achievementId: string, progress: number) => {
        const state = get();
        const current = state.achievements[achievementId];
        if (!current || current.unlocked) return;

        set({
          achievements: {
            ...state.achievements,
            [achievementId]: {
              ...current,
              progress,
            },
          },
        });
      },

      updateSettings: (newSettings: Partial<Settings>) => {
        const state = get();
        set({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        });
      },

      addXp: (amount: number) => {
        const state = get();
        let newXp = state.xp + amount;
        let newLevel = state.level;
        let leveledUp = false;

        while (newLevel < MAX_LEVEL && newXp >= getXpForLevel(newLevel)) {
          newXp -= getXpForLevel(newLevel);
          newLevel++;
          leveledUp = true;
        }

        set({
          xp: newXp,
          level: newLevel,
        });

        if (leveledUp) {
          get().addCoins(50); // Level up bonus
        }

        return leveledUp;
      },

      addBond: (amount: number) => {
        const state = get();
        const newBond = Math.min(state.bond + amount, MAX_BOND);
        const newTier = getBondTier(newBond);

        set({
          bond: newBond,
          bondTier: newTier,
        });

        get().updateTaskProgress('bond', amount);
      },

      addCoins: (amount: number) => {
        const state = get();
        set({
          coins: state.coins + amount,
          statistics: {
            ...state.statistics,
            totalCoinsEarned: state.statistics.totalCoinsEarned + amount,
          },
        });
      },

      spendCoins: (amount: number) => {
        const state = get();
        if (state.coins < amount) return false;
        set({
          coins: state.coins - amount,
          statistics: {
            ...state.statistics,
            totalCoinsSpent: state.statistics.totalCoinsSpent + amount,
          },
        });
        get().updateTaskProgress('spend', amount);
        return true;
      },

      completeMiniGame: (bonusCoins: number, bonusStats: Partial<Stats>) => {
        const state = get();

        const newStats = { ...state.stats };
        Object.entries(bonusStats).forEach(([stat, value]) => {
          newStats[stat as keyof Stats] = clampStat(newStats[stat as keyof Stats] + value);
        });

        set({
          stats: newStats,
          statistics: {
            ...state.statistics,
            totalMiniGames: state.statistics.totalMiniGames + 1,
          },
        });

        get().addCoins(bonusCoins);
        get().updateTaskProgress('minigame');
      },

      triggerRandomEvent: (trigger) => {
        const state = get();
        const now = Date.now();

        // Cooldown check (5 minutes between events)
        if (now - state.lastRandomEvent < 5 * 60 * 1000) {
          return null;
        }

        const event = getRandomEvent(trigger, state.bond);
        if (!event) return null;

        set({ lastRandomEvent: now });
        return event;
      },

      recordEventWitnessed: (eventId: string) => {
        const state = get();
        set({
          seenEvents: [...state.seenEvents, eventId],
          statistics: {
            ...state.statistics,
            randomEventsWitnessed: state.statistics.randomEventsWitnessed + 1,
          },
        });
      },

      incrementStatistic: (key, amount = 1) => {
        const state = get();
        set({
          statistics: {
            ...state.statistics,
            [key]: (state.statistics[key] as number) + amount,
          },
        });
      },

      // Daily Gift
      canClaimDailyGift: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        return state.lastDailyGiftDate !== today;
      },

      claimDailyGift: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (state.lastDailyGiftDate === today) return null;

        // Check if streak continues
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = state.dailyGiftStreak;
        if (state.lastDailyGiftDate === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }

        const gift = getDailyGift(newStreak);

        // Apply rewards
        get().addCoins(gift.coins);
        get().addXp(gift.xp);

        // Add item if present
        if (gift.item && !state.inventory.ownedItems.includes(gift.item)) {
          set({
            inventory: {
              ...state.inventory,
              ownedItems: [...state.inventory.ownedItems, gift.item],
            },
          });
        }

        set({
          lastDailyGiftDate: today,
          dailyGiftStreak: newStreak,
        });

        return gift;
      },

      // Tricks
      performTrick: (trickId: TrickType) => {
        const state = get();
        const now = Date.now();

        // Cooldown check (30 seconds between tricks)
        if (now - state.lastTrickPerformed < 30 * 1000) {
          return null;
        }

        // Check if trick is unlocked
        if (!state.unlockedTricks.includes(trickId)) {
          return null;
        }

        const trick = tricks.find((t) => t.id === trickId);
        if (!trick) return null;

        // Apply rewards
        get().addXp(trick.xpReward);
        get().addCoins(trick.coinReward);
        get().addBond(1);

        set({ lastTrickPerformed: now });

        return { xp: trick.xpReward, coins: trick.coinReward };
      },

      checkUnlockTricks: () => {
        const state = get();
        const available = getAvailableTricks(state.bond);
        const newlyUnlocked: TrickType[] = [];

        available.forEach((trick) => {
          if (!state.unlockedTricks.includes(trick.id)) {
            newlyUnlocked.push(trick.id);
          }
        });

        if (newlyUnlocked.length > 0) {
          set({
            unlockedTricks: [...state.unlockedTricks, ...newlyUnlocked],
          });
        }

        return newlyUnlocked;
      },

      // Pet Age
      checkPetAge: () => {
        const state = get();
        if (!state.pet) return null;

        const ageInDays = Math.floor((Date.now() - state.pet.createdAt) / (1000 * 60 * 60 * 24));

        let newStage: PetAgeStage = 'puppy';
        if (ageInDays >= 30) {
          newStage = 'adult';
        }
        if (ageInDays >= 90) {
          newStage = 'senior';
        }

        if (newStage !== state.ageStage) {
          set({ ageStage: newStage });
          return newStage;
        }

        return null;
      },
    }),
    {
      name: 'petpal-storage',
      version: 1,
    }
  )
);
