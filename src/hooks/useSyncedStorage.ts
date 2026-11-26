// src/hooks/useSyncedStorage.ts v5.2.61
// OPT-08：统一订阅 storage 与同页自定义事件，让设置/主题/语言/同步码多实例保持一致。
'use client';

import { useCallback, useEffect, useState } from 'react';
import { PROGRESS_IMPORTED_EVENT } from '@/hooks/use-progress';
import { CONSENT_CHANGE_EVENT } from '@/lib/consent';
import { SYNC_CODE_STORAGE_KEY } from '@/lib/cloud-sync';
import { SETTINGS_STORAGE_KEY } from '@/lib/settings';
import { safeGetItem, trySetItem } from '@/lib/storage';

/** 同页写入广播：storage 事件只跨标签页触发，本 hook 的 setValue 会同时派发它。 */
export const STORAGE_SYNC_EVENT = 'hanzi-master:storage-sync';

/** 四类需要跨标签/跨实例同步的状态键；theme/locale 与现有 Provider 的默认键一致。 */
export const SYNCED_KEYS = {
  settings: SETTINGS_STORAGE_KEY,
  theme: 'hanzi-master-theme',
  locale: 'hanzi-master-locale',
  syncCode: SYNC_CODE_STORAGE_KEY,
} as const;

/** 已有自定义事件：导入进度、统计同意变更后同样需要刷新相关状态。 */
export const APP_SYNC_EVENTS = [PROGRESS_IMPORTED_EVENT, CONSENT_CHANGE_EVENT] as const;

export interface SyncedStorageOptions<T> {
  /** 校验存量数据；返回 undefined 表示非法值，回退到 fallback。 */
  validate?: (value: unknown) => T | undefined;
  /** 除 STORAGE_SYNC_EVENT 外需要监听的同页事件名。 */
  events?: readonly string[];
}

export interface SyncedStorageState<T> {
  value: T;
  /** 写入成功返回 true，并广播给同页其它实例；存储不可用时返回 false。 */
  setValue: (value: T) => boolean;
  /** 从 localStorage 重新读取一次。 */
  refresh: () => void;
  /** 刷新计数，便于只关心「发生变化」的订阅方。 */
  revision: number;
}

const readValue = <T,>(key: string, fallback: T, validate?: (value: unknown) => T | undefined): T => {
  const raw = safeGetItem<unknown>(key, fallback);
  const parsed = validate ? validate(raw) : (raw as T);
  return parsed === undefined ? fallback : parsed;
};

/** 供未使用本 hook 的写入方（主题/语言组件）广播，避免两处状态分叉。 */
export function broadcastStorageSync(key: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(STORAGE_SYNC_EVENT, { detail: { key } }));
}

/**
 * 单个 localStorage 键的同步状态：挂载时读取；storage / 自定义事件触发时刷新。
 * 首帧统一返回 fallback，保证 SSR 与客户端 hydration 一致。
 */
export function useSyncedStorage<T>(
  key: string,
  fallback: T,
  options: SyncedStorageOptions<T> = {},
): SyncedStorageState<T> {
  const { validate, events = [] } = options;
  const eventsKey = events.join('|');
  const [value, setValueState] = useState<T>(fallback);
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => {
    setValueState(readValue(key, fallback, validate));
    setRevision((prev) => prev + 1);
  }, [key, fallback, validate]);

  useEffect(() => {
    refresh();
    const onStorage = (event: StorageEvent) => {
      // key 为 null 表示其它文档清空了整个 localStorage
      if (event.key === key || event.key === null) refresh();
    };
    const onSync = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string }>).detail;
      if (!detail || typeof detail !== 'object' || detail.key === key) refresh();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(STORAGE_SYNC_EVENT, onSync);
    for (const name of eventsKey ? eventsKey.split('|') : []) window.addEventListener(name, refresh);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(STORAGE_SYNC_EVENT, onSync);
      for (const name of eventsKey ? eventsKey.split('|') : []) window.removeEventListener(name, refresh);
    };
  }, [key, refresh, eventsKey]);

  const setValue = useCallback(
    (next: T) => {
      if (!trySetItem(key, next)) return false;
      setValueState(next);
      broadcastStorageSync(key);
      return true;
    },
    [key],
  );

  return { value, setValue, refresh, revision };
}
