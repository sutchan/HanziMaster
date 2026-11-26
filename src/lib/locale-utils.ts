// src/lib/locale-utils.ts v5.2.61
// 语言解析与文档同步工具：从 locale-provider 拆出，保持 Provider 仅负责状态编排。
import type { Locale } from '@/lib/i18n';
import { DEFAULT_LOCALE, isRtlLocale, isSupportedLocale } from '@/lib/site';
import { withLocale, syncMetadataLocale } from '@/lib/sync-locale-meta';
import { safeGetItem, safeSetItem } from '@/lib/storage';

const COOKIE_KEY = 'hanzi-master-locale';

export const getBrowserLocale = (): Locale => {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) {
    return /tw|hk|mo|hant/.test(browserLang) ? 'zh-TW' : 'zh-CN';
  }
  const localeMap: Record<string, Locale> = {
    es: 'es', ar: 'ar', fr: 'fr', pt: 'pt-BR', de: 'de', ja: 'ja', ko: 'ko', ru: 'ru',
  };
  for (const [lang, locale] of Object.entries(localeMap)) {
    if (browserLang.startsWith(lang)) return locale;
  }
  return DEFAULT_LOCALE;
};

/** 语言来源优先级：/ {locale}/ 前缀 > ?lang= > localStorage > 浏览器语言。 */
export const resolveInitialLocale = (storageKey: string, defaultLocale: Locale): Locale => {
  const stored = safeGetItem<Locale>(storageKey, defaultLocale);
  if (typeof window === 'undefined') return defaultLocale;
  const fromPath = window.location.pathname.split('/').filter(Boolean)[0];
  if (fromPath && isSupportedLocale(fromPath)) return fromPath;
  const fromQuery = new URLSearchParams(window.location.search).get('lang');
  if (fromQuery && isSupportedLocale(fromQuery)) return fromQuery;
  return stored && isSupportedLocale(stored) ? stored : getBrowserLocale();
};

/** 同步 lang / dir（RTL）、cookie 与 SEO 元数据，供 SSR 首屏读取。 */
export const applyDocumentLocale = (value: Locale): void => {
  document.documentElement.lang = value;
  document.documentElement.dir = isRtlLocale(value) ? 'rtl' : 'ltr';
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
  syncMetadataLocale(value);
};

/** 语言写入 URL 前缀：用 pushState 保留切换历史，浏览器后退可回到原语言（U5）。 */
export const syncUrlLocale = (value: Locale): void => {
  const url = new URL(window.location.href);
  url.href = withLocale(url.toString(), value);
  url.searchParams.delete('lang');
  const next = url.toString();
  if (next === window.location.href) return;
  window.history.pushState({ locale: value }, '', next);
};

/** 前进/后退时只接受 URL 中的合法语言前缀，避免恢复到无效语言。 */
export const getUrlLocale = (): Locale | null => {
  if (typeof window === 'undefined') return null;
  const fromPath = window.location.pathname.split('/').filter(Boolean)[0];
  if (fromPath && isSupportedLocale(fromPath)) return fromPath;
  const fromQuery = new URLSearchParams(window.location.search).get('lang');
  return fromQuery && isSupportedLocale(fromQuery) ? fromQuery : null;
};

export { safeSetItem };
