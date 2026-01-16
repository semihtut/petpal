import type { SeasonalEvent } from '../utils/types';

export const seasonalEvents: SeasonalEvent[] = [
  {
    id: 'newyear',
    nameKey: 'events.newyear',
    startDate: '12-25',
    endDate: '01-05',
    theme: 'winter',
    specialItems: ['hat_santa', 'collar_bells', 'floor_snow'],
    specialTasks: ['daily_gift_5', 'weekly_celebrate'],
  },
  {
    id: 'valentine',
    nameKey: 'events.valentine',
    startDate: '02-10',
    endDate: '02-18',
    theme: 'love',
    specialItems: ['hat_heart', 'collar_love', 'toy_heart'],
    specialTasks: ['daily_love_3', 'weekly_bond_20'],
  },
  {
    id: 'spring',
    nameKey: 'events.spring',
    startDate: '03-20',
    endDate: '04-05',
    theme: 'spring',
    specialItems: ['hat_bunny', 'collar_flower', 'floor_grass'],
    specialTasks: ['daily_walk_5', 'weekly_play_30'],
  },
  {
    id: 'summer',
    nameKey: 'events.summer',
    startDate: '06-20',
    endDate: '07-10',
    theme: 'summer',
    specialItems: ['hat_sunglasses', 'collar_beach', 'toy_ball_beach'],
    specialTasks: ['daily_water_5', 'weekly_bath_10'],
  },
  {
    id: 'halloween',
    nameKey: 'events.halloween',
    startDate: '10-25',
    endDate: '11-02',
    theme: 'spooky',
    specialItems: ['hat_witch', 'collar_pumpkin', 'costume_ghost'],
    specialTasks: ['daily_trick_5', 'weekly_spooky'],
  },
];

export function getCurrentEvent(): SeasonalEvent | null {
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentDay = String(now.getDate()).padStart(2, '0');
  const currentMMDD = `${currentMonth}-${currentDay}`;

  for (const event of seasonalEvents) {
    const start = event.startDate;
    const end = event.endDate;

    // Handle year wrap (e.g., Dec 25 - Jan 5)
    if (start > end) {
      if (currentMMDD >= start || currentMMDD <= end) {
        return event;
      }
    } else {
      if (currentMMDD >= start && currentMMDD <= end) {
        return event;
      }
    }
  }

  return null;
}

export function getEventById(id: string): SeasonalEvent | undefined {
  return seasonalEvents.find((e) => e.id === id);
}
