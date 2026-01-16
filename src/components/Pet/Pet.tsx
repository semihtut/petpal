import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getDogById } from '../../data/dogs';
import type { PetMood } from '../../utils/types';
import { STAT_CRITICAL_THRESHOLD, STAT_WARNING_THRESHOLD } from '../../utils/constants';
import styles from './Pet.module.css';

interface PetProps {
  mood?: PetMood;
  animation?: string;
}

export function Pet({ mood: forcedMood, animation }: PetProps) {
  const pet = useGameStore((state) => state.pet);
  const stats = useGameStore((state) => state.stats);
  const equippedItems = useGameStore((state) => state.inventory.equippedItems);

  const dog = pet ? getDogById(pet.breedId) : null;

  // Determine mood based on stats
  const mood = useMemo((): PetMood => {
    if (forcedMood) return forcedMood;

    if (stats.hunger < STAT_CRITICAL_THRESHOLD) return 'hungry';
    if (stats.thirst < STAT_CRITICAL_THRESHOLD) return 'thirsty';
    if (stats.energy < STAT_CRITICAL_THRESHOLD) return 'tired';
    if (stats.hygiene < STAT_CRITICAL_THRESHOLD) return 'dirty';
    if (stats.happiness < STAT_CRITICAL_THRESHOLD) return 'sad';

    if (stats.hunger < STAT_WARNING_THRESHOLD) return 'hungry';
    if (stats.thirst < STAT_WARNING_THRESHOLD) return 'thirsty';

    if (stats.happiness > 70) return 'happy';

    return 'neutral';
  }, [forcedMood, stats]);

  // Get emoji based on mood and dog breed
  const emoji = useMemo(() => {
    const moodEmojis: Record<PetMood, string> = {
      happy: '🐕',
      neutral: '🐕',
      hungry: '🥺',
      thirsty: '😐',
      tired: '😴',
      dirty: '😅',
      sad: '🙁',
    };
    return moodEmojis[mood];
  }, [mood]);

  // Animation variants
  const idleAnimation = {
    y: [0, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  const happyAnimation = {
    y: [0, -10, 0],
    rotate: [-5, 5, -5],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  const sadAnimation = {
    y: [0, 2, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  const sleepyAnimation = {
    y: [0, 3, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  const getAnimation = () => {
    if (animation) {
      switch (animation) {
        case 'bounce':
          return happyAnimation;
        case 'sleep':
          return sleepyAnimation;
        default:
          return idleAnimation;
      }
    }

    switch (mood) {
      case 'happy':
        return happyAnimation;
      case 'sad':
      case 'hungry':
      case 'thirsty':
        return sadAnimation;
      case 'tired':
        return sleepyAnimation;
      default:
        return idleAnimation;
    }
  };

  if (!dog) return null;

  return (
    <div className={styles.container}>
      {/* Background effects */}
      {mood === 'happy' && (
        <div className={styles.happyEffects}>
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className={styles.heart}
              initial={{ opacity: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: -50,
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
              }}
            >
              💕
            </motion.span>
          ))}
        </div>
      )}

      {mood === 'tired' && (
        <div className={styles.sleepEffects}>
          <motion.span
            className={styles.zzz}
            initial={{ opacity: 0, x: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: 30,
              y: -20,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            💤
          </motion.span>
        </div>
      )}

      {/* Pet */}
      <motion.div className={styles.pet} animate={getAnimation()}>
        {/* Hat */}
        {equippedItems.hat && (
          <div className={styles.hat}>🎩</div>
        )}

        {/* Pet emoji/sprite */}
        <div className={styles.petBody}>
          <span className={styles.petEmoji}>{emoji}</span>
        </div>

        {/* Collar */}
        {equippedItems.collar && (
          <div className={styles.collar}>🎀</div>
        )}
      </motion.div>

      {/* Mood indicator */}
      {(mood === 'hungry' || mood === 'thirsty' || mood === 'dirty') && (
        <motion.div
          className={styles.moodBubble}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
        >
          {mood === 'hungry' && '🍖'}
          {mood === 'thirsty' && '💧'}
          {mood === 'dirty' && '🛁'}
        </motion.div>
      )}
    </div>
  );
}
