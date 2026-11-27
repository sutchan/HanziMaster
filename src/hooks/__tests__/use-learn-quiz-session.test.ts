// src/hooks/__tests__/use-learn-quiz-session.test.ts v5.3.0
// OPT-18：重进后结果复位 + 自动关闭计时器清理（提前关闭 / 卸载均不留残留）。
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_LEARN_QUIZ } from '@/components/pages/quiz-session';
import { useLearnQuizSession } from '../use-learn-quiz-session';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('OPT-18 学习页测验会话', () => {
  it('答对后 1500ms 自动关闭并清空答案与结果', () => {
    const { result } = renderHook(() => useLearnQuizSession());
    act(() => result.current.open());
    act(() => result.current.change('dà'));
    act(() => result.current.submit(true));
    expect(result.current.state).toEqual({ open: true, answer: 'dà', correct: true });

    act(() => vi.advanceTimersByTime(1500));
    expect(result.current.state).toEqual(INITIAL_LEARN_QUIZ);
  });

  it('提前关闭清理计时器，重进后不会残留旧结果或延迟复位', () => {
    const { result } = renderHook(() => useLearnQuizSession());
    act(() => result.current.open());
    act(() => result.current.change('dà'));
    act(() => result.current.submit(true));
    act(() => result.current.close());

    act(() => vi.advanceTimersByTime(2000));
    expect(result.current.state).toEqual(INITIAL_LEARN_QUIZ);

    act(() => result.current.open());
    expect(result.current.state).toEqual({ ...INITIAL_LEARN_QUIZ, open: true });
    act(() => vi.advanceTimersByTime(2000));
    // 若旧计时器未清理，这里会被 autoClose 改回 closed
    expect(result.current.state).toEqual({ ...INITIAL_LEARN_QUIZ, open: true });
  });

  it('卸载时清理计时器', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { result, unmount } = renderHook(() => useLearnQuizSession());
    act(() => result.current.open());
    act(() => result.current.change('dà'));
    act(() => result.current.submit(true));
    const before = clearSpy.mock.calls.length;
    unmount();
    expect(clearSpy.mock.calls.length).toBeGreaterThan(before);
    act(() => vi.advanceTimersByTime(2000));
    clearSpy.mockRestore();
  });
});
