// src/lib/i18n/load-translations.ts v5.2.61
// P1-11 / OPT-02：基础词典与扩展片段都按 locale 动态 import，只请求当前语言。
import type { Locale, Translations } from '@/lib/i18n';
import type { LocaleExtensions } from './translations/extensions/by-locale/types';
import { extendTranslations } from './translations/extensions';

type BaseTranslations = typeof import('./translations/en').en;

export const baseLoaders: Record<Locale, () => Promise<BaseTranslations>> = {
  en: () => import('./translations/en').then((m) => m.en as BaseTranslations),
  'zh-CN': () => import('./translations/zh-CN').then((m) => m.zhCN as BaseTranslations),
  'zh-TW': () => import('./translations/zh-TW').then((m) => m.zhTW as BaseTranslations),
  es: () => import('./translations/es').then((m) => m.es as BaseTranslations),
  ar: () => import('./translations/ar').then((m) => m.ar as BaseTranslations),
  fr: () => import('./translations/fr').then((m) => m.fr as BaseTranslations),
  'pt-BR': () => import('./translations/pt-BR').then((m) => m.ptBR as BaseTranslations),
  de: () => import('./translations/de').then((m) => m.de as BaseTranslations),
  ja: () => import('./translations/ja').then((m) => m.ja as BaseTranslations),
  ko: () => import('./translations/ko').then((m) => m.ko as BaseTranslations),
  ru: () => import('./translations/ru').then((m) => m.ru as BaseTranslations),
};

/** 每个 locale 一个独立 chunk；测试可 spy 这些 loader 验证只请求目标 locale。 */
export const extensionLoaders: Record<Locale, () => Promise<LocaleExtensions>> = {
  en: () => import('./translations/extensions/by-locale/en').then((m) => m.extensions),
  'zh-CN': () => import('./translations/extensions/by-locale/zh-CN').then((m) => m.extensions),
  'zh-TW': () => import('./translations/extensions/by-locale/zh-TW').then((m) => m.extensions),
  es: () => import('./translations/extensions/by-locale/es').then((m) => m.extensions),
  ar: () => import('./translations/extensions/by-locale/ar').then((m) => m.extensions),
  fr: () => import('./translations/extensions/by-locale/fr').then((m) => m.extensions),
  'pt-BR': () => import('./translations/extensions/by-locale/pt-BR').then((m) => m.extensions),
  de: () => import('./translations/extensions/by-locale/de').then((m) => m.extensions),
  ja: () => import('./translations/extensions/by-locale/ja').then((m) => m.extensions),
  ko: () => import('./translations/extensions/by-locale/ko').then((m) => m.extensions),
  ru: () => import('./translations/extensions/by-locale/ru').then((m) => m.extensions),
};

/** 动态加载单个语言包及其扩展片段并合并（键集合由同一函数保证一致）。 */
export async function loadTranslations(locale: Locale): Promise<Translations> {
  const [base, ext] = await Promise.all([baseLoaders[locale](), extensionLoaders[locale]()]);
  return extendTranslations(base, locale, ext);
}
