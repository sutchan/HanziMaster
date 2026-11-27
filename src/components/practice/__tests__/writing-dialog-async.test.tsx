// src/components/practice/__tests__/writing-dialog-async.test.tsx v5.3.0
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LocaleProvider } from '@/components/locale-provider';
import type { CharacterQuiz } from '../practice-assets';
import { WritingDialog } from '../writing-dialog';

const { loadMock } = vi.hoisted(() => ({ loadMock: vi.fn() }));
vi.mock('@/lib/stroke-order-loader', () => ({ loadStrokeOrder: loadMock }));

const quizChar: CharacterQuiz = {
  id: 1,
  hanzi: '一',
  pinyin: 'yī',
  translationKey: 'learn.one',
  meaningKey: 'practice.meanings.one',
};

const strokeData = { strokes: ['M0 0 L10 10'], medians: [[[0, 500], [1000, 500]]] };

beforeAll(() => {
  if (!('ResizeObserver' in globalThis)) {
    class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperty(globalThis, 'ResizeObserver', {
      value: MockResizeObserver,
      configurable: true,
    });
  }
});

beforeEach(() => {
  loadMock.mockReset();
});

const renderDialog = () =>
  render(
    <LocaleProvider defaultLocale="en">
      <WritingDialog open onOpenChange={vi.fn()} character={quizChar} strokeCount={1} onNext={vi.fn()} />
    </LocaleProvider>
  );

describe('WritingDialog 异步笔顺数据', () => {
  it('加载中展示骨架，成功后展示画布', async () => {
    let resolveLoad: ((value: typeof strokeData) => void) | undefined;
    const pending = new Promise<typeof strokeData>((resolve) => {
      resolveLoad = resolve;
    });
    loadMock.mockReturnValueOnce(pending);
    renderDialog();
    const skeleton = document.getElementById('writing-stroke-skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('role', 'status');
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(document.getElementById('writing-canvas')).toBeNull();
    await act(async () => {
      resolveLoad?.(strokeData);
    });
    await waitFor(() => expect(document.getElementById('writing-canvas')).toBeInTheDocument());
    expect(document.getElementById('writing-stroke-skeleton')).toBeNull();
  });

  it('失败后复用 ErrorState，点击重试成功则渲染画布', async () => {
    loadMock
      .mockRejectedValueOnce(new Error('chunk failed'))
      .mockResolvedValueOnce(strokeData);
    renderDialog();
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Something went wrong');
    expect(document.getElementById('writing-stroke-skeleton')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(document.getElementById('writing-canvas')).toBeInTheDocument());
    expect(document.getElementById('writing-stroke-error')).toBeNull();
    expect(loadMock).toHaveBeenCalledTimes(2);
  });
});
