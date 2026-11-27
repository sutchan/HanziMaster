// src/hooks/use-learn-quiz-session.ts v5.3.0
// OPT-18：学习页测验会话 + 自动关闭计时器；所有重进/关闭路径统一清理计时器。
'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { INITIAL_LEARN_QUIZ, learnQuizReducer } from '@/components/pages/quiz-session';

const AUTO_CLOSE_MS = 1500;

export function useLearnQuizSession() {
  const [state, dispatch] = useReducer(learnQuizReducer, INITIAL_LEARN_QUIZ);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  // 卸载兜底：路由切换后不再触发已卸载组件的 dispatch
  useEffect(() => clearTimer, [clearTimer]);

  const open = useCallback(() => {
    clearTimer();
    dispatch({ type: 'open' });
  }, [clearTimer]);

  const close = useCallback(() => {
    clearTimer();
    dispatch({ type: 'close' });
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    dispatch({ type: 'reset' });
  }, [clearTimer]);

  const change = useCallback((value: string) => {
    clearTimer();
    dispatch({ type: 'answer', value });
  }, [clearTimer]);

  const submit = useCallback((correct: boolean) => {
    clearTimer();
    dispatch({ type: 'submit', correct });
    if (correct) {
      timer.current = setTimeout(() => {
        timer.current = null;
        dispatch({ type: 'autoClose' });
      }, AUTO_CLOSE_MS);
    }
  }, [clearTimer]);

  return { state, open, close, reset, change, submit };
}
