// src/components/__tests__/rtl-direction.test.tsx v5.2.61
// OPT-13：RTL 下方向键步进与 toast 退场方向随 computed direction 翻转。
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getArrowStep, getDirectionDelta } from '@/lib/direction';
import { LocaleProvider } from '../locale-provider';
import { ThemeProvider } from '../theme-provider';
import { SettingsButton } from '../settings-dialog';
import { ToastProvider, useToast } from '../toast';

type ToastApi = ReturnType<typeof useToast>;
let emit: ToastApi | null = null;

function ToastHarness() {
  emit = useToast();
  return null;
}

function renderToast() {
  return render(
    <LocaleProvider><ToastProvider><ToastHarness /></ToastProvider></LocaleProvider>
  );
}

function renderSettings() {
  return render(
    <ThemeProvider>
      <LocaleProvider>
        <ToastProvider><SettingsButton /></ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({
      matches: false, media: query, onchange: null,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
    }),
  });
  document.documentElement.dir = 'ltr';
});

afterEach(() => {
  document.documentElement.dir = 'ltr';
  vi.useRealTimers();
});

describe('OPT-13 方向工具', () => {
  it('LTR 前进为 +1，RTL 前进为 -1', () => {
    const node = document.createElement('div');
    document.body.appendChild(node);
    expect(getDirectionDelta(node)).toBe(1);
    expect(getArrowStep('ArrowRight', node)).toBe(1);
    expect(getArrowStep('ArrowLeft', node)).toBe(-1);

    document.documentElement.dir = 'rtl';
    expect(getDirectionDelta(node)).toBe(-1);
    expect(getArrowStep('ArrowRight', node)).toBe(-1);
    expect(getArrowStep('ArrowLeft', node)).toBe(1);
    expect(getArrowStep('Enter', node)).toBe(0);
    node.remove();
  });
// 全量并行运行本机 I/O 开销大，统一放宽超时避免假红（与 settings-dialog.test 同口径）
}, 20000);

describe('OPT-13 toast 退场动画', () => {
  it('RTL 下向左滑出，LTR 下向右滑出', () => {
    vi.useFakeTimers();
    renderToast();
    // LocaleProvider 挂载会按当前语言重置 dir，需在挂载后再切 RTL
    document.documentElement.dir = 'rtl';
    act(() => emit!.info('rtl-toast', 10));
    act(() => vi.advanceTimersByTime(11));

    const item = screen.getByText('rtl-toast').closest('[role="status"]') as HTMLElement;
    expect(item.classList.contains('-translate-x-full')).toBe(true);
    expect(item.classList.contains('translate-x-full')).toBe(false);
  });

  it('LTR 下向右滑出', () => {
    vi.useFakeTimers();
    renderToast();
    act(() => emit!.info('ltr-toast', 10));
    act(() => vi.advanceTimersByTime(11));

    const item = screen.getByText('ltr-toast').closest('[role="status"]') as HTMLElement;
    expect(item.classList.contains('translate-x-full')).toBe(true);
    expect(item.classList.contains('-translate-x-full')).toBe(false);
  });
}, 20000);

describe('OPT-13 设置面板方向键', () => {
  it('RTL 下 ArrowLeft 按视觉顺序前进一项', async () => {
    const user = userEvent.setup();
    renderSettings();
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    document.documentElement.dir = 'rtl';

    const radios = screen.getAllByRole('radio');
    const initial = radios.findIndex((r) => r.getAttribute('aria-checked') === 'true');
    fireEvent.keyDown(radios[initial], { key: 'ArrowLeft' });
    expect(radios[(initial + 1) % radios.length]).toHaveAttribute('aria-checked', 'true');
  });
}, 20000);
