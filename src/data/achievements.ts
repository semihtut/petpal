import type { Achievement } from '../utils/types';

export const achievements: Achievement[] = [
  // ==================== CARE ACHIEVEMENTS ====================
  {
    id: 'ach_feed_100',
    nameKey: 'achievement.gourmet.name',
    descriptionKey: 'achievement.gourmet.desc',
    icon: '🍖',
    category: 'care',
    target: 100,
    reward: { coins: 50 },
  },
  {
    id: 'ach_water_100',
    nameKey: 'achievement.waterFairy.name',
    descriptionKey: 'achievement.waterFairy.desc',
    icon: '💧',
    category: 'care',
    target: 100,
    reward: { coins: 50 },
  },
  {
    id: 'ach_bath_50',
    nameKey: 'achievement.cleanExpert.name',
    descriptionKey: 'achievement.cleanExpert.desc',
    icon: '🛁',
    category: 'care',
    target: 50,
    reward: { coins: 50 },
  },
  {
    id: 'ach_play_100',
    nameKey: 'achievement.playMaster.name',
    descriptionKey: 'achievement.playMaster.desc',
    icon: '🎾',
    category: 'care',
    target: 100,
    reward: { coins: 100 },
  },
  {
    id: 'ach_walk_50',
    nameKey: 'achievement.explorer.name',
    descriptionKey: 'achievement.explorer.desc',
    icon: '🚶',
    category: 'care',
    target: 50,
    reward: { coins: 75 },
  },
  {
    id: 'ach_sleep_30',
    nameKey: 'achievement.sleepRoutine.name',
    descriptionKey: 'achievement.sleepRoutine.desc',
    icon: '😴',
    category: 'care',
    target: 30,
    reward: { coins: 50 },
  },

  // ==================== PROGRESS ACHIEVEMENTS ====================
  {
    id: 'ach_level_5',
    nameKey: 'achievement.beginner.name',
    descriptionKey: 'achievement.beginner.desc',
    icon: '⭐',
    category: 'progress',
    target: 5,
    reward: { coins: 25 },
  },
  {
    id: 'ach_level_10',
    nameKey: 'achievement.experienced.name',
    descriptionKey: 'achievement.experienced.desc',
    icon: '⭐',
    category: 'progress',
    target: 10,
    reward: { coins: 50 },
  },
  {
    id: 'ach_level_15',
    nameKey: 'achievement.expert.name',
    descriptionKey: 'achievement.expert.desc',
    icon: '⭐',
    category: 'progress',
    target: 15,
    reward: { coins: 100 },
  },
  {
    id: 'ach_level_20',
    nameKey: 'achievement.master.name',
    descriptionKey: 'achievement.master.desc',
    icon: '👑',
    category: 'progress',
    target: 20,
    reward: { coins: 200, item: 'hat_10' },
  },
  {
    id: 'ach_bond_100',
    nameKey: 'achievement.soulmate.name',
    descriptionKey: 'achievement.soulmate.desc',
    icon: '💕',
    category: 'progress',
    target: 100,
    reward: { coins: 300 },
  },

  // ==================== STREAK ACHIEVEMENTS ====================
  {
    id: 'ach_streak_7',
    nameKey: 'achievement.oneWeek.name',
    descriptionKey: 'achievement.oneWeek.desc',
    icon: '📅',
    category: 'streak',
    target: 7,
    reward: { coins: 50 },
  },
  {
    id: 'ach_streak_30',
    nameKey: 'achievement.oneMonth.name',
    descriptionKey: 'achievement.oneMonth.desc',
    icon: '📅',
    category: 'streak',
    target: 30,
    reward: { coins: 200, item: 'hat_04' },
  },
  {
    id: 'ach_streak_90',
    nameKey: 'achievement.threeMonths.name',
    descriptionKey: 'achievement.threeMonths.desc',
    icon: '📅',
    category: 'streak',
    target: 90,
    reward: { coins: 500, item: 'collar_06' },
  },

  // ==================== DISCOVERY ACHIEVEMENTS ====================
  {
    id: 'ach_events_10',
    nameKey: 'achievement.butterflyHunter.name',
    descriptionKey: 'achievement.butterflyHunter.desc',
    icon: '🦋',
    category: 'discovery',
    target: 10,
    reward: { coins: 30 },
  },
  {
    id: 'ach_items_10',
    nameKey: 'achievement.collector.name',
    descriptionKey: 'achievement.collector.desc',
    icon: '🎁',
    category: 'discovery',
    target: 10,
    reward: { coins: 50 },
  },
  {
    id: 'ach_decor_5',
    nameKey: 'achievement.decorator.name',
    descriptionKey: 'achievement.decorator.desc',
    icon: '🏠',
    category: 'discovery',
    target: 5,
    reward: { coins: 40 },
  },
  {
    id: 'ach_tasks_50',
    nameKey: 'achievement.taskHunter.name',
    descriptionKey: 'achievement.taskHunter.desc',
    icon: '🎯',
    category: 'discovery',
    target: 50,
    reward: { coins: 100 },
  },
  {
    id: 'ach_minigames_50',
    nameKey: 'achievement.gamer.name',
    descriptionKey: 'achievement.gamer.desc',
    icon: '🎮',
    category: 'discovery',
    target: 50,
    reward: { coins: 75 },
  },
  {
    id: 'ach_coins_1000',
    nameKey: 'achievement.wealthy.name',
    descriptionKey: 'achievement.wealthy.desc',
    icon: '💰',
    category: 'discovery',
    target: 1000,
    reward: { coins: 100 },
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find((ach) => ach.id === id);
}

export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return achievements.filter((ach) => ach.category === category);
}
