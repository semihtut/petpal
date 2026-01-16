import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../UI';
import styles from './MiniGame.module.css';

interface Bubble {
  id: number;
  x: number;
  y: number;
  popped: boolean;
}

interface BubblePopProps {
  onComplete: (score: number, maxScore: number) => void;
  onSkip: () => void;
}

export function BubblePop({ onComplete, onSkip }: BubblePopProps) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [popped, setPopped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  const totalBubbles = 15;

  const initBubbles = useCallback(() => {
    const newBubbles: Bubble[] = [];
    for (let i = 0; i < totalBubbles; i++) {
      newBubbles.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        popped: false,
      });
    }
    setBubbles(newBubbles);
  }, []);

  const popBubble = (id: number) => {
    setBubbles((prev) =>
      prev.map((b) => (b.id === id && !b.popped ? { ...b, popped: true } : b))
    );
    setPopped((p) => p + 1);
  };

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

  // Check if all popped
  useEffect(() => {
    if (gameState === 'playing' && popped >= totalBubbles) {
      setGameState('finished');
    }
  }, [popped, gameState]);

  const startGame = () => {
    setGameState('playing');
    setPopped(0);
    setTimeLeft(10);
    initBubbles();
  };

  const handleFinish = () => {
    onComplete(popped, totalBubbles);
  };

  const percentage = Math.round((popped / totalBubbles) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('minigame.bubblePop')}</h2>
        <div className={styles.score}>
          {gameState === 'playing' && <span>⏱️ {timeLeft}s</span>}
          {' '}{popped}/{totalBubbles}
        </div>
      </div>

      {gameState === 'ready' && (
        <div className={styles.readyScreen}>
          <div className={styles.instructions}>
            <span className={styles.instructionIcon}>🫧</span>
            <p>{t('minigame.bubblePop')}</p>
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
          {/* Pet with bubbles */}
          <div className={styles.petCenter}>🐕</div>

          <AnimatePresence>
            {bubbles.map(
              (bubble) =>
                !bubble.popped && (
                  <motion.button
                    key={bubble.id}
                    className={styles.bubble}
                    style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
                    onClick={() => popBubble(bubble.id)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    🫧
                  </motion.button>
                )
            )}
          </AnimatePresence>
        </div>
      )}

      {gameState === 'finished' && (
        <div className={styles.resultScreen}>
          <div className={styles.resultIcon}>
            {percentage >= 80 ? '✨' : percentage >= 50 ? '🛁' : '💦'}
          </div>
          <h3 className={styles.resultTitle}>
            {percentage >= 80
              ? t('minigame.great')
              : percentage >= 50
              ? t('minigame.good')
              : t('minigame.tryAgain')}
          </h3>
          <p className={styles.resultScore}>{percentage}%</p>
          {percentage === 100 && (
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
