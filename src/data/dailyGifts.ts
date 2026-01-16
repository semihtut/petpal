import type { DailyGift } from '../utils/types';

// 7-day rotating gift calendar
export const dailyGifts: DailyGift[] = [
  { day: 1, coins: 20, xp: 5, isRare: false },
  { day: 2, coins: 25, xp: 10, isRare: false },
  { day: 3, coins: 30, xp: 15, isRare: false },
  { day: 4, coins: 40, xp: 20, isRare: false },
  { day: 5, coins: 50, xp: 25, isRare: false },
  { day: 6, coins: 75, xp: 30, isRare: true },
  { day: 7, coins: 100, xp: 50, item: 'hat_party', isRare: true },
];

export function getDailyGift(streak: number): DailyGift {
  const dayIndex = ((streak - 1) % 7);
  return dailyGifts[dayIndex];
}
