// src/lib/i18n/translations/extensions/pwa.ts v5.2.61
// P2-14：PWA 安装引导与离线页文案（11 语言齐全）。
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


export interface PwaTexts {
  installTitle: string;
  installAction: string;
  offlineTitle: string;
  offlineHint: string;
}

export const pwaByLocale: Record<string, PwaTexts> = {
  'en': en.pwa,
  'zh-CN': zhCN.pwa,
  'zh-TW': zhTW.pwa,
  'es': es.pwa,
  'ar': ar.pwa,
  'fr': fr.pwa,
  'pt-BR': ptBR.pwa,
  'de': de.pwa,
  'ja': ja.pwa,
  'ko': ko.pwa,
  'ru': ru.pwa,
};
