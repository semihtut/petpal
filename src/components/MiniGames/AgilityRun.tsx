import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../UI';
import styles from './MiniGame.module.css';

interface Obstacle {
  id: number;
  type: 'jump' | 'duck';
  x: number;
}

interface AgilityRunProps {
  onComplete: (score: number, maxScore: number) => void;
  onSkip: () => void;
}

export function AgilityRun({ onComplete, onSkip }: AgilityRunProps) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [dogState, setDogState] = useState<'running' | 'jumping' | 'ducking'>('running');
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [nextObstacleId, setNextObstacleId] = useState(0);

  const maxScore = 15;

  const jump = useCallback(() => {
    if (dogState !== 'running') return;
    setDogState('jumping');
    setTimeout(() => setDogState('running'), 600);
  }, [dogState]);

  const duck = useCallback(() => {
    if (dogState !== 'running') return;
    setDogState('ducking');
    setTimeout(() => setDogState('running'), 600);
  }, [dogState]);

  // Spawn obstacles
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const type = Math.random() > 0.5 ? 'jump' : 'duck';
      setObstacles((prev) => [...prev, { id: nextObstacleId, type, x: 100 }]);
      setNextObstacleId((id) => id + 1);
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, [gameState, nextObstacleId]);

  // Move obstacles
  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveInterval = setInterval(() => {
      setObstacles((prev) => {
        const updated = prev
          .map((obs) => ({ ...obs, x: obs.x - 5 }))
          .filter((obs) => obs.x > -10);

        // Check collisions
        updated.forEach((obs) => {
          if (obs.x > 5 && obs.x < 25) {
            const shouldJump = obs.type === 'jump';
            const shouldDuck = obs.type === 'duck';

            if (shouldJump && dogState !== 'jumping') {
              setLives((l) => l - 1);
              setObstacles((o) => o.filter((ob) => ob.id !== obs.id));
            } else if (shouldDuck && dogState !== 'ducking') {
              setLives((l) => l - 1);
              setObstacles((o) => o.filter((ob) => ob.id !== obs.id));
            } else if (
              (shouldJump && dogState === 'jumping') ||
              (shouldDuck && dogState === 'ducking')
            ) {
              setScore((s) => s + 1);
              setObstacles((o) => o.filter((ob) => ob.id !== obs.id));
            }
          }
        });

        return updated;
      });
    }, 100);

    return () => clearInterval(moveInterval);
  }, [gameState, dogState]);

  // Check game over
  useEffect(() => {
    if (lives <= 0 || score >= maxScore) {
      setGameState('finished');
    }
  }, [lives, score]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setObstacles([]);
    setDogState('running');
    setNextObstacleId(0);
  };

  const handleFinish = () => {
    onComplete(score, maxScore);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Agility</h2>
        <div className={styles.score}>
          {score}/{maxScore} | {'❤️'.repeat(lives)}
        </div>
      </div>

      {gameState === 'ready' && (
        <div className={styles.readyScreen}>
          <div className={styles.instructions}>
            <span className={styles.instructionIcon}>🏃</span>
            <p>Engelleri geç! Zıpla veya eğil!</p>
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
        <div className={`${styles.gameArea} ${styles.trackBackground}`}>
          {/* Dog */}
          <motion.div
            className={styles.agilityDog}
            animate={{
              y: dogState === 'jumping' ? -40 : dogState === 'ducking' ? 20 : 0,
              scaleY: dogState === 'ducking' ? 0.5 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            🐕
          </motion.div>

          {/* Obstacles */}
          <AnimatePresence>
            {obstacles.map((obs) => (
              <motion.div
                key={obs.id}
                className={styles.obstacle}
                style={{ left: `${obs.x}%` }}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {obs.type === 'jump' ? '🪵' : '🌳'}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Controls */}
          <div className={styles.agilityControls}>
            <button className={styles.agilityBtn} onClick={jump}>
              ⬆️ Zıpla
            </button>
            <button className={styles.agilityBtn} onClick={duck}>
              ⬇️ Eğil
            </button>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className={styles.resultScreen}>
          <div className={styles.resultIcon}>
            {score >= maxScore ? '🏆' : score >= 10 ? '👍' : '🏃'}
          </div>
          <h3 className={styles.resultTitle}>
            {score >= maxScore
              ? t('minigame.great')
              : score >= 10
              ? t('minigame.good')
              : t('minigame.tryAgain')}
          </h3>
          <p className={styles.resultScore}>{score} 🎯</p>
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
