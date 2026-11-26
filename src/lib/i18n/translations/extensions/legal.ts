// src/lib/i18n/translations/extensions/legal.ts v5.2.61
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


/** 合规相关 UI 文案键；完整正文见 src/content/privacy.ts 与 terms.ts（双语静态）。 */
export interface LegalTexts {
  privacyTitle: string;
  termsTitle: string;
  privacyLink: string;
  termsLink: string;
  consentTitle: string;
  consentBody: string;
  accept: string;
  reject: string;
  disclaimerShort: string;
  legalHeading: string;
}

export const legalByLocale: Record<string, LegalTexts> = {
  'en': en.legal,
  'zh-CN': zhCN.legal,
  'zh-TW': zhTW.legal,
  'es': es.legal,
  'ar': ar.legal,
  'fr': fr.legal,
  'pt-BR': ptBR.legal,
  'de': de.legal,
  'ja': ja.legal,
  'ko': ko.legal,
  'ru': ru.legal,
};
