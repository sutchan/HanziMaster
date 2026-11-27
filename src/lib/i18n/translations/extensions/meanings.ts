// src/lib/i18n/translations/extensions/meanings.ts v5.3.0
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


/** 12 个基础汉字的简短释义，键名与 characters-*.ts 的 translationKey 后缀一致。 */
export interface MeaningTexts {
  one: string;
  two: string;
  three: string;
  person: string;
  big: string;
  small: string;
  mouth: string;
  sunDay: string;
  moonMonth: string;
  mountain: string;
  water: string;
  fire: string;
}

export const meaningsByLocale: Record<string, MeaningTexts> = {
  'en': en.meanings,
  'zh-CN': zhCN.meanings,
  'zh-TW': zhTW.meanings,
  'es': es.meanings,
  'ar': ar.meanings,
  'fr': fr.meanings,
  'pt-BR': ptBR.meanings,
  'de': de.meanings,
  'ja': ja.meanings,
  'ko': ko.meanings,
  'ru': ru.meanings,
};
