// src/components/__tests__/cloud-sync-controls.test.tsx v5.3.0
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '@/components/locale-provider';
import { ToastProvider } from '@/components/toast';
import { CloudSyncControls } from '@/components/cloud-sync-controls';
import { translations } from '@/lib/i18n';
import { SYNC_CODE_STORAGE_KEY } from '@/lib/cloud-sync';
import { PROGRESS_STORAGE_KEY } from '@/hooks/use-progress';

const en = translations.en;
const CODE = 'a'.repeat(32);

/** jsdom 未实现 execCommand，测试中显式提供可 spy 的桩。 */
const setExecCommand = (result: boolean) => {
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: vi.fn(() => result),
  });
};

const renderControls = () => render(
  <LocaleProvider defaultLocale="en">
    <ToastProvider>
      <CloudSyncControls />
    </ToastProvider>
  </LocaleProvider>,
);

beforeAll(() => {
  // Radix Portal 在 jsdom 下探测 ResizeObserver
  if (!('ResizeObserver' in globalThis)) {
    class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperty(globalThis, 'ResizeObserver', { value: MockResizeObserver, configurable: true });
  }
});

beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.setItem(SYNC_CODE_STORAGE_KEY, JSON.stringify({ _v: 1, _d: CODE }));
  window.history.replaceState(null, '', '/');
  document.cookie = 'hanzi-master-locale=; max-age=0; path=/';
  vi.restoreAllMocks();
});

describe('cloud sync controls', () => {
  it('复制失败时提示用户并高亮同步码', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText } satisfies Pick<Clipboard, 'writeText'>,
    });
    setExecCommand(false);

    renderControls();
    const input = screen.getByLabelText(en.cloud.code);
    await userEvent.click(screen.getByRole('button', { name: en.cloud.copy }));

    expect(await screen.findByRole('alert')).toHaveTextContent(en.cloud.copyFailed);
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    expect(input).toHaveClass('ring-vermilion-500/30');
    expect(writeText).toHaveBeenCalledWith(CODE);
  }, 20000);

  it('替换同步码改用受控确认弹窗，取消不覆盖旧码', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderControls();

    await userEvent.click(screen.getByRole('button', { name: en.cloud.generate }));
    const dialog = await screen.findByRole('alertdialog');
    expect(dialog).toHaveTextContent(en.cloud.confirmTitle);
    expect(confirmSpy).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: en.common.cancel }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    const stored = JSON.parse(window.localStorage.getItem(SYNC_CODE_STORAGE_KEY) ?? '{}') as { _d?: unknown };
    expect(stored._d).toBe(CODE);
  }, 20000);

  it('确认后生成新码并使用剪贴板复制', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText } satisfies Pick<Clipboard, 'writeText'>,
    });
    renderControls();

    await userEvent.click(screen.getByRole('button', { name: en.cloud.generate }));
    await userEvent.click(await screen.findByRole('button', { name: en.cloud.confirmOk }));

    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem(SYNC_CODE_STORAGE_KEY) ?? '{}') as { _d?: unknown };
      expect(stored._d).not.toBe(CODE);
      expect(stored._d).toMatch(/^[0-9a-f]{32}$/);
    });
    expect(writeText).toHaveBeenCalled();
  }, 20000);

  it('按服务端 error code 显示对应 i18n 文案', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: () => Promise.resolve({ error: 'not_configured', message: 'ignored' }),
    }));
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
      _v: 1,
      _d: { learnedCharIds: [1], quizResults: [], dailyActivity: {} },
    }));
    renderControls();

    fireEvent.click(screen.getByRole('button', { name: en.cloud.upload }));
    expect(await screen.findByRole('alert')).toHaveTextContent(en.cloud.errors.notConfigured);
  }, 20000);
});
