// src/lib/__tests__/migrations.test.ts v5.3.0
import { beforeEach, describe, expect, it } from 'vitest';
import { clearMigrations, registerMigration } from '@/lib/migrations';
import { readWithMigration, safeGetItem, STORAGE_VERSION } from '@/lib/storage';

const raw = (key: string): string | null => window.localStorage.getItem(key);

beforeEach(() => {
  window.localStorage.clear();
  clearMigrations();
});

describe('版本化存储迁移', () => {
  it('损坏 JSON 回退默认值且不覆盖原始值', () => {
    window.localStorage.setItem('broken', '{not json');
    expect(safeGetItem('broken', 7)).toBe(7);
    expect(raw('broken')).toBe('{not json');
  });

  it('无迁移的版本差异保持原有回退行为和原始数据', () => {
    window.localStorage.setItem('old', JSON.stringify({ _v: 0, _d: 99 }));
    expect(safeGetItem('old', 7)).toBe(7);
    expect(raw('old')).toBe(JSON.stringify({ _v: 0, _d: 99 }));
  });

  it('v0 → v1 逐级升级并回写，safeGetItem 可直接读到新数据', () => {
    registerMigration('progress', {
      from: 0,
      to: 1,
      transform: (data) => ({ ...(data as object), haptics: true }),
    });
    window.localStorage.setItem('progress', JSON.stringify({ _v: 0, _d: { count: 3 } }));

    expect(safeGetItem<{ count: number; haptics: boolean }>('progress', { count: 0, haptics: false })).toEqual({
      count: 3,
      haptics: true,
    });
    expect(JSON.parse(raw('progress')!)).toEqual({
      _v: STORAGE_VERSION,
      _d: { count: 3, haptics: true },
    });
  });

  it('v0 → v1 → v2 按链升级，目标版本由调用方指定', () => {
    registerMigration('settings', {
      from: 0,
      to: 1,
      transform: (data) => ({ ...(data as object), step: 1 }),
    });
    registerMigration('settings', {
      from: 1,
      to: 2,
      transform: (data) => ({ ...(data as object), step: 2 }),
    });
    window.localStorage.setItem('settings', JSON.stringify({ _v: 0, _d: { base: true } }));

    expect(readWithMigration('settings', { base: false, step: 0 }, 2)).toEqual({
      base: true,
      step: 2,
    });
    expect(JSON.parse(raw('settings')!)).toEqual({
      _v: 2,
      _d: { base: true, step: 2 },
    });
  });

  it('迁移函数抛错时回退默认值并保留原始记录', () => {
    registerMigration('code', {
      from: 0,
      to: 1,
      transform: () => {
        throw new Error('bad shape');
      },
    });
    const original = JSON.stringify({ _v: 0, _d: { code: 'legacy' } });
    window.localStorage.setItem('code', original);

    expect(safeGetItem('code', { code: 'default' })).toEqual({ code: 'default' });
    expect(raw('code')).toBe(original);
  });

  it('缺少中间步骤或形成环时不覆盖原始数据', () => {
    const original = JSON.stringify({ _v: 0, _d: { n: 1 } });
    window.localStorage.setItem('missing-step', original);
    window.localStorage.setItem('loop', original);
    registerMigration('missing-step', { from: 0, to: 1, transform: (data) => data });
    registerMigration('loop', { from: 0, to: 1, transform: (data) => data });
    registerMigration('loop', { from: 1, to: 0, transform: (data) => data });

    expect(readWithMigration('missing-step', { n: 0 }, 2)).toEqual({ n: 0 });
    expect(readWithMigration('loop', { n: 0 }, 2)).toEqual({ n: 0 });
    expect(raw('missing-step')).toBe(original);
    expect(raw('loop')).toBe(original);
  });

  it('不同键的迁移互不污染', () => {
    registerMigration('a', { from: 0, to: 1, transform: () => 'from-a' });
    window.localStorage.setItem('a', JSON.stringify({ _v: 0, _d: 'old' }));
    window.localStorage.setItem('b', JSON.stringify({ _v: 0, _d: 'old' }));

    expect(safeGetItem('a', 'default')).toBe('from-a');
    expect(safeGetItem('b', 'default')).toBe('default');
  });
});
