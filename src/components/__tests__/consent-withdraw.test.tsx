// src/components/__tests__/consent-withdraw.test.tsx v5.3.0
// OPT-17：同意撤回后 GA 脚本卸载，后续路由切换不再向 dataLayer 推送任何指令/event。
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../locale-provider';
import { ToastProvider } from '../toast';

const { navigation } = vi.hoisted(() => ({ navigation: { path: '/' } }));

vi.mock('next/navigation', () => ({ usePathname: () => navigation.path }));

vi.mock('next/script', async () => {
  const React = await import('react');
  return {
    default: ({ id, src, onLoad, children }: {
      id: string;
      src?: string;
      onLoad?: () => void;
      children?: React.ReactNode;
    }) => {
      const loaded = React.useRef(false);
      React.useEffect(() => {
        if (loaded.current) return;
        loaded.current = true;
        onLoad?.();
      }, [onLoad]);
      // 用 template 代替真实 script，避免 React 客户端渲染 script 的告警
      return React.createElement('template', { id, 'data-src': src }, children);
    },
  };
});

vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-OPT17');
vi.stubEnv('NODE_ENV', 'production');
const { GoogleAnalytics } = await import('../google-analytics');
const { ConsentBanner } = await import('../consent-banner');
const { PrivacyControls } = await import('../privacy-controls');
const { getConsent } = await import('@/lib/consent');

type GaArgs = [name: string, ...rest: unknown[]];
let layer: GaArgs[];

function App({ privacyKey = 0 }: { privacyKey?: number }) {
  return (
    <LocaleProvider defaultLocale="en">
      <ToastProvider>
        <GoogleAnalytics />
        <ConsentBanner />
        {/* 同意态变更后重建隐私面板，模拟用户重新打开设置时读取最新状态 */}
        <PrivacyControls key={privacyKey} />
      </ToastProvider>
    </LocaleProvider>
  );
}

const events = () => layer.filter((entry) => entry[0] === 'event');
const isPageView = (entry: GaArgs, path: string): boolean =>
  entry[0] === 'event' && entry[1] === 'page_view' &&
  (entry[2] as { page_path?: string } | undefined)?.page_path === path;

beforeEach(() => {
  window.localStorage.clear();
  navigation.path = '/';
  layer = [];
  Object.defineProperty(window, 'dataLayer', { configurable: true, writable: true, value: layer });
  Object.defineProperty(window, 'gtag', {
    configurable: true,
    writable: true,
    value: (...args: GaArgs) => { layer.push(args); },
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  window.localStorage.clear();
});

describe('OPT-17 同意撤回', () => {
  it('撤回后路由切换不产生新的 dataLayer event', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<App />);

    // 横幅同意 → GA 脚本挂载；SPA 切换应补发一次 page_view
    await user.click(document.getElementById('consent-accept') as HTMLElement);
    expect(getConsent()).toBe('granted');
    expect(document.getElementById('google-analytics-lib')).toBeTruthy();
    navigation.path = '/learn';
    rerender(<App privacyKey={1} />);
    await waitFor(() => expect(layer.some((entry) => isPageView(entry, '/learn'))).toBe(true));

    // 设置面板撤回：写回 null + 广播同意变更 + gtag consent update（仅此一条指令）
    await user.click(document.getElementById('settings-consent-toggle') as HTMLElement);
    expect(getConsent()).toBeNull();
    const layerAtWithdraw = layer.length;
    const eventsAtWithdraw = events().length;
    expect(document.getElementById('google-analytics-lib')).toBeNull();

    // 撤回后再次 SPA 切换：dataLayer 既不新增 event，也不新增任何指令
    navigation.path = '/practice';
    rerender(<App privacyKey={1} />);
    await waitFor(() => expect(document.getElementById('consent-banner')).toBeTruthy());
    expect(layer.length).toBe(layerAtWithdraw);
    expect(events().length).toBe(eventsAtWithdraw);
  });
// 全量并行运行本机 I/O 开销大，放宽至 20s 避免假红
}, 20000);
