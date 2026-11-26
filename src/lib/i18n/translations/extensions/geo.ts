// src/lib/i18n/translations/extensions/geo.ts v5.2.61
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

/** 首页事实区与 FAQ 文案：为搜索引擎与生成式引擎提供真实、可引用、服务端可抓取的内容。 */
export interface GeoTexts {
  factsTitle: string;
  factsLead: string;
  fact1: string;
  fact2: string;
  fact3: string;
  faqTitle: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;
}

export const geoByLocale: Record<string, GeoTexts> = {
  'en': en.geo,
  'zh-CN': zhCN.geo,
  'zh-TW': zhTW.geo,
  'es': es.geo,
  'ar': ar.geo,
  'fr': fr.geo,
  'pt-BR': ptBR.geo,
  'de': de.geo,
  'ja': ja.geo,
  'ko': ko.geo,
  'ru': ru.geo,
};
