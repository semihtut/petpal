import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../../components/UI';
import styles from './Tutorial.module.css';

interface TutorialProps {
  petName: string;
  onComplete: () => void;
}

export function Tutorial({ petName, onComplete }: TutorialProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [hasFed, setHasFed] = useState(false);

  const handleFeed = () => {
    setHasFed(true);
    setTimeout(() => setStep(1), 500);
  };

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            className={styles.content}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className={styles.petArea}>
              <motion.span
                className={styles.petEmoji}
                animate={hasFed ? { scale: [1, 1.2, 1] } : { y: [0, -5, 0] }}
                transition={{ duration: hasFed ? 0.3 : 2, repeat: hasFed ? 0 : Infinity }}
              >
                {hasFed ? '😋' : '🐕'}
              </motion.span>
              {hasFed && (
                <motion.div
                  className={styles.feedbackBubble}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Nam nam! 😋
                </motion.div>
              )}
            </div>

            <h1 className={styles.title}>
              {hasFed
                ? t('onboarding.tutorialComplete', { name: petName })
                : t('onboarding.tutorial', { name: petName })}
            </h1>

            {!hasFed ? (
              <motion.button
                className={styles.feedButton}
                onClick={handleFeed}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className={styles.feedIcon}>🍖</span>
                <span className={styles.feedLabel}>{t('action.feed')}</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className={styles.subtitle}>💛</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            className={styles.content}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={styles.petArea}>
              <motion.span
                className={styles.petEmoji}
                animate={{
                  y: [0, -10, 0],
                  rotate: [-5, 5, -5],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🐕
              </motion.span>
              <motion.div
                className={styles.hearts}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className={styles.heart}
                    animate={{
                      y: [-20, -40],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  >
                    💕
                  </motion.span>
                ))}
              </motion.div>
            </div>

            <h1 className={styles.title}>
              {petName} {t('onboarding.tutorialComplete', { name: '' }).replace('{name}', '')}
            </h1>

            <div className={styles.footer}>
              <Button onClick={onComplete} fullWidth size="large">
                {t('onboarding.start')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
