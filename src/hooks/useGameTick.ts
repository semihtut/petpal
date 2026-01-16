import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameTick() {
  const updateStatsFromTime = useGameStore((state) => state.updateStatsFromTime);
  const checkAndResetTasks = useGameStore((state) => state.checkAndResetTasks);
  const checkStreak = useGameStore((state) => state.checkStreak);
  const checkAchievements = useGameStore((state) => state.checkAchievements);
  const isOnboarded = useGameStore((state) => state.isOnboarded);

  const initializedRef = useRef(false);

  // Initial update when app loads
  useEffect(() => {
    if (!isOnboarded || initializedRef.current) return;

    initializedRef.current = true;

    // Update stats from offline time
    updateStatsFromTime();

    // Check and reset tasks if needed
    checkAndResetTasks();

    // Check streak
    checkStreak();

    // Check achievements
    checkAchievements();
  }, [isOnboarded, updateStatsFromTime, checkAndResetTasks, checkStreak, checkAchievements]);

  // Periodic update every minute
  useEffect(() => {
    if (!isOnboarded) return;

    const interval = setInterval(() => {
      updateStatsFromTime();
      checkAchievements();
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [isOnboarded, updateStatsFromTime, checkAchievements]);

  // Handle visibility change (when user returns to app)
  useEffect(() => {
    if (!isOnboarded) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateStatsFromTime();
        checkAndResetTasks();
        checkStreak();
        checkAchievements();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isOnboarded, updateStatsFromTime, checkAndResetTasks, checkStreak, checkAchievements]);
}
