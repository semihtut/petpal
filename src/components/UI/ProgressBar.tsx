import { motion } from 'framer-motion';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'secondary' | 'warning' | 'danger' | 'hunger' | 'thirst' | 'happiness' | 'energy' | 'hygiene';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
  icon?: string;
  animated?: boolean;
}

const colorMap = {
  primary: '#FF9B85',
  secondary: '#98D8C8',
  warning: '#FFD699',
  danger: '#FF7B6B',
  hunger: '#FF9B85',
  thirst: '#7BC8E8',
  happiness: '#FFD699',
  energy: '#98D8C8',
  hygiene: '#B8A9C8',
};

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  size = 'medium',
  showLabel = false,
  label,
  icon,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const isLow = percentage < 30;
  const isCritical = percentage < 20;

  return (
    <div className={`${styles.container} ${styles[size]}`}>
      {(icon || label) && (
        <div className={styles.labelContainer}>
          {icon && <span className={styles.icon}>{icon}</span>}
          {label && <span className={styles.label}>{label}</span>}
        </div>
      )}
      <div className={`${styles.track} ${isCritical ? styles.critical : isLow ? styles.low : ''}`}>
        <motion.div
          className={styles.fill}
          style={{
            backgroundColor: colorMap[color],
            width: `${percentage}%`,
          }}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        />
      </div>
      {showLabel && (
        <span className={styles.value}>{Math.round(value)}%</span>
      )}
    </div>
  );
}
