// src/lib/__tests__/api-errors.test.ts v5.3.0
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SYNC_ERROR_CODES, SYNC_ERRORS, isSyncErrorCode } from '@/lib/api-errors';
import { translations, type Locale } from '@/lib/i18n';
import { getNestedValue } from '@/lib/i18n/translate';

const sourceOf = (relative: string): string =>
  readFileSync(new URL(relative, import.meta.url), 'utf8');

/** 从路由/服务端源码实际调用的 reject/fail 中提取错误码，避免映射表与实现脱节。 */
const emittedCodes = (): Set<string> => {
  const sources = [
    sourceOf('../../app/api/progress/route.ts'),
    sourceOf('../cloud-sync-server.ts'),
  ];
  const codes = new Set<string>();
  for (const source of sources) {
    for (const match of source.matchAll(/\b(?:reject|fail)\('([a-z_]+)'/g)) codes.add(match[1]);
  }
  return codes;
};

describe('api-errors 单一来源', () => {
  it('所有服务端码都有状态与消息键映射', () => {
    const emitted = emittedCodes();
    expect(emitted.size).toBeGreaterThan(8);
    for (const code of emitted) {
      expect(isSyncErrorCode(code), `未映射的服务端错误码: ${code}`).toBe(true);
      const entry = SYNC_ERRORS[code as keyof typeof SYNC_ERRORS];
      expect(entry.status).toBeGreaterThanOrEqual(400);
      expect(entry.fallbackMessage).toBeTruthy();
    }
  });

  it('码清单与映射表严格一致，未接受非法码', () => {
    expect([...SYNC_ERROR_CODES].sort()).toEqual(Object.keys(SYNC_ERRORS).sort());
    expect(isSyncErrorCode('__proto__')).toBe(false);
    expect(isSyncErrorCode('unknown')).toBe(false);
  });

  it('每个消息键在 11 语言中均有实际文案', () => {
    const locales = Object.keys(translations) as Locale[];
    expect(locales).toHaveLength(11);
    for (const code of SYNC_ERROR_CODES) {
      const key = SYNC_ERRORS[code].messageKey;
      for (const locale of locales) {
        const value = getNestedValue(translations[locale], key);
        expect(value, `${locale}.${key}`).not.toBe(key);
        expect(value.length).toBeGreaterThan(0);
      }
    }
  });
});
