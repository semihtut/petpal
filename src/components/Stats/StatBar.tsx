import { ProgressBar } from '../UI';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './StatBar.module.css';

interface StatBarProps {
  stat: 'hunger' | 'thirst' | 'happiness' | 'energy' | 'hygiene';
  value: number;
  showLabel?: boolean;
}

const statConfig = {
  hunger: { icon: '🍖', color: 'hunger' as const },
  thirst: { icon: '💧', color: 'thirst' as const },
  happiness: { icon: '😊', color: 'happiness' as const },
  energy: { icon: '⚡', color: 'energy' as const },
  hygiene: { icon: '🛁', color: 'hygiene' as const },
};

export function StatBar({ stat, value, showLabel = true }: StatBarProps) {
  const { t } = useTranslation();
  const config = statConfig[stat];

  return (
    <div className={styles.container}>
      <ProgressBar
        value={value}
        color={config.color}
        icon={config.icon}
        label={showLabel ? t(`stat.${stat}`) : undefined}
        size="medium"
        showLabel
      />
    </div>
  );
}
