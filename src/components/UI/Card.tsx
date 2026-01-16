import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'glass';
  padding?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
}

export function Card({
  children,
  onClick,
  variant = 'default',
  padding = 'medium',
  className = '',
}: CardProps) {
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      className={`${styles.card} ${styles[variant]} ${styles[`padding-${padding}`]} ${className}`}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </Component>
  );
}
