import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../UI';
import styles from './MiniGame.module.css';

interface Spot {
  id: number;
  x: number;
  y: number;
  hasBone: boolean;
  revealed: boolean;
}

interface BoneSearchProps {
  onComplete: (score: number, maxScore: number) => void;
  onSkip: () => void;
}

export function BoneSearch({ onComplete, onSkip }: BoneSearchProps) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [spots, setSpots] = useState<Spot[]>([]);
  const [found, setFound] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const totalBones = 5;
  const totalSpots = 12;

  const initSpots = useCallback(() => {
    const boneIndices = new Set<number>();
    while (boneIndices.size < totalBones) {
      boneIndices.add(Math.floor(Math.random() * totalSpots));
    }

    const newSpots: Spot[] = [];
    const gridCols = 4;

    for (let i = 0; i < totalSpots; i++) {
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);
      newSpots.push({
        id: i,
        x: 15 + col * 23,
        y: 20 + row * 25,
        hasBone: boneIndices.has(i),
        revealed: false,
      });
    }
    setSpots(newSpots);
  }, []);

  const digSpot = (id: number) => {
    setSpots((prev) =>
      prev.map((spot) => {
        if (spot.id === id && !spot.revealed) {
          if (spot.hasBone) {
            setFound((f) => f + 1);
          }
          setAttempts((a) => a + 1);
          return { ...spot, revealed: true };
        }
        return spot;
      })
    );
  };

  // Check if game is over
  const isGameOver = found >= totalBones || attempts >= totalSpots;

  const startGame = () => {
    setGameState('playing');
    setFound(0);
    setAttempts(0);
    initSpots();
  };

  const handleFinish = () => {
    onComplete(found, totalBones);
  };

  if (isGameOver && gameState === 'playing') {
    setGameState('finished');
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('minigame.boneSearch')}</h2>
        <div className={styles.score}>
          🦴 {found}/{totalBones}
        </div>
      </div>

      {gameState === 'ready' && (
        <div className={styles.readyScreen}>
          <div className={styles.instructions}>
            <span className={styles.instructionIcon}>🦴</span>
            <p>{t('minigame.boneSearch')}</p>
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
          {/* Pet */}
          <motion.div
            className={styles.searchPet}
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🐕
          </motion.div>

          {/* Dig spots */}
          <AnimatePresence>
            {spots.map((spot) => (
              <motion.button
                key={spot.id}
                className={`${styles.digSpot} ${spot.revealed ? styles.revealed : ''}`}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                onClick={() => digSpot(spot.id)}
                disabled={spot.revealed}
                whileTap={{ scale: 0.9 }}
              >
                {spot.revealed ? (spot.hasBone ? '🦴' : '🕳️') : '🌱'}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      {gameState === 'finished' && (
        <div className={styles.resultScreen}>
          <div className={styles.resultIcon}>
            {found >= totalBones ? '🎉' : found >= 3 ? '👍' : '🔍'}
          </div>
          <h3 className={styles.resultTitle}>
            {found >= totalBones
              ? t('minigame.great')
              : found >= 3
              ? t('minigame.good')
              : t('minigame.tryAgain')}
          </h3>
          <p className={styles.resultScore}>
            {found} 🦴
          </p>
          {found >= totalBones && (
            <div className={styles.bonus}>
              {t('minigame.bonus')} +3 🪙
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
