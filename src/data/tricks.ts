import type { Trick, TrickType } from '../utils/types';

export const tricks: Trick[] = [
  {
    id: 'sit',
    nameKey: 'tricks.sit',
    descriptionKey: 'tricks.sitDesc',
    icon: '🐕',
    requiredBond: 0,
    xpReward: 5,
    coinReward: 2,
  },
  {
    id: 'paw',
    nameKey: 'tricks.paw',
    descriptionKey: 'tricks.pawDesc',
    icon: '🐾',
    requiredBond: 20,
    xpReward: 10,
    coinReward: 5,
  },
  {
    id: 'roll',
    nameKey: 'tricks.roll',
    descriptionKey: 'tricks.rollDesc',
    icon: '🔄',
    requiredBond: 40,
    xpReward: 15,
    coinReward: 8,
  },
  {
    id: 'bark',
    nameKey: 'tricks.bark',
    descriptionKey: 'tricks.barkDesc',
    icon: '🗣️',
    requiredBond: 60,
    xpReward: 20,
    coinReward: 10,
  },
  {
    id: 'spin',
    nameKey: 'tricks.spin',
    descriptionKey: 'tricks.spinDesc',
    icon: '💫',
    requiredBond: 80,
    xpReward: 25,
    coinReward: 15,
  },
];

export function getTrickById(id: TrickType): Trick | undefined {
  return tricks.find((t) => t.id === id);
}

export function getAvailableTricks(bond: number): Trick[] {
  return tricks.filter((t) => t.requiredBond <= bond);
}
