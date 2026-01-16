import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../UI';
import styles from './MiniGame.module.css';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchProps {
  onComplete: (score: number, maxScore: number) => void;
  onSkip: () => void;
}

const EMOJIS = ['🐕', '🦴', '🐾', '🎾', '🏠', '❤️'];

export function MemoryMatch({ onComplete, onSkip }: MemoryMatchProps) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);

  const maxScore = 6; // 6 pairs

  const initCards = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length >= 2) return;

    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);

      const [first, second] = newFlipped;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard?.emoji === secondCard?.emoji) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, isMatched: true } : c
            )
          );
          setMatches((m) => m + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Check win
  useEffect(() => {
    if (matches === maxScore && gameState === 'playing') {
      setGameState('finished');
    }
  }, [matches, gameState]);

  const startGame = () => {
    setGameState('playing');
    setMatches(0);
    setMoves(0);
    setFlippedCards([]);
    initCards();
  };

  const handleFinish = () => {
    // Score based on efficiency (fewer moves = higher score)
    const efficiency = Math.max(0, 1 - (moves - maxScore) / (maxScore * 2));
    const score = Math.round(maxScore * efficiency);
    onComplete(score, maxScore);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Memory</h2>
        <div className={styles.score}>
          {matches}/{maxScore} | {moves} moves
        </div>
      </div>

      {gameState === 'ready' && (
        <div className={styles.readyScreen}>
          <div className={styles.instructions}>
            <span className={styles.instructionIcon}>🧠</span>
            <p>Eşleşen kartları bul!</p>
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
        <div className={styles.memoryGrid}>
          {cards.map((card) => (
            <motion.button
              key={card.id}
              className={`${styles.memoryCard} ${card.isFlipped || card.isMatched ? styles.flipped : ''} ${card.isMatched ? styles.matched : ''}`}
              onClick={() => handleCardClick(card.id)}
              whileTap={{ scale: 0.95 }}
              animate={card.isMatched ? { scale: [1, 1.1, 1] } : {}}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </motion.button>
          ))}
        </div>
      )}

      {gameState === 'finished' && (
        <div className={styles.resultScreen}>
          <div className={styles.resultIcon}>
            {moves <= maxScore + 2 ? '🏆' : moves <= maxScore + 5 ? '👍' : '🧠'}
          </div>
          <h3 className={styles.resultTitle}>
            {moves <= maxScore + 2
              ? t('minigame.great')
              : moves <= maxScore + 5
              ? t('minigame.good')
              : t('minigame.tryAgain')}
          </h3>
          <p className={styles.resultScore}>{moves} moves</p>
          {moves <= maxScore + 2 && (
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
