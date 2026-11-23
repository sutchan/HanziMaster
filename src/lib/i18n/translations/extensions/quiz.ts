// src/lib/i18n/translations/extensions/quiz.ts v5.2.59
// 测验纠错提示（11 语言）：答后揭示正确答案，避免题面泄题。
type QuizText = { correctAnswer: string };

export const quizByLocale: Record<string, QuizText> = {
  en: { correctAnswer: 'Correct answer' },
  'zh-CN': { correctAnswer: '正确答案' },
  'zh-TW': { correctAnswer: '正確答案' },
  es: { correctAnswer: 'Respuesta correcta' },
  ar: { correctAnswer: 'الإجابة الصحيحة' },
  fr: { correctAnswer: 'Bonne réponse' },
  'pt-BR': { correctAnswer: 'Resposta correta' },
  de: { correctAnswer: 'Richtige Antwort' },
  ja: { correctAnswer: '正解' },
  ko: { correctAnswer: '정답' },
  ru: { correctAnswer: 'Правильный ответ' },
};
