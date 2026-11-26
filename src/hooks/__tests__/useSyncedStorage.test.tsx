// src/hooks/__tests__/useSyncedStorage.test.tsx v5.2.61
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { PROGRESS_IMPORTED_EVENT } from '@/hooks/use-progress';
import { normalizeSettings, DEFAULT_SETTINGS, type AppSettings } from '@/lib/settings';
import { trySetItem } from '@/lib/storage';
import {
  APP_SYNC_EVENTS,
  STORAGE_SYNC_EVENT,
  SYNCED_KEYS,
  useSyncedStorage,
} from '@/hooks/useSyncedStorage';

beforeEach(() => {
  window.localStorage.clear();
});

const settingsOptions = { validate: normalizeSettings, events: APP_SYNC_EVENTS };

describe('useSyncedStorage', () => {
  it('双实例通过同页广播事件即时同步', async () => {
    const first = renderHook(() => useSyncedStorage<AppSettings>(SYNCED_KEYS.settings, DEFAULT_SETTINGS, settingsOptions));
    const second = renderHook(() => useSyncedStorage<AppSettings>(SYNCED_KEYS.settings, DEFAULT_SETTINGS, settingsOptions));
    await waitFor(() => {
      expect(first.result.current.revision).toBe(1);
      expect(second.result.current.revision).toBe(1);
    });

    const next: AppSettings = { haptics: false, reduceMotion: true };
    act(() => {
      expect(first.result.current.setValue(next)).toBe(true);
    });

    expect(second.result.current.value).toEqual(next);
    expect(second.result.current.revision).toBe(2);
    expect(JSON.parse(window.localStorage.getItem(SYNCED_KEYS.settings)!)).toEqual({ _v: 1, _d: next });
  });

  it('跨标签 storage 事件刷新所有实例', async () => {
    const first = renderHook(() => useSyncedStorage<ThemeValue>(SYNCED_KEYS.theme, 'system'));
    const second = renderHook(() => useSyncedStorage<ThemeValue>(SYNCED_KEYS.theme, 'system'));
    await waitFor(() => expect(second.result.current.revision).toBe(1));

    act(() => {
      trySetItem(SYNCED_KEYS.theme, 'dark');
      window.dispatchEvent(new StorageEvent('storage', { key: SYNCED_KEYS.theme }));
    });

    expect(first.result.current.value).toBe('dark');
    expect(second.result.current.value).toBe('dark');
  });

  it('已有自定义事件（进度导入）也触发刷新', async () => {
    const { result } = renderHook(() =>
      useSyncedStorage<AppSettings>(SYNCED_KEYS.settings, DEFAULT_SETTINGS, settingsOptions),
    );
    await waitFor(() => expect(result.current.revision).toBe(1));
    const imported: AppSettings = { haptics: false, reduceMotion: false };

    act(() => {
      trySetItem(SYNCED_KEYS.settings, imported);
      window.dispatchEvent(new Event(PROGRESS_IMPORTED_EVENT));
    });

    expect(result.current.value).toEqual(imported);
  });

  it('设置/主题/语言/同步码四类状态都能双实例同步', async () => {
    const check = async <T,>(key: string, fallback: T, next: T) => {
      const first = renderHook(() => useSyncedStorage<T>(key, fallback));
      const second = renderHook(() => useSyncedStorage<T>(key, fallback));
      await waitFor(() => expect(second.result.current.revision).toBe(1));
      act(() => {
        first.result.current.setValue(next);
      });
      expect(second.result.current.value).toEqual(next);
      first.unmount();
      second.unmount();
    };

    await check(SYNCED_KEYS.settings, DEFAULT_SETTINGS, { haptics: false, reduceMotion: true });
    await check(SYNCED_KEYS.theme, 'light', 'dark');
    await check(SYNCED_KEYS.locale, 'en', 'ja');
    await check(SYNCED_KEYS.syncCode, '0'.repeat(32), 'a'.repeat(32));
  });

  it('非法存量数据回退默认值，且在写入失败时不广播假成功', async () => {
    window.localStorage.setItem(SYNCED_KEYS.settings, JSON.stringify({ _v: 1, _d: 'broken' }));
    const { result } = renderHook(() => useSyncedStorage<AppSettings>(SYNCED_KEYS.settings, DEFAULT_SETTINGS, settingsOptions));
    await waitFor(() => expect(result.current.value).toEqual(DEFAULT_SETTINGS));

    const original = window.localStorage.setItem;
    window.localStorage.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    try {
      act(() => {
        expect(result.current.setValue({ haptics: false, reduceMotion: false })).toBe(false);
      });
    } finally {
      window.localStorage.setItem = original;
    }
    expect(result.current.value).toEqual(DEFAULT_SETTINGS);
  });

  it('广播事件携带键名，非目标实例不刷新', async () => {
    const other = renderHook(() => useSyncedStorage<string>(SYNCED_KEYS.theme, 'system'));
    await waitFor(() => expect(other.result.current.revision).toBe(1));
    act(() => {
      window.dispatchEvent(new CustomEvent(STORAGE_SYNC_EVENT, { detail: { key: SYNCED_KEYS.locale } }));
    });
    expect(other.result.current.revision).toBe(1);
  });
});

type ThemeValue = 'light' | 'dark' | 'system';
