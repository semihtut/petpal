import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useTranslation } from '../../hooks/useTranslation';
import { tricks } from '../../data/tricks';
import type { TrickType } from '../../utils/types';
import styles from './Tricks.module.css';

interface TricksPanelProps {
  onTrickPerformed?: (trickId: TrickType) => void;
}

export function TricksPanel({ onTrickPerformed }: TricksPanelProps) {
  const { t } = useTranslation();
  const [performingTrick, setPerformingTrick] = useState<TrickType | null>(null);
  const [lastReward, setLastReward] = useState<{ xp: number; coins: number } | null>(null);

  const bond = useGameStore((state) => state.bond);
  const unlockedTricks = useGameStore((state) => state.unlockedTricks);
  const lastTrickPerformed = useGameStore((state) => state.lastTrickPerformed);
  const performTrick = useGameStore((state) => state.performTrick);

  const cooldownRemaining = Math.max(0, 30 - Math.floor((Date.now() - lastTrickPerformed) / 1000));
  const isOnCooldown = cooldownRemaining > 0;

  const handleTrickClick = (trickId: TrickType) => {
    if (isOnCooldown || !unlockedTricks.includes(trickId)) return;

    const result = performTrick(trickId);
    if (result) {
      setPerformingTrick(trickId);
      setLastReward(result);

      setTimeout(() => {
        setPerformingTrick(null);
        setLastReward(null);
        onTrickPerformed?.(trickId);
      }, 1500);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('tricks.title')}</h3>

      {isOnCooldown && (
        <div className={styles.cooldown}>
          {t('tricks.cooldown')} {cooldownRemaining}s
        </div>
      )}

      <div className={styles.tricksList}>
        {tricks.map((trick) => {
          const isUnlocked = unlockedTricks.includes(trick.id);
          const isPerforming = performingTrick === trick.id;

          return (
            <motion.button
              key={trick.id}
              className={`${styles.trickButton} ${isUnlocked ? styles.unlocked : styles.locked} ${isPerforming ? styles.performing : ''}`}
              onClick={() => handleTrickClick(trick.id)}
              disabled={!isUnlocked || isOnCooldown}
              whileTap={isUnlocked && !isOnCooldown ? { scale: 0.95 } : undefined}
            >
              <span className={styles.trickIcon}>{trick.icon}</span>
              <span className={styles.trickName}>{t(trick.nameKey)}</span>

              {!isUnlocked && (
                <div className={styles.lockOverlay}>
                  <span className={styles.lockIcon}>🔒</span>
                  <span className={styles.lockText}>
                    {t('tricks.requireBond').replace('{bond}', String(trick.requiredBond))}
                  </span>
                </div>
              )}

              <AnimatePresence>
                {isPerforming && lastReward && (
                  <motion.div
                    className={styles.rewardPopup}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: -10 }}
                    exit={{ opacity: 0, y: -30 }}
                  >
                    +{lastReward.coins}🪙 +{lastReward.xp}XP
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <div className={styles.bondProgress}>
        <span>🐕 {t('bond.title')}: {bond}/100</span>
      </div>
    </div>
  );
}
