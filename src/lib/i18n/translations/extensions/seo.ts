// src/lib/i18n/translations/extensions/seo.ts v5.2.61
// 扩展数据已按 locale 拆分；本文件保留全语言聚合视图，供服务端与测试使用。
import { extensions as en } from './by-locale/en';
import { extensions as zhCN } from './by-locale/zh-CN';
import { extensions as zhTW } from './by-locale/zh-TW';
import { extensions as es } from './by-locale/es';
import { extensions as ar } from './by-locale/ar';
import { extensions as fr } from './by-locale/fr';
import { extensions as ptBR } from './by-locale/pt-BR';
import { extensions as de } from './by-locale/de';
import { extensions as ja } from './by-locale/ja';
import { extensions as ko } from './by-locale/ko';
import { extensions as ru } from './by-locale/ru';

/** 每语言的站点/页面 title、description 与 OG 文案；generateMetadata 在服务端读取，缺失语言回退英文。 */
export interface SeoTexts {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  learnTitle: string;
  practiceTitle: string;
  privacyTitle: string;
  termsTitle: string;
}

export const seoByLocale: Record<string, SeoTexts> = {
  'en': en.seo,
  'zh-CN': zhCN.seo,
  'zh-TW': zhTW.seo,
  'es': es.seo,
  'ar': ar.seo,
  'fr': fr.seo,
  'pt-BR': ptBR.seo,
  'de': de.seo,
  'ja': ja.seo,
  'ko': ko.seo,
  'ru': ru.seo,
};
