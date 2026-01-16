import { useState } from 'react';
import { ActionButton } from './ActionButton';
import { useGameStore } from '../../store/gameStore';
import { useTranslation } from '../../hooks/useTranslation';
import type { ActionType } from '../../utils/types';
import styles from './ActionPanel.module.css';

interface ActionPanelProps {
  onActionComplete?: (action: ActionType, result: { coinsEarned: number; xpEarned: number }) => void;
  onPlayMiniGame?: (action: ActionType) => void;
  onStatFullAlert?: (message: string) => void;
}

// Map actions to the stats they affect
const ACTION_STAT_MAP: Record<ActionType, string | null> = {
  feed: 'hunger',
  water: 'thirst',
  play: 'happiness',
  walk: 'happiness',
  bath: 'hygiene',
  sleep: 'energy',
};

// Threshold for considering a stat "full"
const STAT_FULL_THRESHOLD = 95;

export function ActionPanel({ onActionComplete, onPlayMiniGame, onStatFullAlert }: ActionPanelProps) {
  const { t } = useTranslation();
  const performAction = useGameStore((state) => state.performAction);
  const stats = useGameStore((state) => state.stats);
  const pet = useGameStore((state) => state.pet);
  const [cooldowns, setCooldowns] = useState<Record<ActionType, boolean>>({
    feed: false,
    water: false,
    play: false,
    walk: false,
    bath: false,
    sleep: false,
  });

  const isStatFull = (action: ActionType): boolean => {
    const statKey = ACTION_STAT_MAP[action];
    if (!statKey) return false;
    return stats[statKey as keyof typeof stats] >= STAT_FULL_THRESHOLD;
  };

  const getStatFullMessage = (action: ActionType): string => {
    const statKey = ACTION_STAT_MAP[action];
    if (!statKey) return '';
    return t(`statFull.${statKey}`, { name: pet?.customName || '' });
  };

  const handleAction = (action: ActionType) => {
    if (cooldowns[action]) return;

    // Check if the relevant stat is full
    if (isStatFull(action)) {
      onStatFullAlert?.(getStatFullMessage(action));
      return;
    }

    // Mini game actions
    if (action === 'play' || action === 'bath') {
      onPlayMiniGame?.(action);
      return;
    }

    // Direct actions
    const result = performAction(action);
    onActionComplete?.(action, result);

    // Set cooldown
    setCooldowns((prev) => ({ ...prev, [action]: true }));
    setTimeout(() => {
      setCooldowns((prev) => ({ ...prev, [action]: false }));
    }, 1000);
  };

  // Sleep is only available at night or when energy is low
  const canSleep = stats.energy < 30;

  return (
    <div className={styles.container}>
      <ActionButton
        action="feed"
        onClick={() => handleAction('feed')}
        disabled={cooldowns.feed}
        isFull={isStatFull('feed')}
      />
      <ActionButton
        action="water"
        onClick={() => handleAction('water')}
        disabled={cooldowns.water}
        isFull={isStatFull('water')}
      />
      <ActionButton
        action="play"
        onClick={() => handleAction('play')}
        disabled={cooldowns.play}
        isFull={isStatFull('play')}
      />
      <ActionButton
        action="walk"
        onClick={() => handleAction('walk')}
        disabled={cooldowns.walk}
        isFull={isStatFull('walk')}
      />
      <ActionButton
        action="bath"
        onClick={() => handleAction('bath')}
        disabled={cooldowns.bath}
        isFull={isStatFull('bath')}
      />
      <ActionButton
        action="sleep"
        onClick={() => handleAction('sleep')}
        disabled={cooldowns.sleep || !canSleep}
        isFull={isStatFull('sleep')}
      />
    </div>
  );
}
