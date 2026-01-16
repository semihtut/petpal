import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dogs } from '../../data/dogs';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../../components/UI';
import styles from './DogSelect.module.css';

interface DogSelectProps {
  onSelect: (dogId: string) => void;
}

export function DogSelect({ onSelect }: DogSelectProps) {
  const { t, language } = useTranslation();
  const [selectedDog, setSelectedDog] = useState<string | null>(null);

  const selectedDogData = dogs.find((d) => d.id === selectedDog);

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.title}>{t('onboarding.choosePet')}</h1>
        <p className={styles.subtitle}>{t('onboarding.choosePetDesc')}</p>
      </motion.div>

      <div className={styles.dogsGrid}>
        {dogs.map((dog, index) => (
          <motion.button
            key={dog.id}
            className={`${styles.dogCard} ${selectedDog === dog.id ? styles.selected : ''}`}
            onClick={() => setSelectedDog(dog.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.dogEmoji}>🐕</span>
            <span className={styles.dogName}>{dog.name[language]}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedDogData && (
          <motion.div
            className={styles.detailCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            key={selectedDog}
          >
            <h3 className={styles.detailName}>{selectedDogData.name[language]}</h3>
            <p className={styles.detailDesc}>{selectedDogData.description[language]}</p>

            <div className={styles.traits}>
              <div className={styles.trait}>
                <span className={styles.traitIcon}>⚡</span>
                <span className={styles.traitLabel}>
                  {selectedDogData.personality.energyDecayMultiplier > 1
                    ? language === 'tr' ? 'Enerjik' : 'Energetic'
                    : selectedDogData.personality.energyDecayMultiplier < 1
                    ? language === 'tr' ? 'Sakin' : 'Calm'
                    : language === 'tr' ? 'Normal' : 'Normal'}
                </span>
              </div>
              <div className={styles.trait}>
                <span className={styles.traitIcon}>🎾</span>
                <span className={styles.traitLabel}>
                  {selectedDogData.personality.playBonusMultiplier > 1
                    ? language === 'tr' ? 'Oyuncu' : 'Playful'
                    : language === 'tr' ? 'Normal' : 'Normal'}
                </span>
              </div>
            </div>

            <div className={styles.specialTrait}>
              <span className={styles.specialIcon}>✨</span>
              <span className={styles.specialText}>
                {selectedDogData.specialTrait.description[language]}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.footer}>
        <Button
          onClick={() => selectedDog && onSelect(selectedDog)}
          disabled={!selectedDog}
          fullWidth
          size="large"
        >
          {t('onboarding.selectThis')}
        </Button>
      </div>
    </div>
  );
}
