import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../UI';
import styles from './MiniGame.module.css';

interface PortionSelectProps {
  onComplete: (portion: number) => void;
  onSkip: () => void;
}

export function PortionSelect({ onComplete, onSkip }: PortionSelectProps) {
  const { t, language } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);

  const portions = [
    {
      amount: 1,
      label: language === 'tr' ? '1 Kaşık' : '1 Scoop',
      description: language === 'tr' ? 'Hafif atıştırmalık' : 'Light snack',
      hunger: 20,
    },
    {
      amount: 2,
      label: language === 'tr' ? '2 Kaşık' : '2 Scoops',
      description: language === 'tr' ? 'Normal porsiyon' : 'Normal portion',
      hunger: 40,
    },
    {
      amount: 3,
      label: language === 'tr' ? '3 Kaşık' : '3 Scoops',
      description: language === 'tr' ? 'Doyurucu öğün + mutluluk!' : 'Filling meal + happiness!',
      hunger: 60,
      bonus: true,
    },
  ];

  const handleSelect = (amount: number) => {
    setSelected(amount);
  };

  const handleConfirm = () => {
    if (selected) {
      onComplete(selected);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('minigame.portionSelect')}</h2>
      </div>

      <div className={styles.portionScreen}>
        {/* Bowl */}
        <div className={styles.bowl}>
          <motion.div
            className={styles.bowlInner}
            animate={selected ? { scale: [1, 1.05, 1] } : {}}
          >
            🥣
          </motion.div>
          {selected && (
            <motion.div
              className={styles.foodInBowl}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {'🍖'.repeat(selected)}
            </motion.div>
          )}
        </div>

        {/* Pet */}
        <motion.div
          className={styles.hungryPet}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🐕
        </motion.div>

        {/* Portion options */}
        <div className={styles.portionOptions}>
          {portions.map((portion) => (
            <motion.button
              key={portion.amount}
              className={`${styles.portionCard} ${
                selected === portion.amount ? styles.selectedPortion : ''
              }`}
              onClick={() => handleSelect(portion.amount)}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.portionScoops}>
                {'🥄'.repeat(portion.amount)}
              </div>
              <div className={styles.portionLabel}>{portion.label}</div>
              <div className={styles.portionDesc}>{portion.description}</div>
              <div className={styles.portionHunger}>+{portion.hunger} 🍖</div>
              {portion.bonus && (
                <div className={styles.portionBonus}>+5 😊</div>
              )}
            </motion.button>
          ))}
        </div>

        <div className={styles.buttons}>
          <Button onClick={handleConfirm} disabled={!selected} fullWidth>
            {t('action.feed')}
          </Button>
          <Button onClick={onSkip} variant="ghost" fullWidth>
            {t('minigame.skip')}
          </Button>
        </div>
      </div>
    </div>
  );
}
