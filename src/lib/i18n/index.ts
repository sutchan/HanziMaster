// src/lib/i18n/index.ts v5.3.0
// 全语言静态词典：仅用于服务端与测试；客户端经 load-translations.ts 按 locale 动态加载。
import { en } from './translations/en';
import { zhCN } from './translations/zh-CN';
import { zhTW } from './translations/zh-TW';
import { es } from './translations/es';
import { ar } from './translations/ar';
import { fr } from './translations/fr';
import { ptBR } from './translations/pt-BR';
import { de } from './translations/de';
import { ja } from './translations/ja';
import { ko } from './translations/ko';
import { ru } from './translations/ru';
import { extendTranslations } from './translations/extensions';
import { extensions as extEn } from './translations/extensions/by-locale/en';
import { extensions as extZhCN } from './translations/extensions/by-locale/zh-CN';
import { extensions as extZhTW } from './translations/extensions/by-locale/zh-TW';
import { extensions as extEs } from './translations/extensions/by-locale/es';
import { extensions as extAr } from './translations/extensions/by-locale/ar';
import { extensions as extFr } from './translations/extensions/by-locale/fr';
import { extensions as extPtBR } from './translations/extensions/by-locale/pt-BR';
import { extensions as extDe } from './translations/extensions/by-locale/de';
import { extensions as extJa } from './translations/extensions/by-locale/ja';
import { extensions as extKo } from './translations/extensions/by-locale/ko';
import { extensions as extRu } from './translations/extensions/by-locale/ru';

export type Locale = 'en' | 'zh-CN' | 'zh-TW' | 'es' | 'ar' | 'fr' | 'pt-BR' | 'de' | 'ja' | 'ko' | 'ru';

export type Translations = ReturnType<typeof extendTranslations>;

// 递归生成所有叶子键的点分路径联合类型，用于约束 t() 入参，防止使用不存在的 i18n 键
type LeafKeys<T> = T extends string
  ? ''
  : {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${LeafKeys<T[K]>}` extends infer S
          ? S extends string
            ? S
            : never
          : never
        : K;
    }[keyof T & string];

export type TranslationKey = LeafKeys<Translations> extends infer S
  ? S extends string
    ? S
    : never
  : never;

// 所有语言经过同一扩展函数，保证叶子键集合一致（由 i18n.test.ts 校验）
export const translations: Record<Locale, Translations> = {
  'en': extendTranslations(en, 'en', extEn),
  'zh-CN': extendTranslations(zhCN, 'zh-CN', extZhCN),
  'zh-TW': extendTranslations(zhTW, 'zh-TW', extZhTW),
  'es': extendTranslations(es, 'es', extEs),
  'ar': extendTranslations(ar, 'ar', extAr),
  'fr': extendTranslations(fr, 'fr', extFr),
  'pt-BR': extendTranslations(ptBR, 'pt-BR', extPtBR),
  'de': extendTranslations(de, 'de', extDe),
  'ja': extendTranslations(ja, 'ja', extJa),
  'ko': extendTranslations(ko, 'ko', extKo),
  'ru': extendTranslations(ru, 'ru', extRu),
};

export const locales: Locale[] = Object.keys(translations) as Locale[];
