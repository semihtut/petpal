import type { RandomEvent } from '../utils/types';

export const randomEvents: RandomEvent[] = [
  // ==================== LOGIN EVENTS (10% chance) ====================
  {
    id: 'event_butterfly',
    chance: 0.1,
    trigger: 'login',
    minBond: 0,
    messageKey: 'event.butterfly',
    reward: { happiness: 5 },
    animation: 'butterfly',
  },
  {
    id: 'event_bird',
    chance: 0.1,
    trigger: 'login',
    minBond: 0,
    messageKey: 'event.bird',
    reward: { happiness: 5 },
    animation: 'bird',
  },
  {
    id: 'event_sunshine',
    chance: 0.1,
    trigger: 'login',
    minBond: 0,
    messageKey: 'event.sunshine',
    reward: { happiness: 10 },
    animation: 'sunshine',
  },
  {
    id: 'event_rain',
    chance: 0.1,
    trigger: 'login',
    minBond: 0,
    messageKey: 'event.rain',
    animation: 'rain',
  },

  // ==================== ACTION EVENTS (5% chance) ====================
  {
    id: 'event_bonus_food',
    chance: 0.05,
    trigger: 'action',
    minBond: 0,
    messageKey: 'event.bonusFood',
    reward: { happiness: 10 },
  },
  {
    id: 'event_golden_bone',
    chance: 0.05,
    trigger: 'action',
    minBond: 20,
    messageKey: 'event.goldenBone',
    reward: { coins: 20 },
    animation: 'sparkle',
  },
  {
    id: 'event_double_water',
    chance: 0.05,
    trigger: 'action',
    minBond: 0,
    messageKey: 'event.doubleWater',
    reward: { happiness: 10 },
  },
  {
    id: 'event_dance',
    chance: 0.05,
    trigger: 'action',
    minBond: 30,
    messageKey: 'event.dance',
    reward: { happiness: 15 },
    animation: 'dance',
  },

  // ==================== IDLE EVENTS (3% chance) ====================
  {
    id: 'event_nap',
    chance: 0.03,
    trigger: 'idle',
    minBond: 0,
    messageKey: 'event.nap',
    animation: 'sleep',
  },
  {
    id: 'event_tail_chase',
    chance: 0.03,
    trigger: 'idle',
    minBond: 10,
    messageKey: 'event.tailChase',
    animation: 'spin',
  },
  {
    id: 'event_sneeze',
    chance: 0.03,
    trigger: 'idle',
    minBond: 0,
    messageKey: 'event.sneeze',
  },
  {
    id: 'event_yawn',
    chance: 0.03,
    trigger: 'idle',
    minBond: 0,
    messageKey: 'event.yawn',
    animation: 'yawn',
  },
  {
    id: 'event_scratch',
    chance: 0.03,
    trigger: 'idle',
    minBond: 0,
    messageKey: 'event.scratch',
  },
  {
    id: 'event_roll',
    chance: 0.03,
    trigger: 'idle',
    minBond: 20,
    messageKey: 'event.roll',
    animation: 'roll',
  },

  // ==================== BOND-BASED SPECIAL EVENTS (Bond 60+) ====================
  {
    id: 'event_gift',
    chance: 0.03,
    trigger: 'login',
    minBond: 60,
    messageKey: 'event.gift',
    reward: { coins: 15 },
    animation: 'gift',
  },
  {
    id: 'event_heart',
    chance: 0.05,
    trigger: 'action',
    minBond: 60,
    messageKey: 'event.heart',
    reward: { happiness: 10 },
    animation: 'heart',
  },
  {
    id: 'event_sing',
    chance: 0.03,
    trigger: 'idle',
    minBond: 70,
    messageKey: 'event.sing',
    animation: 'sing',
  },
  {
    id: 'event_paw',
    chance: 0.05,
    trigger: 'action',
    minBond: 50,
    messageKey: 'event.paw',
    reward: { coins: 3 },
    animation: 'paw',
  },
];

export function getRandomEvent(
  trigger: RandomEvent['trigger'],
  bond: number
): RandomEvent | null {
  const eligibleEvents = randomEvents.filter(
    (event) => event.trigger === trigger && bond >= event.minBond
  );

  if (eligibleEvents.length === 0) return null;

  // Roll for each eligible event
  for (const event of eligibleEvents) {
    if (Math.random() < event.chance) {
      return event;
    }
  }

  return null;
}

export function getEventById(id: string): RandomEvent | undefined {
  return randomEvents.find((event) => event.id === id);
}
