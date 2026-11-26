// src/lib/i18n/translations/extensions/settings.ts v5.2.61
// prettier-ignore — 紧凑接口声明，避免本文件超过 200 行门禁
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

// prettier-ignore — 紧凑接口声明，避免本文件超过 200 行门禁
export interface SettingsTexts {
  title: string; description: string; appearance: string; language: string; feedback: string;
  haptics: string; hapticsDesc: string; motion: string; reduceMotion: string; reduceMotionDesc: string;
  data: string; resetProgress: string; resetDesc: string; resetYes: string; resetDone: string;
}

export const settingsByLocale: Record<string, SettingsTexts> = {
  'en': en.settings,
  'zh-CN': zhCN.settings,
  'zh-TW': zhTW.settings,
  'es': es.settings,
  'ar': ar.settings,
  'fr': fr.settings,
  'pt-BR': ptBR.settings,
  'de': de.settings,
  'ja': ja.settings,
  'ko': ko.settings,
  'ru': ru.settings,
};
