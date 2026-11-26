// src/lib/i18n/translations/extensions/progress.ts v5.2.61
// 进度导出/导入入口与持久化失败提示文案（11 语言齐全）。
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


export interface ProgressTexts {
  exportLabel: string;
  importLabel: string;
  importInvalid: string;
  importDone: string;
  persistFailed: string;
}

export const progressByLocale: Record<string, ProgressTexts> = {
  'en': en.progress,
  'zh-CN': zhCN.progress,
  'zh-TW': zhTW.progress,
  'es': es.progress,
  'ar': ar.progress,
  'fr': fr.progress,
  'pt-BR': ptBR.progress,
  'de': de.progress,
  'ja': ja.progress,
  'ko': ko.progress,
  'ru': ru.progress,
};
