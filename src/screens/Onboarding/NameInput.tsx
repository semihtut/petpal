import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../../components/UI';
import { dogs } from '../../data/dogs';
import styles from './NameInput.module.css';

interface NameInputProps {
  selectedDogId: string;
  onSubmit: (name: string) => void;
  onBack: () => void;
}

export function NameInput({ selectedDogId, onSubmit, onBack }: NameInputProps) {
  const { t, language } = useTranslation();
  const [name, setName] = useState('');

  const selectedDog = dogs.find((d) => d.id === selectedDogId);
  const isValid = name.trim().length >= 2 && name.trim().length <= 20;

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className={styles.container}>
      <motion.button
        className={styles.backButton}
        onClick={onBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileTap={{ scale: 0.95 }}
      >
        ← {t('common.back')}
      </motion.button>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.petPreview}>
          <motion.span
            className={styles.petEmoji}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🐕
          </motion.span>
        </div>

        <h1 className={styles.title}>{t('onboarding.namePet')}</h1>

        <input
          type="text"
          className={styles.input}
          placeholder={t('onboarding.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          autoFocus
        />

        <p className={styles.suggestion}>
          {selectedDog && (
            <>
              {language === 'tr' ? 'Öneri: ' : 'Suggestion: '}
              <button
                className={styles.suggestionButton}
                onClick={() => setName(selectedDog.name[language])}
              >
                {selectedDog.name[language]}
              </button>
            </>
          )}
        </p>
      </motion.div>

      <div className={styles.footer}>
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          fullWidth
          size="large"
        >
          {t('onboarding.continue')}
        </Button>
      </div>
    </div>
  );
}
