import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../UI';
import styles from './MiniGame.module.css';

interface Ball {
  id: number;
  x: number;
  caught: boolean;
}

interface BallCatchProps {
  onComplete: (score: number, maxScore: number) => void;
  onSkip: () => void;
}

export function BallCatch({ onComplete, onSkip }: BallCatchProps) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [petPosition, setPetPosition] = useState(50);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [score, setScore] = useState(0);
  const [ballsDropped, setBallsDropped] = useState(0);

  const maxBalls = 5;

  const dropBall = useCallback(() => {
    if (ballsDropped >= maxBalls) return;

    const newBall: Ball = {
      id: Date.now(),
      x: Math.random() * 80 + 10, // 10-90%
      caught: false,
    };

    setBalls((prev) => [...prev, newBall]);
    setBallsDropped((prev) => prev + 1);
  }, [ballsDropped]);

  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    if (gameState !== 'playing') return;

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;

    setPetPosition(Math.max(10, Math.min(90, x)));
  };

  const checkCatch = useCallback(
    (ballX: number) => {
      const catchRange = 15;
      return Math.abs(ballX - petPosition) < catchRange;
    },
    [petPosition]
  );

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const dropInterval = setInterval(() => {
      if (ballsDropped < maxBalls) {
        dropBall();
      }
    }, 1500);

    return () => clearInterval(dropInterval);
  }, [gameState, dropBall, ballsDropped]);

  // Check for catches
  useEffect(() => {
    const checkInterval = setInterval(() => {
      setBalls((prev) =>
        prev.map((ball) => {
          if (!ball.caught && checkCatch(ball.x)) {
            setScore((s) => s + 1);
            return { ...ball, caught: true };
          }
          return ball;
        })
      );
    }, 100);

    return () => clearInterval(checkInterval);
  }, [checkCatch]);

  // End game
  useEffect(() => {
    if (gameState === 'playing' && ballsDropped >= maxBalls) {
      const timer = setTimeout(() => {
        setGameState('finished');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [ballsDropped, gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setBallsDropped(0);
    setBalls([]);
    setPetPosition(50);
  };

  const handleFinish = () => {
    onComplete(score, maxBalls);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('minigame.ballCatch')}</h2>
        <div className={styles.score}>
          {t('minigame.score')}: {score}/{maxBalls}
        </div>
      </div>

      {gameState === 'ready' && (
        <div className={styles.readyScreen}>
          <div className={styles.instructions}>
            <span className={styles.instructionIcon}>🎾</span>
            <p>{t('minigame.ballCatch')}</p>
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
        <div
          className={styles.gameArea}
          onMouseMove={handleTouch}
          onTouchMove={handleTouch}
        >
          <AnimatePresence>
            {balls.map((ball) => (
              <motion.div
                key={ball.id}
                className={styles.ball}
                style={{ left: `${ball.x}%` }}
                initial={{ top: 0, opacity: 1 }}
                animate={{
                  top: ball.caught ? '70%' : '100%',
                  opacity: ball.caught ? 0 : 1,
                  scale: ball.caught ? 1.5 : 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: ball.caught ? 0.2 : 2, ease: 'linear' }}
              >
                🎾
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            className={styles.pet}
            style={{ left: `${petPosition}%` }}
            animate={{ x: '-50%' }}
          >
            🐕
          </motion.div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className={styles.resultScreen}>
          <div className={styles.resultIcon}>
            {score >= maxBalls * 0.8 ? '🎉' : score >= maxBalls * 0.5 ? '👍' : '💪'}
          </div>
          <h3 className={styles.resultTitle}>
            {score >= maxBalls * 0.8
              ? t('minigame.great')
              : score >= maxBalls * 0.5
              ? t('minigame.good')
              : t('minigame.tryAgain')}
          </h3>
          <p className={styles.resultScore}>
            {score}/{maxBalls}
          </p>
          {score === maxBalls && (
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
