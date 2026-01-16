import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button, Card, Modal } from '../components/UI';
import { GAME_VERSION } from '../utils/constants';
import styles from './Settings.module.css';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const { t } = useTranslation();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const settings = useGameStore((state) => state.settings);
  const updateSettings = useGameStore((state) => state.updateSettings);
  const resetGame = useGameStore((state) => state.resetGame);
  const streak = useGameStore((state) => state.streak);
  const bondTier = useGameStore((state) => state.bondTier);

  const handleLanguageToggle = () => {
    updateSettings({ language: settings.language === 'tr' ? 'en' : 'tr' });
  };

  const handleMusicToggle = () => {
    updateSettings({ musicEnabled: !settings.musicEnabled });
  };

  const handleSfxToggle = () => {
    updateSettings({ sfxEnabled: !settings.sfxEnabled });
  };

  const handleReset = () => {
    resetGame();
    setShowResetConfirm(false);
  };

  const getBondTierName = () => {
    return t(`bond.${bondTier}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← {t('common.back')}
        </button>
        <h1 className={styles.title}>{t('settings.title')}</h1>
        <div style={{ width: 60 }} />
      </header>

      <div className={styles.content}>
        {/* Streak Info */}
        <Card className={styles.infoCard}>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>🔥</span>
              <div>
                <span className={styles.infoLabel}>{t('streak.title')}</span>
                <span className={styles.infoValue}>{streak.current} {t('common.days')}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>💕</span>
              <div>
                <span className={styles.infoLabel}>{t('bond.title')}</span>
                <span className={styles.infoValue}>{getBondTierName()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Language */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('settings.language')}</h2>
          <Card className={styles.settingCard} onClick={handleLanguageToggle}>
            <div className={styles.settingContent}>
              <span className={styles.settingIcon}>🌐</span>
              <span className={styles.settingLabel}>{t('settings.language')}</span>
            </div>
            <div className={styles.languageToggle}>
              <span className={settings.language === 'tr' ? styles.activeLanguage : ''}>
                TR
              </span>
              <span className={styles.languageDivider}>/</span>
              <span className={settings.language === 'en' ? styles.activeLanguage : ''}>
                EN
              </span>
            </div>
          </Card>
        </section>

        {/* Sound */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('settings.music')}</h2>
          <Card className={styles.settingCard} onClick={handleMusicToggle}>
            <div className={styles.settingContent}>
              <span className={styles.settingIcon}>🎵</span>
              <span className={styles.settingLabel}>{t('settings.music')}</span>
            </div>
            <div className={`${styles.toggle} ${settings.musicEnabled ? styles.on : ''}`}>
              <div className={styles.toggleThumb} />
            </div>
          </Card>

          <Card className={styles.settingCard} onClick={handleSfxToggle}>
            <div className={styles.settingContent}>
              <span className={styles.settingIcon}>🔊</span>
              <span className={styles.settingLabel}>{t('settings.sfx')}</span>
            </div>
            <div className={`${styles.toggle} ${settings.sfxEnabled ? styles.on : ''}`}>
              <div className={styles.toggleThumb} />
            </div>
          </Card>
        </section>

        {/* Reset */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('settings.reset')}</h2>
          <Card
            className={`${styles.settingCard} ${styles.danger}`}
            onClick={() => setShowResetConfirm(true)}
          >
            <div className={styles.settingContent}>
              <span className={styles.settingIcon}>🗑️</span>
              <span className={styles.settingLabel}>{t('settings.reset')}</span>
            </div>
          </Card>
        </section>

        {/* About */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('settings.about')}</h2>
          <Card className={styles.aboutCard}>
            <div className={styles.aboutContent}>
              <span className={styles.appName}>🐾 PetPal</span>
              <span className={styles.version}>
                {t('settings.version')} {GAME_VERSION}
              </span>
            </div>
          </Card>
        </section>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title={t('settings.reset')}
      >
        <div className={styles.confirmContent}>
          <p className={styles.confirmText}>{t('settings.resetConfirm')}</p>
          <div className={styles.confirmButtons}>
            <Button
              variant="ghost"
              onClick={() => setShowResetConfirm(false)}
              fullWidth
            >
              {t('settings.resetNo')}
            </Button>
            <Button onClick={handleReset} fullWidth>
              {t('settings.resetYes')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
