// src/lib/i18n/translations/extensions/quiz.ts v5.3.0
// 测验纠错提示（11 语言）：答后揭示正确答案，避免题面泄题。
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

export type QuizText = { correctAnswer: string };

export const quizByLocale: Record<string, QuizText> = {
  'en': en.quiz,
  'zh-CN': zhCN.quiz,
  'zh-TW': zhTW.quiz,
  'es': es.quiz,
  'ar': ar.quiz,
  'fr': fr.quiz,
  'pt-BR': ptBR.quiz,
  'de': de.quiz,
  'ja': ja.quiz,
  'ko': ko.quiz,
  'ru': ru.quiz,
};
