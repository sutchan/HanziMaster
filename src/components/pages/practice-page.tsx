// src/components/pages/practice-page.tsx v5.3.0
'use client';

import { useReducer, useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useProgress } from '@/hooks/use-progress';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { useHaptic } from '@/hooks/use-haptic';
import { characters } from '@/lib/characters';
import { quizCharacters, type CharacterQuiz } from '@/components/practice/practice-assets';
import { PracticeOptionsGrid } from '@/components/practice/practice-options';
import { WeeklyProgress } from '@/components/practice/weekly-progress';
import { INITIAL_PRACTICE_QUIZ, practiceQuizReducer } from '@/components/pages/quiz-session';
import dynamic from 'next/dynamic';

// 弹窗与 Canvas 相关重型组件按需拆包（P1-12）
const WritingDialog = dynamic(
  () => import('@/components/practice/writing-dialog').then((m) => m.WritingDialog),
  { ssr: false }
);
const QuizDialog = dynamic(
  () => import('@/components/practice/quiz-dialog').then((m) => m.QuizDialog),
  { ssr: false }
);

// 汉字到笔画数的映射，供书写对话框显示描红提示
const strokeMap = new Map(characters.map((c) => [c.hanzi, c.strokes]));

export default function PracticePage() {
  const { t, locale } = useLocale();
  const progress = useProgress();
  const vibrate = useHaptic();
  useScrollReveal();

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showWritingDialog, setShowWritingDialog] = useState(false);
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [currentWriteChar, setCurrentWriteChar] = useState<CharacterQuiz>(quizCharacters[0]);
  // OPT-18：测验进度与答案集中在显式 reducer，重开统一 reset
  const [quizState, dispatchQuiz] = useReducer(practiceQuizReducer, INITIAL_PRACTICE_QUIZ);

  const handlePracticeOption = (optionId: string) => {
    setSelectedOption(optionId);
    if (optionId === 'writing') {
      setShowWritingDialog(true);
    } else if (optionId === 'quiz') {
      setShowQuizDialog(true);
    } else if (optionId === 'progress') {
      // 「学习进度」卡定位到页面下方已有的统计区，而非仅改变选中态（F1）
      document.getElementById('weekly-progress')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNextWriteChar = () => {
    // 书写练习即视为已学习该字，持久化到进度系统
    progress.markLearned(currentWriteChar.id);
    const currentIndex = quizCharacters.findIndex((c) => c.id === currentWriteChar.id);
    const nextIndex = (currentIndex + 1) % quizCharacters.length;
    setCurrentWriteChar(quizCharacters[nextIndex]);
  };

  const handleQuizAnswer = (answer: string) => {
    if (quizState.answered) return;
    const currentQuizChar = quizCharacters[quizState.currentIndex];
    const isCorrect = answer === currentQuizChar.hanzi;
    // 记录测验结果，驱动进度统计（连胜/准确率/周活动）
    progress.recordQuizResult(currentQuizChar.id, isCorrect);
    dispatchQuiz({ type: 'answer', answer, correct: isCorrect });
    vibrate(isCorrect ? 'success' : 'error');
  };

  const handleNextQuiz = () => {
    const nextIndex = quizState.currentIndex + 1;
    if (nextIndex >= quizCharacters.length) {
      setShowQuizDialog(false);
      dispatchQuiz({ type: 'reset' });
    } else {
      dispatchQuiz({ type: 'next', total: quizCharacters.length });
    }
  };

  const handleQuizOpenChange = (open: boolean) => {
    setShowQuizDialog(open);
    if (!open) dispatchQuiz({ type: 'reset' });
  };

  const currentQuizChar = quizCharacters[quizState.currentIndex];

  return (
    <div id="practice-page" className="min-h-screen bg-linear-to-b from-ink-50/50 to-background dark:from-ink-950/50 dark:to-background">
      <div id="practice-content" className="max-w-6xl mx-auto px-6 py-16 safe-bottom">
        <Breadcrumbs locale={locale} path="/practice" />
        <div className="text-center mb-16 reveal">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-ink-900 dark:text-ink-50 display-font">
            {t('common.practice')} {t('practice.center')}
          </h1>
          <p className="text-xl text-ink-600 dark:text-ink-300 max-w-2xl mx-auto">
            {t('practice.subtitle')}
          </p>
        </div>

        {progress.persistError && (
          <p id="practice-persist-error" role="alert" className="mb-6 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
            {t('progress.persistFailed')}
          </p>
        )}

        <PracticeOptionsGrid selectedOption={selectedOption} onSelect={handlePracticeOption} />

        <WeeklyProgress
          charactersLearned={progress.getLearnedCount()}
          dayStreak={progress.streak}
          accuracy={progress.accuracy}
          weeklyActivity={progress.getWeeklyActivity()}
        />
      </div>

      <WritingDialog
        open={showWritingDialog}
        onOpenChange={setShowWritingDialog}
        character={currentWriteChar}
        strokeCount={strokeMap.get(currentWriteChar.hanzi) ?? currentWriteChar.hanzi.length}
        onNext={handleNextWriteChar}
      />

      <QuizDialog
        open={showQuizDialog}
        onOpenChange={handleQuizOpenChange}
        character={currentQuizChar}
        selectedAnswer={quizState.selectedAnswer}
        answered={quizState.answered}
        onAnswer={handleQuizAnswer}
        onNext={handleNextQuiz}
      />
    </div>
  );
}
