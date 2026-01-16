import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { t as translate } from '../data/translations';

export function useTranslation() {
  const language = useGameStore((state) => state.settings.language);
  const petName = useGameStore((state) => state.pet?.customName || '');

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const allParams = { ...params, name: petName };
      return translate(key, language, allParams);
    },
    [language, petName]
  );

  return { t, language };
}
