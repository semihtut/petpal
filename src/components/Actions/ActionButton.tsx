import { motion } from 'framer-motion';
import type { ActionType } from '../../utils/types';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './ActionButton.module.css';

interface ActionButtonProps {
  action: ActionType;
  onClick: () => void;
  disabled?: boolean;
}

const actionConfig: Record<ActionType, { icon: string; color: string }> = {
  feed: { icon: '🍖', color: '#FF9B85' },
  water: { icon: '💧', color: '#7BC8E8' },
  play: { icon: '🎾', color: '#FFD699' },
  walk: { icon: '🚶', color: '#98D8C8' },
  bath: { icon: '🛁', color: '#B8A9C8' },
  sleep: { icon: '😴', color: '#A8C8E8' },
};

export function ActionButton({ action, onClick, disabled }: ActionButtonProps) {
  const { t } = useTranslation();
  const config = actionConfig[action];

  return (
    <motion.button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      style={{
        '--action-color': config.color,
      } as React.CSSProperties}
    >
      <span className={styles.icon}>{config.icon}</span>
      <span className={styles.label}>{t(`action.${action}`)}</span>
    </motion.button>
  );
}
