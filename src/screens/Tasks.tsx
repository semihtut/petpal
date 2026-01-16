import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button, Card, ProgressBar } from '../components/UI';
import styles from './Tasks.module.css';

interface TasksProps {
  onBack: () => void;
}

export function Tasks({ onBack }: TasksProps) {
  const { t } = useTranslation();
  const dailyTasks = useGameStore((state) => state.dailyTasks);
  const weeklyTask = useGameStore((state) => state.weeklyTask);
  const claimTaskReward = useGameStore((state) => state.claimTaskReward);
  const petName = useGameStore((state) => state.pet?.customName || '');

  const handleClaim = (taskId: string) => {
    claimTaskReward(taskId);
  };

  const getTaskDescription = (descriptionKey: string, target: number) => {
    return t(descriptionKey, { name: petName, target });
  };

  // Calculate time until daily reset (4 AM)
  const getTimeUntilReset = () => {
    const now = new Date();
    const reset = new Date();
    reset.setHours(4, 0, 0, 0);
    if (now.getHours() >= 4) {
      reset.setDate(reset.getDate() + 1);
    }
    const diff = reset.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}${t('common.hour')} ${minutes}m`;
  };

  // Calculate days until weekly reset
  const getDaysUntilWeeklyReset = () => {
    const now = new Date();
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
    return daysUntilMonday;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← {t('common.back')}
        </button>
        <h1 className={styles.title}>{t('tasks.title')}</h1>
        <div style={{ width: 60 }} />
      </header>

      {/* Daily Tasks */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('tasks.daily')}</h2>
          <span className={styles.timer}>
            {t('tasks.remaining')}: {getTimeUntilReset()}
          </span>
        </div>

        <div className={styles.taskList}>
          {dailyTasks.map((task, index) => {
            const isComplete = task.current >= task.target;
            const isClaimed = task.completed;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`${styles.taskCard} ${isClaimed ? styles.claimed : ''}`}
                >
                  <div className={styles.taskContent}>
                    <div className={styles.taskInfo}>
                      <p className={styles.taskDescription}>
                        {getTaskDescription(task.descriptionKey, task.target)}
                      </p>
                      <div className={styles.taskProgress}>
                        <ProgressBar
                          value={(task.current / task.target) * 100}
                          color={isComplete ? 'secondary' : 'primary'}
                          size="small"
                        />
                        <span className={styles.taskCount}>
                          {task.current}/{task.target}
                        </span>
                      </div>
                    </div>
                    <div className={styles.taskReward}>
                      {isClaimed ? (
                        <span className={styles.claimedBadge}>✓</span>
                      ) : isComplete ? (
                        <Button
                          size="small"
                          onClick={() => handleClaim(task.id)}
                        >
                          {t('tasks.claim')}
                        </Button>
                      ) : (
                        <span className={styles.rewardPreview}>
                          +{task.reward.coins} 🪙
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Weekly Task */}
      {weeklyTask && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t('tasks.weekly')}</h2>
            <span className={styles.timer}>
              {getDaysUntilWeeklyReset()} {t('common.days')}
            </span>
          </div>

          <Card
            className={`${styles.weeklyCard} ${weeklyTask.completed ? styles.claimed : ''}`}
          >
            <div className={styles.weeklyContent}>
              <div className={styles.weeklyIcon}>🎯</div>
              <div className={styles.weeklyInfo}>
                <p className={styles.weeklyDescription}>
                  {getTaskDescription(weeklyTask.descriptionKey, weeklyTask.target)}
                </p>
                <div className={styles.taskProgress}>
                  <ProgressBar
                    value={(weeklyTask.current / weeklyTask.target) * 100}
                    color={
                      weeklyTask.current >= weeklyTask.target ? 'secondary' : 'primary'
                    }
                    size="medium"
                  />
                  <span className={styles.taskCount}>
                    {weeklyTask.current}/{weeklyTask.target}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.weeklyReward}>
              {weeklyTask.completed ? (
                <span className={styles.claimedBadge}>✓ {t('tasks.completed')}</span>
              ) : weeklyTask.current >= weeklyTask.target ? (
                <Button onClick={() => handleClaim(weeklyTask.id)} fullWidth>
                  {t('tasks.claim')} +{weeklyTask.reward.coins} 🪙
                </Button>
              ) : (
                <div className={styles.weeklyRewardPreview}>
                  <span>+{weeklyTask.reward.coins} 🪙</span>
                  <span>+{weeklyTask.reward.xp} XP</span>
                  {weeklyTask.reward.item && <span>+ 🎁</span>}
                </div>
              )}
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}
