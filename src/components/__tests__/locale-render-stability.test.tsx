// src/components/__tests__/locale-render-stability.test.tsx v5.3.0
// OPT-06：语言状态与翻译通道分离；词典到达只重渲染翻译订阅者，t 引用保持稳定。
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { translations } from '@/lib/i18n';
import type { Translate } from '@/components/locale-contexts';
import { LocaleProvider, useLocale, useLocaleState, useTranslation } from '../locale-provider';

vi.mock('@/lib/i18n/load-translations', async () => {
  const { translations: all } = await import('@/lib/i18n');
  // 按 locale 返回对应词典，避免测试空字符串译文时被固定 ja 覆盖。
  return { loadTranslations: vi.fn((locale: keyof typeof all) => Promise.resolve(all[locale] ?? all.en)) };
});

const stateRenders: number[] = [];
const translationRenders: number[] = [];
let latestT: Translate | null = null;

function LocaleStateProbe() {
  stateRenders.push(stateRenders.length + 1);
  const { locale, setLocale } = useLocaleState();
  return (
    <div>
      <span data-testid="state-locale">{locale}</span>
      <button type="button" onClick={() => setLocale('ja')}>ja</button>
    </div>
  );
}

function TranslationProbe() {
  translationRenders.push(translationRenders.length + 1);
  const { t } = useTranslation();
  latestT = t;
  return <span data-testid="translated">{t('legal.privacyTitle')}</span>;
}

function EmptyTranslationProbe() {
  const { t } = useTranslation();
  return <span data-testid="empty-translation">{t('home.heroSuffix')}</span>;
}

function ApiShapeProbe() {
  const localeApi = useLocale();
  const { t } = useTranslation();
  return (
    <span data-testid="api-shape">
      {[localeApi.locale, typeof localeApi.setLocale, localeApi.availableLocales.length, localeApi.t === t].join('|')}
    </span>
  );
}

beforeEach(() => {
  stateRenders.length = 0;
  translationRenders.length = 0;
  latestT = null;
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
});

describe('OPT-06 上下文拆分', () => {
  it('词典异步到达时不重渲染只订阅语言状态的组件，且 t 引用不变', async () => {
    render(
      <LocaleProvider defaultLocale="en">
        <LocaleStateProbe />
        <TranslationProbe />
      </LocaleProvider>
    );
    const tBeforeLoad = latestT;
    const stateBeforeSwitch = stateRenders.length;
    await userEvent.click(screen.getByRole('button', { name: 'ja' }));
    await waitFor(() => expect(screen.getByTestId('translated')).toHaveTextContent(translations.ja.legal.privacyTitle));

    // 语言切换只让状态订阅者多渲染一次；词典到达不再触发状态订阅者
    expect(stateRenders.length).toBe(stateBeforeSwitch + 1);
    // 翻译订阅者跟随词典更新，且 t 保持同一引用（memo 依赖不失效）
    expect(translationRenders.length).toBeGreaterThan(1);
    expect(latestT).toBe(tBeforeLoad);
    expect(latestT!('legal.privacyTitle')).toBe(translations.ja.legal.privacyTitle);
  });

  it('合法空字符串译文保持为空，不回退显示键名', async () => {
    render(
      <LocaleProvider defaultLocale="zh-CN">
        <EmptyTranslationProbe />
      </LocaleProvider>,
    );
    // 初始词典为英文兜底，等待目标 locale 异步到达后再断言。
    await waitFor(() => expect(screen.getByTestId('empty-translation')).toBeEmptyDOMElement());
  });

  it('useLocale / useTranslation 公开 API 形状保持不变', () => {
    render(
      <LocaleProvider defaultLocale="en">
        <ApiShapeProbe />
      </LocaleProvider>
    );
    expect(screen.getByTestId('api-shape')).toHaveTextContent('en|function|11|true');
  });
}, 20000);
