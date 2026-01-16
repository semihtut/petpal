import { useState } from 'react';
import { ActionButton } from './ActionButton';
import { useGameStore } from '../../store/gameStore';
import type { ActionType } from '../../utils/types';
import styles from './ActionPanel.module.css';

interface ActionPanelProps {
  onActionComplete?: (action: ActionType, result: { coinsEarned: number; xpEarned: number }) => void;
  onPlayMiniGame?: (action: ActionType) => void;
}

export function ActionPanel({ onActionComplete, onPlayMiniGame }: ActionPanelProps) {
  const performAction = useGameStore((state) => state.performAction);
  const stats = useGameStore((state) => state.stats);
  const [cooldowns, setCooldowns] = useState<Record<ActionType, boolean>>({
    feed: false,
    water: false,
    play: false,
    walk: false,
    bath: false,
    sleep: false,
  });

  const handleAction = (action: ActionType) => {
    if (cooldowns[action]) return;

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
      <ActionButton action="feed" onClick={() => handleAction('feed')} disabled={cooldowns.feed} />
      <ActionButton action="water" onClick={() => handleAction('water')} disabled={cooldowns.water} />
      <ActionButton action="play" onClick={() => handleAction('play')} disabled={cooldowns.play} />
      <ActionButton action="walk" onClick={() => handleAction('walk')} disabled={cooldowns.walk} />
      <ActionButton action="bath" onClick={() => handleAction('bath')} disabled={cooldowns.bath} />
      <ActionButton
        action="sleep"
        onClick={() => handleAction('sleep')}
        disabled={cooldowns.sleep || !canSleep}
      />
    </div>
  );
}
