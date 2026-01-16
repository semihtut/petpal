import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Pet } from '../components/Pet';
import { StatsPanel } from '../components/Stats';
import { ActionPanel } from '../components/Actions';
import { Toast } from '../components/UI';
import type { ActionType, RandomEvent } from '../utils/types';
import styles from './Home.module.css';

interface HomeProps {
  onNavigate: (screen: string) => void;
  onPlayMiniGame: (action: ActionType) => void;
}

export function Home({ onNavigate, onPlayMiniGame }: HomeProps) {
  const { t } = useTranslation();
  const pet = useGameStore((state) => state.pet);
  const coins = useGameStore((state) => state.coins);
  const level = useGameStore((state) => state.level);
  const triggerRandomEvent = useGameStore((state) => state.triggerRandomEvent);
  const recordEventWitnessed = useGameStore((state) => state.recordEventWitnessed);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'reward';
    icon?: string;
  } | null>(null);

  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);

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

  const handleEventDismiss = () => {
    setCurrentEvent(null);
  };

  if (!pet) return null;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.greeting}>
          <span className={styles.greetingText}>{getGreeting()}</span>
          <span className={styles.petName}>{pet.customName}</span>
        </div>
        <div className={styles.headerStats}>
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
        />
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
