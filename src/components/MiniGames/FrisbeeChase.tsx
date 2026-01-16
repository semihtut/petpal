import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../UI';
import styles from './MiniGame.module.css';

interface FrisbeeChaseProps {
  onComplete: (score: number, maxScore: number) => void;
  onSkip: () => void;
}

export function FrisbeeChase({ onComplete, onSkip }: FrisbeeChaseProps) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [frisbeeX, setFrisbeeX] = useState(50);
  const [dogX, setDogX] = useState(50);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [frisbeeFlying, setFrisbeeFlying] = useState(false);

  const maxScore = 10;

  const throwFrisbee = useCallback(() => {
    if (frisbeeFlying) return;

    const newX = Math.random() * 80 + 10;
    setFrisbeeX(newX);
    setFrisbeeFlying(true);

    setTimeout(() => {
      setFrisbeeFlying(false);
    }, 1500);
  }, [frisbeeFlying]);

  const moveDog = (direction: 'left' | 'right') => {
    setDogX((prev) => {
      const newX = direction === 'left' ? prev - 15 : prev + 15;
      return Math.max(10, Math.min(90, newX));
    });
  };

  // Check catch
  useEffect(() => {
    if (!frisbeeFlying) return;

    const checkCatch = setInterval(() => {
      if (Math.abs(dogX - frisbeeX) < 15) {
        setScore((s) => s + 1);
        setFrisbeeFlying(false);
      }
    }, 100);

    return () => clearInterval(checkCatch);
  }, [frisbeeFlying, dogX, frisbeeX]);

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

  // Auto throw frisbee
  useEffect(() => {
    if (gameState !== 'playing' || frisbeeFlying) return;

    const throwTimer = setTimeout(() => {
      throwFrisbee();
    }, 500);

    return () => clearTimeout(throwTimer);
  }, [gameState, frisbeeFlying, throwFrisbee]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(15);
    setDogX(50);
  };

  const handleFinish = () => {
    onComplete(score, maxScore);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Frisbee</h2>
        <div className={styles.score}>
          {score}/{maxScore} | {timeLeft}s
        </div>
      </div>

      {gameState === 'ready' && (
        <div className={styles.readyScreen}>
          <div className={styles.instructions}>
            <span className={styles.instructionIcon}>🥏</span>
            <p>Frisbee'yi yakala!</p>
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
        <div className={`${styles.gameArea} ${styles.parkBackground}`}>
          {/* Frisbee */}
          <AnimatePresence>
            {frisbeeFlying && (
              <motion.div
                className={styles.frisbee}
                initial={{ x: '50%', y: -50, rotate: 0 }}
                animate={{
                  x: `${frisbeeX}%`,
                  y: 150,
                  rotate: 720
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ position: 'absolute', fontSize: '2.5rem' }}
              >
                🥏
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dog */}
          <motion.div
            className={styles.chaseDog}
            style={{ left: `${dogX}%` }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            🐕
          </motion.div>

          {/* Controls */}
          <div className={styles.controls}>
            <button className={styles.controlBtn} onClick={() => moveDog('left')}>
              ◀️
            </button>
            <button className={styles.controlBtn} onClick={() => moveDog('right')}>
              ▶️
            </button>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className={styles.resultScreen}>
          <div className={styles.resultIcon}>
            {score >= maxScore ? '🏆' : score >= 5 ? '👍' : '🥏'}
          </div>
          <h3 className={styles.resultTitle}>
            {score >= maxScore
              ? t('minigame.great')
              : score >= 5
              ? t('minigame.good')
              : t('minigame.tryAgain')}
          </h3>
          <p className={styles.resultScore}>{score} 🥏</p>
          {score >= maxScore && (
            <div className={styles.bonus}>{t('minigame.bonus')} +5 🪙</div>
          )}
          <Button onClick={handleFinish} fullWidth>
            {t('common.done')}
          </Button>
        </div>
      )}
    </div>
  );
}
