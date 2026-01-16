import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { achievements, getAchievementsByCategory } from '../data/achievements';
import { Card, ProgressBar } from '../components/UI';
import styles from './Achievements.module.css';

interface AchievementsProps {
  onBack: () => void;
}

export function Achievements({ onBack }: AchievementsProps) {
  const { t } = useTranslation();
  const achievementProgress = useGameStore((state) => state.achievements);
  const statistics = useGameStore((state) => state.statistics);
  const level = useGameStore((state) => state.level);
  const bond = useGameStore((state) => state.bond);
  const streak = useGameStore((state) => state.streak);
  const ownedItems = useGameStore((state) => state.inventory.ownedItems);

  const categories = [
    { id: 'care', label: t('achievements.care') },
    { id: 'progress', label: t('achievements.progressCat') },
    { id: 'streak', label: t('achievements.streak') },
    { id: 'discovery', label: t('achievements.discovery') },
  ] as const;

  const getProgress = (achievementId: string, target: number): number => {
    const progressMap: Record<string, number> = {
      ach_feed_100: statistics.totalFeeds,
      ach_water_100: statistics.totalWaters,
      ach_bath_50: statistics.totalBaths,
      ach_play_100: statistics.totalMiniGames,
      ach_walk_50: statistics.totalWalks,
      ach_sleep_30: statistics.totalSleeps,
      ach_level_5: level,
      ach_level_10: level,
      ach_level_15: level,
      ach_level_20: level,
      ach_bond_100: bond,
      ach_streak_7: streak.longest,
      ach_streak_30: streak.longest,
      ach_streak_90: streak.longest,
      ach_events_10: statistics.randomEventsWitnessed,
      ach_items_10: ownedItems.length,
      ach_minigames_50: statistics.totalMiniGames,
      ach_coins_1000: statistics.totalCoinsEarned,
    };

    return Math.min(progressMap[achievementId] || 0, target);
  };

  const totalUnlocked = Object.values(achievementProgress).filter(
    (p) => p.unlocked
  ).length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← {t('common.back')}
        </button>
        <h1 className={styles.title}>{t('achievements.title')}</h1>
        <div className={styles.counter}>
          {totalUnlocked}/{achievements.length}
        </div>
      </header>

      <div className={styles.content}>
        {categories.map((category) => {
          const categoryAchievements = getAchievementsByCategory(category.id);

          return (
            <section key={category.id} className={styles.section}>
              <h2 className={styles.sectionTitle}>{category.label}</h2>
              <div className={styles.achievementList}>
                {categoryAchievements.map((achievement, index) => {
                  const progress = achievementProgress[achievement.id];
                  const currentProgress = getProgress(
                    achievement.id,
                    achievement.target
                  );
                  const isUnlocked = progress?.unlocked || false;

                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`${styles.achievementCard} ${
                          isUnlocked ? styles.unlocked : ''
                        }`}
                      >
                        <div className={styles.achievementIcon}>
                          {isUnlocked ? achievement.icon : '🔒'}
                        </div>
                        <div className={styles.achievementInfo}>
                          <h3 className={styles.achievementName}>
                            {t(achievement.nameKey)}
                          </h3>
                          <p className={styles.achievementDesc}>
                            {t(achievement.descriptionKey)}
                          </p>
                          {!isUnlocked && (
                            <div className={styles.progressWrapper}>
                              <ProgressBar
                                value={(currentProgress / achievement.target) * 100}
                                size="small"
                                color="primary"
                              />
                              <span className={styles.progressText}>
                                {currentProgress}/{achievement.target}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={styles.achievementReward}>
                          {isUnlocked ? (
                            <span className={styles.unlockedBadge}>✓</span>
                          ) : (
                            <span className={styles.rewardText}>
                              +{achievement.reward.coins} 🪙
                            </span>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
