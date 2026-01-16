import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { getItemsByCategory } from '../data/items';
import { Button, Card, Toast } from '../components/UI';
import type { ItemCategory } from '../utils/types';
import styles from './Shop.module.css';

interface ShopProps {
  onBack: () => void;
}

type ShopCategory = 'hat' | 'collar' | 'floor' | 'wall' | 'bed' | 'toy';

export function Shop({ onBack }: ShopProps) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('hat');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(
    null
  );

  const coins = useGameStore((state) => state.coins);
  const ownedItems = useGameStore((state) => state.inventory.ownedItems);
  const equippedItems = useGameStore((state) => state.inventory.equippedItems);
  const purchaseItem = useGameStore((state) => state.purchaseItem);
  const equipItem = useGameStore((state) => state.equipItem);

  const categories: { id: ShopCategory; icon: string; labelKey: string }[] = [
    { id: 'hat', icon: '🎩', labelKey: 'shop.hats' },
    { id: 'collar', icon: '🎀', labelKey: 'shop.collars' },
    { id: 'floor', icon: '🟫', labelKey: 'shop.floors' },
    { id: 'wall', icon: '🖼️', labelKey: 'shop.walls' },
    { id: 'bed', icon: '🛏️', labelKey: 'shop.beds' },
    { id: 'toy', icon: '🎾', labelKey: 'shop.toys' },
  ];

  const categoryItems = getItemsByCategory(activeCategory);

  const handlePurchase = (itemId: string, price: number) => {
    if (coins < price) {
      setToast({ message: t('shop.notEnough'), type: 'info' });
      return;
    }

    const success = purchaseItem(itemId, price);
    if (success) {
      setToast({ message: t('shop.purchased'), type: 'success' });
    }
  };

  const handleEquip = (itemId: string, category: ItemCategory) => {
    equipItem(itemId, category as keyof typeof equippedItems);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← {t('common.back')}
        </button>
        <h1 className={styles.title}>{t('shop.title')}</h1>
        <div className={styles.coinBadge}>
          <span>🪙</span>
          <span>{coins}</span>
        </div>
      </header>

      {/* Category Tabs */}
      <div className={styles.categories}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.categoryTab} ${
              activeCategory === cat.id ? styles.active : ''
            }`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className={styles.categoryIcon}>{cat.icon}</span>
            <span className={styles.categoryLabel}>{t(cat.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className={styles.itemsGrid}>
        <AnimatePresence mode="wait">
          {categoryItems.map((item, index) => {
            const isOwned = ownedItems.includes(item.id);
            const isEquipped = equippedItems[activeCategory as keyof typeof equippedItems] === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`${styles.itemCard} ${isEquipped ? styles.equipped : ''}`}>
                  <div className={styles.itemContent}>
                    {item.isRare && <span className={styles.rareBadge}>✨</span>}
                    <div className={styles.itemIcon}>
                      {activeCategory === 'hat' && '🎩'}
                      {activeCategory === 'collar' && '🎀'}
                      {activeCategory === 'floor' && '🟫'}
                      {activeCategory === 'wall' && '🖼️'}
                      {activeCategory === 'bed' && '🛏️'}
                      {activeCategory === 'toy' && '🎾'}
                    </div>
                    <span className={styles.itemName}>{t(item.nameKey)}</span>
                    {item.effect && (
                      <span className={styles.itemEffect}>
                        +{Math.round(item.effect.value * 100)}%
                      </span>
                    )}
                  </div>
                  <div className={styles.itemAction}>
                    {isEquipped ? (
                      <span className={styles.equippedBadge}>{t('shop.equipped')}</span>
                    ) : isOwned ? (
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleEquip(item.id, item.category)}
                      >
                        {t('wardrobe.equip')}
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        onClick={() => handlePurchase(item.id, item.price)}
                        disabled={coins < item.price}
                      >
                        {item.price} 🪙
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'info'}
        isVisible={!!toast}
        onHide={() => setToast(null)}
      />
    </div>
  );
}
