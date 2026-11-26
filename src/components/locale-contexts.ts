// src/components/locale-contexts.ts v5.2.61
'use client';

import { createContext, useContext } from 'react';
import type { Locale, TranslationKey, Translations } from '@/lib/i18n';

export type Translate = (key: TranslationKey, params?: Record<string, string | number>) => string;

/** 语言状态：locale / setLocale / 语言清单，仅在语言切换时变更引用。 */
export interface LocaleStateValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  availableLocales: Locale[];
}

/** 翻译通道：t 引用恒定，dictionary 变更只影响订阅翻译的组件。 */
export interface TranslationValue {
  t: Translate;
  dictionary: Translations;
}

export const LocaleStateContext = createContext<LocaleStateValue | undefined>(undefined);
export const TranslationContext = createContext<TranslationValue | undefined>(undefined);

export function useLocaleState(): LocaleStateValue {
  const context = useContext(LocaleStateContext);
  if (context === undefined) throw new Error('useLocale must be used within a LocaleProvider');
  return context;
}

export function useTranslationContext(): TranslationValue {
  const context = useContext(TranslationContext);
  if (context === undefined) throw new Error('useTranslation must be used within a LocaleProvider');
  return context;
}
