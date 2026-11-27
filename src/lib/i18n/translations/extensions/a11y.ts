// src/lib/i18n/translations/extensions/a11y.ts v5.3.0
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


/** 无障碍相关 aria-label / Toast / Canvas / 键盘替代路径文案，按所属键域分组。 */
export interface A11yTexts {
  common: {
    close: string;
    closeNotification: string;
    notifications: string;
    changeLanguage: string;
    selectLanguage: string;
  };
  learn: { strokeDemoLabel: string };
  practice: {
    canvasLabel: string;
    keyboardLabel: string;
    keyboardHint: string;
  };
}

export const a11yByLocale: Record<string, A11yTexts> = {
  'en': en.a11y,
  'zh-CN': zhCN.a11y,
  'zh-TW': zhTW.a11y,
  'es': es.a11y,
  'ar': ar.a11y,
  'fr': fr.a11y,
  'pt-BR': ptBR.a11y,
  'de': de.a11y,
  'ja': ja.a11y,
  'ko': ko.a11y,
  'ru': ru.a11y,
};
