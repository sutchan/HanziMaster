// src/hooks/__tests__/use-pronunciation.test.tsx v5.2.58
import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { usePronunciation } from '../use-pronunciation';

describe('usePronunciation', () => {
  it('should start idle', () => {
    const { result } = renderHook(() => usePronunciation());
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.pronounceError).toBe(false);
  });

  it('should set pronounceError when speech synthesis is unavailable', () => {
    // jsdom 未实现 speechSynthesis，覆盖降级错误路径
    const { result } = renderHook(() => usePronunciation());
    act(() => result.current.speak('汉'));
    expect(result.current.pronounceError).toBe(true);
    expect(result.current.isSpeaking).toBe(false);
  });

  it('should resolve speechSupported to false after mount when the API is absent', () => {
    // renderHook 同步 flush effects；jsdom 无 speechSynthesis，挂载后应落为 false（P2-16）
    const { result } = renderHook(() => usePronunciation());
    expect(result.current.speechSupported).toBe(false);
  });

  afterEach(() => {
    Reflect.deleteProperty(window, 'speechSynthesis');
  });

  it('ignores callbacks from a cancelled utterance and normal cancellations', () => {
    const instances: MockUtterance[] = [];
    class MockUtterance {
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: ((event?: { error?: string }) => void) | null = null;
      lang = '';
      rate = 1;
      pitch = 1;
      constructor(public text: string) {
        instances.push(this);
      }
    }
    const original = globalThis.SpeechSynthesisUtterance;
    Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', { value: MockUtterance, configurable: true });
    Object.defineProperty(window, 'speechSynthesis', {
      value: { cancel: vi.fn(), speak: vi.fn() },
      configurable: true,
    });

    try {
      const { result } = renderHook(() => usePronunciation());
      act(() => result.current.speak('汉'));
      act(() => result.current.speak('字'));
      expect(instances).toHaveLength(2);

      // 旧发音被 cancel 后的异步回调不得改变新发音的状态
      act(() => {
        instances[0].onstart?.();
        instances[0].onend?.();
      });
      expect(result.current.isSpeaking).toBe(false);

      act(() => instances[1].onstart?.());
      expect(result.current.isSpeaking).toBe(true);
      act(() => instances[1].onerror?.({ error: 'canceled' }));
      expect(result.current.isSpeaking).toBe(false);
      expect(result.current.pronounceError).toBe(false);
    } finally {
      if (original) Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', { value: original, configurable: true });
      else Reflect.deleteProperty(globalThis, 'SpeechSynthesisUtterance');
    }
  });
});
