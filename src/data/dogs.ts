import type { DogBreed } from '../utils/types';

export const dogs: DogBreed[] = [
  {
    id: 'dog_01',
    name: {
      tr: 'Pamuk',
      en: 'Fluffy',
    },
    description: {
      tr: 'Minik ve tüylü, enerjik bir oyun arkadaşı!',
      en: 'Tiny and fluffy, an energetic playmate!',
    },
    personality: {
      energyDecayMultiplier: 1.2,
      happinessDecayMultiplier: 0.8,
      hungerDecayMultiplier: 1.1,
      playBonusMultiplier: 1.3,
    },
    specialTrait: {
      id: 'extra_playful',
      description: {
        tr: 'Oyun oynarken ekstra mutluluk kazanır!',
        en: 'Gains extra happiness while playing!',
      },
    },
  },
  {
    id: 'dog_02',
    name: {
      tr: 'Karamel',
      en: 'Caramel',
    },
    description: {
      tr: 'Sakin ve sadık, mükemmel bir dost.',
      en: 'Calm and loyal, a perfect companion.',
    },
    personality: {
      energyDecayMultiplier: 0.9,
      happinessDecayMultiplier: 1.0,
      hungerDecayMultiplier: 1.0,
      playBonusMultiplier: 1.0,
    },
    specialTrait: {
      id: 'balanced',
      description: {
        tr: 'Dengeli bir karaktere sahip.',
        en: 'Has a balanced personality.',
      },
    },
  },
  {
    id: 'dog_03',
    name: {
      tr: 'Cesur',
      en: 'Brave',
    },
    description: {
      tr: 'Büyük ve güçlü, korumacı bir kalp.',
      en: 'Big and strong, with a protective heart.',
    },
    personality: {
      energyDecayMultiplier: 0.8,
      happinessDecayMultiplier: 1.1,
      hungerDecayMultiplier: 1.2,
      playBonusMultiplier: 1.1,
    },
    specialTrait: {
      id: 'big_appetite',
      description: {
        tr: 'Daha çok yer ama daha dayanıklı!',
        en: 'Eats more but has more stamina!',
      },
    },
  },
  {
    id: 'dog_04',
    name: {
      tr: 'Fındık',
      en: 'Hazel',
    },
    description: {
      tr: 'Uzun kulaklı, meraklı bir kaşif.',
      en: 'Long-eared, curious explorer.',
    },
    personality: {
      energyDecayMultiplier: 1.1,
      happinessDecayMultiplier: 0.9,
      hungerDecayMultiplier: 1.0,
      playBonusMultiplier: 1.2,
    },
    specialTrait: {
      id: 'explorer',
      description: {
        tr: 'Gezintilerde gizli ödüller bulabilir!',
        en: 'Can find hidden rewards on walks!',
      },
    },
  },
  {
    id: 'dog_05',
    name: {
      tr: 'Ponçik',
      en: 'Pudgy',
    },
    description: {
      tr: 'Pofuduk ve tembel, uyumayı sever.',
      en: 'Fluffy and lazy, loves to sleep.',
    },
    personality: {
      energyDecayMultiplier: 0.7,
      happinessDecayMultiplier: 1.2,
      hungerDecayMultiplier: 0.9,
      playBonusMultiplier: 0.9,
    },
    specialTrait: {
      id: 'sleepy',
      description: {
        tr: 'Uyurken daha hızlı enerji kazanır!',
        en: 'Recovers energy faster while sleeping!',
      },
    },
  },
];

export function getDogById(id: string): DogBreed | undefined {
  return dogs.find((dog) => dog.id === id);
}
