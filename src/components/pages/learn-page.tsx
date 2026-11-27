// src/components/pages/learn-page.tsx v5.3.0
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from '@/components/locale-provider';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { usePronunciation } from '@/hooks/use-pronunciation';
import { useHaptic } from '@/hooks/use-haptic';
import { useProgress } from '@/hooks/use-progress';
import { characters } from '@/lib/characters';
import { safeGetItem, trySetItem } from '@/lib/storage';
import { getArrowStep } from '@/lib/direction';
import { useLearnQuizSession } from '@/hooks/use-learn-quiz-session';

const SELECTED_CHAR_KEY = 'hanzi-master-selected-char';
import { CharacterGrid } from '@/components/learn/character-grid';
import { CharacterDetail } from '@/components/learn/character-detail';
import dynamic from 'next/dynamic';

// 测验弹窗按需拆包（P1-12）
const QuizDialog = dynamic(
  () => import('@/components/learn/quiz-dialog').then((m) => m.QuizDialog),
  { ssr: false }
);
import { EmptyState } from '@/components/state/state-views';

export default function LearnPage() {
  const { t, locale } = useLocale();
  useScrollReveal();
  const { speak, pronounceError, speechSupported } = usePronunciation();
  const vibrate = useHaptic();
  const progress = useProgress();
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(characters[0]?.id ?? null);
  // OPT-18：测验状态与计时器由统一 hook/reducer 管理，重进即空态
  const quiz = useLearnQuizSession();

  // 选择状态持久化：刷新后保留上次学习的字，否则总回到第 1 字（F7）
  useEffect(() => {
    const saved = safeGetItem<unknown>(SELECTED_CHAR_KEY, null);
    if (typeof saved === 'number' && characters.some((c) => c.id === saved)) {
      setSelectedCharacterId(saved);
    }
  }, []);
  useEffect(() => {
    if (selectedCharacterId !== null) trySetItem(SELECTED_CHAR_KEY, selectedCharacterId);
  }, [selectedCharacterId]);

  const selectedCharacter = characters.find((c) => c.id === selectedCharacterId) || null;
  const currentIndex = Math.max(0, characters.findIndex((c) => c.id === selectedCharacterId));

  const handleQuizSubmit = () => {
    if (!selectedCharacter || quiz.state.correct !== null || !quiz.state.answer.trim()) return;
    const isCorrect = quiz.state.answer.toLowerCase() === selectedCharacter.pinyin.toLowerCase();
    // 学习页测验同样计入准确率/连胜/学习记录（此前只反馈不写进度）
    progress.recordQuizResult(selectedCharacter.id, isCorrect);
    vibrate(isCorrect ? 'success' : 'error');
    // 答对后由 hook 定时自动关闭，所有重进/关闭路径统一清理计时器
    quiz.submit(isCorrect);
  };

  const goCharacter = useCallback((delta: number) => {
    const idx = characters.findIndex((c) => c.id === (selectedCharacterId ?? -1));
    const next = characters[(idx + delta + characters.length) % characters.length];
    setSelectedCharacterId(next.id);
  }, [selectedCharacterId]);

  const handleNextCharacter = () => goCharacter(1);

  // 键盘快捷键：← → 切换汉字（弹窗打开或组合键时忽略）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (quiz.state.open || e.ctrlKey || e.metaKey || e.altKey) return;
      // 输入框 / 文本域 / 可编辑区域中的方向键属于文本编辑，不应切换汉字
      const target = e.target as HTMLElement | null;
      if (target?.isContentEditable || (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
      // OPT-13：方向键步进按事件目标的实际 direction 计算，RTL 左右互换
      const step = getArrowStep(e.key, target ?? null);
      if (step !== 0) goCharacter(step);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quiz.state.open, goCharacter]);

  return (
    <div id="learn-page" className="min-h-screen bg-background">
      <div id="learn-content" className="safe-bottom mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <Breadcrumbs locale={locale} path="/learn" />
        {/* 编辑式页眉：题名 + 当前字序号 + 键盘提示，发丝线与页面分隔 */}
        <div className="reveal mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-ink-200 pb-5 text-start dark:border-ink-800">
          <div>
            <h1 className="display-font text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">
              {t('common.dailyPractice')}
            </h1>
            <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-300">
              {t('common.masterCharacters')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="display-font text-2xl text-vermilion-600 dark:text-vermilion-400" aria-hidden="true">
              {String(currentIndex + 1).padStart(2, '0')}
              <span className="text-ink-300 dark:text-ink-600">/{String(characters.length).padStart(2, '0')}</span>
            </span>
            <p className="hidden items-center gap-2 text-xs text-ink-400 dark:text-ink-500 md:flex">
              <kbd className="kbd" aria-hidden="true">←</kbd>
              <kbd className="kbd" aria-hidden="true">→</kbd>
              <span>{t('learn.kbdHint')}</span>
            </p>
          </div>
        </div>

        {progress.persistError && (
          <p id="learn-persist-error" role="alert" className="mb-6 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
            {t('progress.persistFailed')}
          </p>
        )}

        <CharacterGrid selectedId={selectedCharacterId} onSelect={setSelectedCharacterId} />

        {selectedCharacter ? (
          <CharacterDetail
            key={selectedCharacter.id}
            character={selectedCharacter}
            onStartQuiz={quiz.open}
            onNextCharacter={handleNextCharacter}
            onSpeak={speak}
            speechSupported={speechSupported}
            pronounceError={pronounceError}
          />
        ) : (
          <EmptyState className="mb-8" />
        )}
      </div>

      <QuizDialog
        open={quiz.state.open}
        onOpenChange={(open) => (open ? quiz.open() : quiz.close())}
        character={selectedCharacter}
        value={quiz.state.answer}
        onChange={quiz.change}
        correct={quiz.state.correct}
        onSubmit={handleQuizSubmit}
      />
    </div>
  );
}
