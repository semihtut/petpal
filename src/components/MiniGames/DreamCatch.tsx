import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../UI';
import styles from './MiniGame.module.css';

interface Dream {
  id: number;
  x: number;
  y: number;
  type: 'sheep' | 'star' | 'moon';
  caught: boolean;
}

interface DreamCatchProps {
  onComplete: (score: number, maxScore: number) => void;
  onSkip: () => void;
}

export function DreamCatch({ onComplete, onSkip }: DreamCatchProps) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [caught, setCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);

  const maxDreams = 10;

  const spawnDream = useCallback(() => {
    const types: Dream['type'][] = ['sheep', 'sheep', 'sheep', 'star', 'moon'];
    const newDream: Dream = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 40 + 10,
      type: types[Math.floor(Math.random() * types.length)],
      caught: false,
    };
    setDreams((prev) => [...prev.slice(-8), newDream]);
  }, []);

  const catchDream = (id: number) => {
    setDreams((prev) =>
      prev.map((d) => (d.id === id && !d.caught ? { ...d, caught: true } : d))
    );
    setCaught((c) => Math.min(c + 1, maxDreams));
  };

  // Spawn dreams
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(spawnDream, 800);
    return () => clearInterval(interval);
  }, [gameState, spawnDream]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameState('finished');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setCaught(0);
    setTimeLeft(8);
    setDreams([]);
  };

  const handleFinish = () => {
    onComplete(caught, maxDreams);
  };

  const getDreamEmoji = (type: Dream['type']) => {
    switch (type) {
      case 'sheep':
        return '🐑';
      case 'star':
        return '⭐';
      case 'moon':
        return '🌙';
    }
  };

  return (
    <div className={`${styles.container} ${styles.nightTheme}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('minigame.dreamCatch')}</h2>
        <div className={styles.score}>
          {gameState === 'playing' && <span>⏱️ {timeLeft}s</span>}
          {' '}💤 {caught}
        </div>
      </div>

      {gameState === 'ready' && (
        <div className={styles.readyScreen}>
          <div className={styles.instructions}>
            <span className={styles.instructionIcon}>💤</span>
            <p>{t('minigame.dreamCatch')}</p>
          </div>
          <div className={styles.buttons}>
            <Button onClick={startGame} fullWidth>
              {t('minigame.start')}
            </Button>
            <Button onClick={onSkip} variant="ghost" fullWidth>
              {t('minigame.skip')}
            </Button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className={styles.gameArea}>
          {/* Sleeping pet */}
          <motion.div
            className={styles.sleepingPet}
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            😴
            <span className={styles.sleepZzz}>💤</span>
          </motion.div>

          {/* Dreams floating */}
          <AnimatePresence>
            {dreams.map(
              (dream) =>
                !dream.caught && (
                  <motion.button
                    key={dream.id}
                    className={styles.dream}
                    style={{ left: `${dream.x}%`, top: `${dream.y}%` }}
                    onClick={() => catchDream(dream.id)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: [0, -10, 0],
                      x: [0, 5, -5, 0],
                    }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{
                      y: { duration: 2, repeat: Infinity },
                      x: { duration: 3, repeat: Infinity },
                    }}
                    whileTap={{ scale: 0.8 }}
                  >
                    {getDreamEmoji(dream.type)}
                  </motion.button>
                )
            )}
          </AnimatePresence>
        </div>
      )}

      {gameState === 'finished' && (
        <div className={styles.resultScreen}>
          <div className={styles.resultIcon}>
            {caught >= maxDreams * 0.8 ? '🌟' : caught >= maxDreams * 0.5 ? '😴' : '💤'}
          </div>
          <h3 className={styles.resultTitle}>
            {caught >= maxDreams * 0.8
              ? t('minigame.great')
              : caught >= maxDreams * 0.5
              ? t('minigame.good')
              : t('minigame.tryAgain')}
          </h3>
          <p className={styles.resultScore}>{caught} 💤</p>
          {caught >= maxDreams && (
            <div className={styles.bonus}>
              {t('minigame.bonus')} +5 🪙
            </div>
          )}
          <Button onClick={handleFinish} fullWidth>
            {t('common.done')}
          </Button>
        </div>
      )}
    </div>
  );
}
