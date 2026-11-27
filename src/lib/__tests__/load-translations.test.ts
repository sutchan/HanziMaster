// src/lib/__tests__/load-translations.test.ts v5.3.0
import { afterEach, describe, expect, it, vi } from 'vitest';
import { locales, translations, type Locale } from '@/lib/i18n';
import { baseLoaders, extensionLoaders, loadTranslations } from '@/lib/i18n/load-translations';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadTranslations', () => {
  it('只加载目标 locale 的基础词典与扩展片段', async () => {
    const extSpies = Object.fromEntries(
      locales.map((locale) => [locale, vi.spyOn(extensionLoaders, locale)]),
    ) as Record<Locale, ReturnType<typeof vi.spyOn>>;
    const baseSpies = Object.fromEntries(
      locales.map((locale) => [locale, vi.spyOn(baseLoaders, locale)]),
    ) as Record<Locale, ReturnType<typeof vi.spyOn>>;

    const loaded = await loadTranslations('ja');

    expect(extSpies.ja).toHaveBeenCalledTimes(1);
    expect(baseSpies.ja).toHaveBeenCalledTimes(1);
    for (const locale of locales) {
      if (locale === 'ja') continue;
      // 每个 loader 内部只 import 一个 locale chunk；其余 loader 不应被调用
      expect(extSpies[locale], `extension ${locale}`).not.toHaveBeenCalled();
      expect(baseSpies[locale], `base ${locale}`).not.toHaveBeenCalled();
    }
    expect(loaded).toEqual(translations.ja);
  });
});
