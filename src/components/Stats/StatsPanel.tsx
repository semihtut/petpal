import { useGameStore } from '../../store/gameStore';
import { StatBar } from './StatBar';
import styles from './StatsPanel.module.css';

export function StatsPanel() {
  const stats = useGameStore((state) => state.stats);

  return (
    <div className={styles.container}>
      <StatBar stat="hunger" value={stats.hunger} />
      <StatBar stat="thirst" value={stats.thirst} />
      <StatBar stat="happiness" value={stats.happiness} />
      <StatBar stat="energy" value={stats.energy} />
      <StatBar stat="hygiene" value={stats.hygiene} />
    </div>
  );
}
