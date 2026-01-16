import { motion } from 'framer-motion';
import { Utensils, Droplets, Gamepad2, Footprints, Bath, Moon, Check } from 'lucide-react';
import type { ActionType } from '../../utils/types';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './ActionButton.module.css';

interface ActionButtonProps {
  action: ActionType;
  onClick: () => void;
  disabled?: boolean;
  isFull?: boolean;
}

const actionConfig: Record<ActionType, { Icon: typeof Utensils }> = {
  feed: { Icon: Utensils },
  water: { Icon: Droplets },
  play: { Icon: Gamepad2 },
  walk: { Icon: Footprints },
  bath: { Icon: Bath },
  sleep: { Icon: Moon },
};

export function ActionButton({ action, onClick, disabled, isFull }: ActionButtonProps) {
  const { t } = useTranslation();
  const { Icon } = actionConfig[action];

  return (
    <motion.button
      className={`${styles.button} ${styles[action]} ${isFull ? styles.full : ''}`}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <div className={styles.icon}>
        <Icon />
      </div>
      <span className={styles.label}>{t(`action.${action}`)}</span>
      {isFull && <span className={styles.fullBadge}><Check size={12} /></span>}
    </motion.button>
  );
}
