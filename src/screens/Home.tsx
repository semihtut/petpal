import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Pet } from '../components/Pet';
import { StatsPanel } from '../components/Stats';
import { ActionPanel } from '../components/Actions';
import { TricksPanel } from '../components/Tricks';
import { DailyGiftModal } from '../components/DailyGift';
import { Toast } from '../components/UI';
import { getTrickById } from '../data/tricks';
import type { ActionType, RandomEvent, TrickType } from '../utils/types';
import styles from './Home.module.css';

interface HomeProps {
  onNavigate: (screen: string) => void;
  onPlayMiniGame: (action: ActionType) => void;
}

// Trick animation configurations
const TRICK_ANIMATIONS: Record<TrickType, { emoji: string; animation: string }> = {
  sit: { emoji: '🐕', animation: 'sit' },
  paw: { emoji: '🐾', animation: 'paw' },
  roll: { emoji: '🔄', animation: 'roll' },
  bark: { emoji: '🗣️', animation: 'bark' },
  spin: { emoji: '💫', animation: 'spin' },
};

export function Home({ onNavigate, onPlayMiniGame }: HomeProps) {
  const { t } = useTranslation();
  const pet = useGameStore((state) => state.pet);
  const coins = useGameStore((state) => state.coins);
  const level = useGameStore((state) => state.level);
  const triggerRandomEvent = useGameStore((state) => state.triggerRandomEvent);
  const recordEventWitnessed = useGameStore((state) => state.recordEventWitnessed);
  const canClaimDailyGift = useGameStore((state) => state.canClaimDailyGift);
  const checkUnlockTricks = useGameStore((state) => state.checkUnlockTricks);
  const ageStage = useGameStore((state) => state.ageStage);

  const [showDailyGift, setShowDailyGift] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'reward';
    icon?: string;
  } | null>(null);

  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);

  // Trick animation state
  const [activeTrick, setActiveTrick] = useState<{
    id: TrickType;
    reward: { xp: number; coins: number };
  } | null>(null);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t('home.greeting.morning');
    if (hour >= 12 && hour < 17) return t('home.greeting.afternoon');
    if (hour >= 17 && hour < 21) return t('home.greeting.evening');
    return t('home.greeting.night');
  };

  const handleActionComplete = useCallback(
    (action: ActionType, result: { coinsEarned: number; xpEarned: number }) => {
      // Show feedback
      const feedbackKey = `feedback.${action === 'feed' ? 'fed' : action === 'water' ? 'watered' : action === 'play' ? 'played' : action === 'walk' ? 'walked' : action === 'bath' ? 'bathed' : 'slept'}`;
      setToast({
        message: `${t(feedbackKey)} +${result.coinsEarned}`,
        type: 'success',
        icon: '🪙',
      });

      // Check for random event
      const event = triggerRandomEvent('action');
      if (event) {
        setTimeout(() => {
          setCurrentEvent(event);
          recordEventWitnessed(event.id);
        }, 1500);
      }
    },
    [t, triggerRandomEvent, recordEventWitnessed]
  );

  const handleStatFullAlert = useCallback((message: string) => {
    setToast({
      message,
      type: 'info',
      icon: '💚',
    });
  }, []);

  const handleTrickPerformed = useCallback((trickId: TrickType, reward: { xp: number; coins: number }) => {
    setActiveTrick({ id: trickId, reward });

    // Auto-dismiss after animation
    setTimeout(() => {
      setActiveTrick(null);
    }, 2500);
  }, []);

  const handleEventDismiss = () => {
    setCurrentEvent(null);
  };

  // Check for daily gift on mount
  useEffect(() => {
    if (canClaimDailyGift()) {
      setShowDailyGift(true);
    }
    // Check for new tricks
    const newTricks = checkUnlockTricks();
    if (newTricks.length > 0) {
      setToast({
        message: t('tricks.unlocked'),
        type: 'reward',
        icon: '🎉',
      });
    }
  }, []);

  if (!pet) return null;

  const activeTrickData = activeTrick ? getTrickById(activeTrick.id) : null;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.greeting}>
          <span className={styles.greetingText}>{getGreeting()}</span>
          <span className={styles.petName}>{pet.customName}</span>
        </div>
        <div className={styles.headerStats}>
          {canClaimDailyGift() && (
            <button
              className={styles.giftButton}
              onClick={() => setShowDailyGift(true)}
            >
              🎁
            </button>
          )}
          <div className={styles.coinBadge}>
            <span>🪙</span>
            <span>{coins}</span>
          </div>
          <div className={styles.levelBadge}>
            <span>{t('home.level')}</span>
            <span>{level}</span>
          </div>
        </div>
      </header>

      {/* Age badge */}
      <div className={styles.ageBadge}>
        {ageStage === 'puppy' && '🐶'}
        {ageStage === 'adult' && '🐕'}
        {ageStage === 'senior' && '🦮'}
        <span>{t(`petAge.${ageStage}`)}</span>
      </div>

      {/* Pet Area */}
      <div className={styles.petArea}>
        <Pet />
      </div>

      {/* Stats */}
      <div className={styles.statsArea}>
        <StatsPanel />
      </div>

      {/* Actions */}
      <div className={styles.actionsArea}>
        <ActionPanel
          onActionComplete={handleActionComplete}
          onPlayMiniGame={onPlayMiniGame}
          onStatFullAlert={handleStatFullAlert}
        />
      </div>

      {/* Tricks */}
      <div className={styles.tricksArea}>
        <TricksPanel onTrickPerformed={handleTrickPerformed} />
      </div>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <button className={styles.navButton} onClick={() => onNavigate('tasks')}>
          <span>📋</span>
          <span>{t('tasks.title')}</span>
        </button>
        <button className={styles.navButton} onClick={() => onNavigate('shop')}>
          <span>🛍️</span>
          <span>{t('shop.title')}</span>
        </button>
        <button className={styles.navButton} onClick={() => onNavigate('wardrobe')}>
          <span>👕</span>
          <span>{t('wardrobe.title')}</span>
        </button>
        <button className={styles.navButton} onClick={() => onNavigate('achievements')}>
          <span>🏆</span>
          <span>{t('achievements.title')}</span>
        </button>
        <button className={styles.navButton} onClick={() => onNavigate('settings')}>
          <span>⚙️</span>
          <span>{t('settings.title')}</span>
        </button>
      </nav>

      {/* Toast */}
      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'info'}
        icon={toast?.icon}
        isVisible={!!toast}
        onHide={() => setToast(null)}
      />

      {/* Daily Gift Modal */}
      <DailyGiftModal
        isOpen={showDailyGift}
        onClose={() => setShowDailyGift(false)}
      />

      {/* Trick Animation Overlay */}
      <AnimatePresence>
        {activeTrick && activeTrickData && (
          <motion.div
            className={styles.trickOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.trickAnimation}
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: activeTrick.id === 'spin' ? [0, 360, 720] : [0, -10, 10, 0],
              }}
              transition={{
                duration: activeTrick.id === 'spin' ? 1.5 : 0.8,
                ease: 'easeOut'
              }}
            >
              {/* Pet doing trick */}
              <motion.div
                className={styles.trickPet}
                animate={
                  activeTrick.id === 'sit' ? { y: [0, 10, 10] } :
                  activeTrick.id === 'paw' ? { rotate: [0, -20, 0, -20, 0] } :
                  activeTrick.id === 'roll' ? { rotate: [0, 360] } :
                  activeTrick.id === 'bark' ? { scale: [1, 1.1, 1, 1.1, 1] } :
                  activeTrick.id === 'spin' ? { rotate: [0, 360, 720] } :
                  {}
                }
                transition={{ duration: 1, ease: 'easeInOut' }}
              >
                🐕
              </motion.div>

              {/* Trick effect */}
              <motion.div
                className={styles.trickEffect}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.5, 1.5, 2] }}
                transition={{ duration: 1.5, delay: 0.3 }}
              >
                {TRICK_ANIMATIONS[activeTrick.id].emoji}
              </motion.div>
            </motion.div>

            {/* Trick name and reward */}
            <motion.div
              className={styles.trickInfo}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className={styles.trickName}>{t(activeTrickData.nameKey)}</h3>
              <div className={styles.trickReward}>
                <span>+{activeTrick.reward.coins} 🪙</span>
                <span>+{activeTrick.reward.xp} XP</span>
              </div>
            </motion.div>

            {/* Sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                className={styles.sparkle}
                initial={{
                  opacity: 0,
                  x: 0,
                  y: 0,
                  scale: 0
                }}
                animate={{
                  opacity: [0, 1, 0],
                  x: Math.cos(i * Math.PI / 4) * 100,
                  y: Math.sin(i * Math.PI / 4) * 100,
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1,
                  delay: 0.2 + i * 0.05
                }}
              >
                ✨
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Random Event Modal */}
      {currentEvent && (
        <motion.div
          className={styles.eventOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleEventDismiss}
        >
          <motion.div
            className={styles.eventModal}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.eventIcon}>✨</div>
            <h3 className={styles.eventTitle}>{t('event.surprise')}</h3>
            <p className={styles.eventMessage}>
              {t(currentEvent.messageKey, { name: pet.customName })}
            </p>
            {currentEvent.reward && (
              <div className={styles.eventReward}>
                {currentEvent.reward.coins && <span>+{currentEvent.reward.coins} 🪙</span>}
                {currentEvent.reward.happiness && <span>+{currentEvent.reward.happiness} 😊</span>}
              </div>
            )}
            <button className={styles.eventButton} onClick={handleEventDismiss}>
              {t('event.great')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
