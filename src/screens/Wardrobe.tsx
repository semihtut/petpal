import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { items } from '../data/items';
import { Card } from '../components/UI';
import { Pet } from '../components/Pet';
import styles from './Wardrobe.module.css';

interface WardrobeProps {
  onBack: () => void;
}

export function Wardrobe({ onBack }: WardrobeProps) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<'hat' | 'collar'>('hat');

  const ownedItems = useGameStore((state) => state.inventory.ownedItems);
  const equippedItems = useGameStore((state) => state.inventory.equippedItems);
  const equipItem = useGameStore((state) => state.equipItem);
  const unequipItem = useGameStore((state) => state.unequipItem);

  const ownedCategoryItems = items.filter(
    (item) =>
      item.category === activeCategory && ownedItems.includes(item.id)
  );

  const handleEquip = (itemId: string) => {
    equipItem(itemId, activeCategory);
  };

  const handleUnequip = () => {
    unequipItem(activeCategory);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← {t('common.back')}
        </button>
        <h1 className={styles.title}>{t('wardrobe.title')}</h1>
        <div style={{ width: 60 }} />
      </header>

      {/* Pet Preview */}
      <div className={styles.preview}>
        <Pet />
      </div>

      {/* Category Tabs */}
      <div className={styles.categories}>
        <button
          className={`${styles.categoryTab} ${activeCategory === 'hat' ? styles.active : ''}`}
          onClick={() => setActiveCategory('hat')}
        >
          🎩 {t('shop.hats')}
        </button>
        <button
          className={`${styles.categoryTab} ${activeCategory === 'collar' ? styles.active : ''}`}
          onClick={() => setActiveCategory('collar')}
        >
          🎀 {t('shop.collars')}
        </button>
      </div>

      {/* Items */}
      <div className={styles.itemsList}>
        {/* Unequip option */}
        {equippedItems[activeCategory] && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card
              className={styles.itemCard}
              onClick={handleUnequip}
            >
              <div className={styles.itemContent}>
                <span className={styles.itemIcon}>❌</span>
                <span className={styles.itemName}>{t('wardrobe.unequip')}</span>
              </div>
            </Card>
          </motion.div>
        )}

        {ownedCategoryItems.length === 0 && !equippedItems[activeCategory] ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>👕</span>
            <p>{t('wardrobe.empty')}</p>
          </div>
        ) : (
          ownedCategoryItems.map((item, index) => {
            const isEquipped = equippedItems[activeCategory] === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`${styles.itemCard} ${isEquipped ? styles.equipped : ''}`}
                  onClick={() => !isEquipped && handleEquip(item.id)}
                >
                  <div className={styles.itemContent}>
                    <span className={styles.itemIcon}>
                      {activeCategory === 'hat' ? '🎩' : '🎀'}
                    </span>
                    <span className={styles.itemName}>{t(item.nameKey)}</span>
                    {item.isRare && <span className={styles.rareBadge}>✨</span>}
                  </div>
                  {isEquipped ? (
                    <span className={styles.equippedBadge}>{t('shop.equipped')}</span>
                  ) : (
                    <span className={styles.equipHint}>{t('wardrobe.equip')}</span>
                  )}
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
