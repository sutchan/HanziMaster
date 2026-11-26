// src/lib/i18n/translations/extensions/cloud.ts v5.2.61
// 云同步文案（11 语言齐全），独立扩展模块避免语言基准包超过 200 行。
// prettier-ignore
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

export interface CloudTexts {
  title: string; desc: string; code: string; generate: string; copy: string;
  upload: string; download: string; uploadDone: string; downloadDone: string;
  failed: string; notConfigured: string; noProgress: string;
}

// prettier-ignore

export const cloudByLocale: Record<string, CloudTexts> = {
  'en': en.cloud,
  'zh-CN': zhCN.cloud,
  'zh-TW': zhTW.cloud,
  'es': es.cloud,
  'ar': ar.cloud,
  'fr': fr.cloud,
  'pt-BR': ptBR.cloud,
  'de': de.cloud,
  'ja': ja.cloud,
  'ko': ko.cloud,
  'ru': ru.cloud,
};
