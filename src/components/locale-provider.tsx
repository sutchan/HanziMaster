// src/components/locale-provider.tsx v5.2.61
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Locale, TranslationKey, Translations } from '@/lib/i18n';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/site';
import { getNestedValue, interpolate } from '@/lib/i18n/translate';
import { loadTranslations } from '@/lib/i18n/load-translations';
import { en } from '@/lib/i18n/translations/en';
import { extendTranslations } from '@/lib/i18n/translations/extensions';
import { LocaleStateContext, TranslationContext, useLocaleState, useTranslationContext } from '@/components/locale-contexts';
import { useStableEvent } from '@/hooks/use-stable-event';
import {
  applyDocumentLocale,
  getUrlLocale,
  resolveInitialLocale,
  safeSetItem,
  syncUrlLocale,
} from '@/lib/locale-utils';

type LocaleProviderProps = {
  children: React.ReactNode;
  defaultLocale?: Locale;
  /** RSC 首屏预载的词典；传入后首屏不再异步加载，避免语言闪烁。 */
  initialDictionary?: Translations;
  storageKey?: string;
};

const STORAGE_KEY = 'hanzi-master-locale';
const FALLBACK_DICTIONARY = extendTranslations(en, DEFAULT_LOCALE) as Translations;

export function LocaleProvider({
  children,
  defaultLocale = DEFAULT_LOCALE,
  initialDictionary,
  storageKey = STORAGE_KEY,
  ...props
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [dictionary, setDictionary] = useState<Translations>(
    initialDictionary ?? FALLBACK_DICTIONARY,
  );

  useEffect(() => {
    const initial = resolveInitialLocale(storageKey, defaultLocale);
    setLocaleState(initial);
    applyDocumentLocale(initial);
    // URL / cookie 胜出时同步回写存储，避免三处状态分叉导致后续页面语言跳变
    safeSetItem(storageKey, initial);
  }, [storageKey, defaultLocale]);

  // 浏览器后退/前进时按 URL 前缀恢复语言（U5）
  useEffect(() => {
    const onPopState = () => {
      const fromUrl = getUrlLocale();
      if (fromUrl) {
        setLocaleState(fromUrl);
        applyDocumentLocale(fromUrl);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // P1-11：只按需加载当前语言词典；SSR 预载时直接复用，切回默认语言也恢复预载词典。
  useEffect(() => {
    if (locale === defaultLocale && initialDictionary) {
      setDictionary(initialDictionary);
      return;
    }
    if (locale === DEFAULT_LOCALE) {
      setDictionary(FALLBACK_DICTIONARY);
      return;
    }
    let active = true;
    loadTranslations(locale)
      .then((next) => {
        if (active) setDictionary(next);
      })
      .catch(() => {
        // 词典 chunk 加载失败时保留上一份词典，避免 unhandled rejection 界面空白
      });
    return () => {
      active = false;
    };
  }, [locale, defaultLocale, initialDictionary]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      safeSetItem(storageKey, newLocale);
      setLocaleState(newLocale);
      applyDocumentLocale(newLocale);
      syncUrlLocale(newLocale);
    },
    [storageKey],
  );

  // OPT-06：t 引用恒定（useEvent 语义），内部闭包随词典更新，memo 子树不会因词典到达而失效。
  const t = useStableEvent(
    (key: TranslationKey, params?: Record<string, string | number>): string =>
      // getNestedValue 对缺失键已返回键名；此处不能再把合法空字符串当作缺失。
      interpolate(getNestedValue(dictionary, key), params),
  );

  // 两个 Context 分离：语言状态与翻译通道各自变更，只订阅状态的组件不随词典重渲染。
  const stateValue = useMemo(
    () => ({ locale, setLocale, availableLocales: [...SUPPORTED_LOCALES] }),
    [locale, setLocale],
  );
  const translationValue = useMemo(() => ({ t, dictionary }), [t, dictionary]);

  return (
    <LocaleStateContext.Provider {...props} value={stateValue}>
      <TranslationContext.Provider value={translationValue}>{children}</TranslationContext.Provider>
    </LocaleStateContext.Provider>
  );
}

/** 公开 API 不变：useLocale 仍返回 locale / t / setLocale / availableLocales。 */
export const useLocale = () => {
  const state = useLocaleState();
  const { t } = useTranslationContext();
  return { ...state, t };
};

export const useTranslation = () => {
  const { t } = useTranslationContext();
  return { t };
};

/** 仅订阅语言状态的内部入口，供按需订阅与渲染次数测试使用。 */
export { useLocaleState };
