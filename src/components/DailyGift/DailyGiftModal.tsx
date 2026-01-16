import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useTranslation } from '../../hooks/useTranslation';
import { getDailyGift } from '../../data/dailyGifts';
import { Button, Modal } from '../UI';
import styles from './DailyGift.module.css';

interface DailyGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyGiftModal({ isOpen, onClose }: DailyGiftModalProps) {
  const { t } = useTranslation();
  const [claimed, setClaimed] = useState(false);
  const [reward, setReward] = useState<{ coins: number; xp: number; item?: string } | null>(null);

  const canClaim = useGameStore((state) => state.canClaimDailyGift());
  const claimDailyGift = useGameStore((state) => state.claimDailyGift);
  const dailyGiftStreak = useGameStore((state) => state.dailyGiftStreak);

  const nextGift = getDailyGift(dailyGiftStreak + 1);

  const handleClaim = () => {
    const gift = claimDailyGift();
    if (gift) {
      setReward(gift);
      setClaimed(true);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setClaimed(false);
      setReward(null);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('dailyGift.title')}</h2>

        {/* Gift streak display */}
        <div className={styles.streakDisplay}>
          <span className={styles.streakLabel}>{t('dailyGift.streak')}</span>
          <span className={styles.streakValue}>{dailyGiftStreak} {t('common.days')}</span>
        </div>

        {/* Gift calendar */}
        <div className={styles.calendar}>
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const gift = getDailyGift(day);
            const currentDay = ((dailyGiftStreak) % 7) + 1;
            const isPast = day < currentDay;
            const isCurrent = day === currentDay;
            const isFuture = day > currentDay;

            return (
              <div
                key={day}
                className={`${styles.calendarDay} ${isPast ? styles.past : ''} ${isCurrent ? styles.current : ''} ${isFuture ? styles.future : ''}`}
              >
                <span className={styles.dayNumber}>{day}</span>
                <span className={styles.dayReward}>
                  {gift.isRare ? '🎁' : '📦'}
                </span>
                <span className={styles.dayCoins}>{gift.coins} 🪙</span>
                {isPast && <span className={styles.checkmark}>✓</span>}
              </div>
            );
          })}
        </div>

        {/* Claim section */}
        {!claimed ? (
          <div className={styles.claimSection}>
            {canClaim ? (
              <>
                <motion.div
                  className={styles.giftBox}
                  animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {nextGift.isRare ? '🎁' : '📦'}
                </motion.div>
                <p className={styles.giftPreview}>
                  {nextGift.coins} 🪙 + {nextGift.xp} XP
                  {nextGift.item && ' + 🎀'}
                </p>
                <Button onClick={handleClaim} fullWidth>
                  {t('dailyGift.open')}
                </Button>
              </>
            ) : (
              <div className={styles.claimed}>
                <span className={styles.claimedIcon}>✓</span>
                <p>{t('dailyGift.claimed')}</p>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            className={styles.rewardSection}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div className={styles.rewardIcon}>🎉</div>
            <h3>{t('dailyGift.congrats')}</h3>
            <div className={styles.rewards}>
              <span className={styles.rewardItem}>+{reward?.coins} 🪙</span>
              <span className={styles.rewardItem}>+{reward?.xp} XP</span>
              {reward?.item && (
                <span className={styles.rewardItem}>+🎀 {t(`item.${reward.item.replace('_', '.')}`)}</span>
              )}
            </div>
            <Button onClick={onClose} fullWidth>
              {t('common.ok')}
            </Button>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
