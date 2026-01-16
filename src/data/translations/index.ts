import { tr } from './tr';
import { en } from './en';
import type { Language } from '../../utils/types';

export const translations: Record<Language, Record<string, string>> = {
  tr,
  en,
};

export function t(key: string, language: Language, params?: Record<string, string | number>): string {
  let text = translations[language][key] || translations['en'][key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
    });
  }

  return text;
}
