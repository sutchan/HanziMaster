// src/lib/i18n/translations/extensions/privacy.ts v5.3.0
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

/** 隐私同意撤回文案；独立模块避免 settings.ts 超过 200 行门禁。 */
export interface PrivacyTexts {
  privacyTitle: string; privacyDesc: string; withdrawConsent: string; consentUpdated: string;
}

export const privacyByLocale: Record<string, PrivacyTexts> = {
  'en': en.privacy,
  'zh-CN': zhCN.privacy,
  'zh-TW': zhTW.privacy,
  'es': es.privacy,
  'ar': ar.privacy,
  'fr': fr.privacy,
  'pt-BR': ptBR.privacy,
  'de': de.privacy,
  'ja': ja.privacy,
  'ko': ko.privacy,
  'ru': ru.privacy,
};
