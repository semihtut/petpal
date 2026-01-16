import type { Task } from '../utils/types';

// Task templates - actual tasks are generated from these
export interface TaskTemplate {
  id: string;
  type: 'daily' | 'weekly';
  descriptionKey: string;
  targetRange: [number, number]; // min, max
  rewardCoins: [number, number];
  rewardXp: number;
  rewardItem?: string;
}

export const dailyTaskTemplates: TaskTemplate[] = [
  {
    id: 'daily_feed',
    type: 'daily',
    descriptionKey: 'task.daily.feed',
    targetRange: [2, 3],
    rewardCoins: [15, 20],
    rewardXp: 25,
  },
  {
    id: 'daily_water',
    type: 'daily',
    descriptionKey: 'task.daily.water',
    targetRange: [2, 3],
    rewardCoins: [15, 20],
    rewardXp: 25,
  },
  {
    id: 'daily_play',
    type: 'daily',
    descriptionKey: 'task.daily.play',
    targetRange: [1, 2],
    rewardCoins: [20, 25],
    rewardXp: 25,
  },
  {
    id: 'daily_walk',
    type: 'daily',
    descriptionKey: 'task.daily.walk',
    targetRange: [1, 2],
    rewardCoins: [20, 25],
    rewardXp: 25,
  },
  {
    id: 'daily_bath',
    type: 'daily',
    descriptionKey: 'task.daily.bath',
    targetRange: [1, 1],
    rewardCoins: [15, 20],
    rewardXp: 25,
  },
  {
    id: 'daily_minigame',
    type: 'daily',
    descriptionKey: 'task.daily.minigame',
    targetRange: [1, 2],
    rewardCoins: [20, 30],
    rewardXp: 25,
  },
  {
    id: 'daily_stats_50',
    type: 'daily',
    descriptionKey: 'task.daily.stats50',
    targetRange: [1, 1],
    rewardCoins: [30, 40],
    rewardXp: 25,
  },
  {
    id: 'daily_actions',
    type: 'daily',
    descriptionKey: 'task.daily.actions',
    targetRange: [5, 8],
    rewardCoins: [25, 35],
    rewardXp: 25,
  },
];

export const weeklyTaskTemplates: TaskTemplate[] = [
  {
    id: 'weekly_login_7',
    type: 'weekly',
    descriptionKey: 'task.weekly.login7',
    targetRange: [7, 7],
    rewardCoins: [200, 200],
    rewardXp: 100,
    rewardItem: 'hat_04',
  },
  {
    id: 'weekly_minigames_20',
    type: 'weekly',
    descriptionKey: 'task.weekly.minigames20',
    targetRange: [20, 20],
    rewardCoins: [150, 150],
    rewardXp: 100,
  },
  {
    id: 'weekly_actions_50',
    type: 'weekly',
    descriptionKey: 'task.weekly.actions50',
    targetRange: [50, 50],
    rewardCoins: [175, 175],
    rewardXp: 100,
  },
  {
    id: 'weekly_daily_complete_5',
    type: 'weekly',
    descriptionKey: 'task.weekly.dailyComplete5',
    targetRange: [5, 5],
    rewardCoins: [200, 200],
    rewardXp: 100,
  },
  {
    id: 'weekly_spend_500',
    type: 'weekly',
    descriptionKey: 'task.weekly.spend500',
    targetRange: [500, 500],
    rewardCoins: [250, 250],
    rewardXp: 100,
  },
  {
    id: 'weekly_bond_10',
    type: 'weekly',
    descriptionKey: 'task.weekly.bond10',
    targetRange: [10, 10],
    rewardCoins: [150, 150],
    rewardXp: 150,
  },
  {
    id: 'weekly_feed_30',
    type: 'weekly',
    descriptionKey: 'task.weekly.feed30',
    targetRange: [30, 30],
    rewardCoins: [125, 125],
    rewardXp: 100,
  },
];

function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDailyTasks(count: number = 3): Task[] {
  const shuffled = [...dailyTaskTemplates].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected.map((template, index) => {
    const target = getRandomInRange(template.targetRange[0], template.targetRange[1]);
    const coins = getRandomInRange(template.rewardCoins[0], template.rewardCoins[1]);

    return {
      id: `${template.id}_${Date.now()}_${index}`,
      type: 'daily' as const,
      descriptionKey: template.descriptionKey,
      target,
      current: 0,
      reward: {
        coins,
        xp: template.rewardXp,
        item: template.rewardItem,
      },
      completed: false,
    };
  });
}

export function generateWeeklyTask(): Task {
  const template = weeklyTaskTemplates[Math.floor(Math.random() * weeklyTaskTemplates.length)];
  const target = getRandomInRange(template.targetRange[0], template.targetRange[1]);
  const coins = getRandomInRange(template.rewardCoins[0], template.rewardCoins[1]);

  return {
    id: `${template.id}_${Date.now()}`,
    type: 'weekly',
    descriptionKey: template.descriptionKey,
    target,
    current: 0,
    reward: {
      coins,
      xp: template.rewardXp,
      item: template.rewardItem,
    },
    completed: false,
  };
}
