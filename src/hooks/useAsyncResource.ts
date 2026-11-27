// src/hooks/useAsyncResource.ts v5.3.0
// 统一异步资源状态：{data, loading, error, retry}。按 key 重新加载，支持失败后手动重试与过期结果丢弃。

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncResource<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  /** 重新执行 loader；与 key 无关，失败后可直接调用 */
  retry: () => void;
}

const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(String(value));

/**
 * @param loader 资源加载函数；用 ref 持有，函数身份变化不会触发重载
 * @param key 资源标识（字符、URL 等），变化即重新加载
 * @param enabled 为 false 时清空状态且不发起请求（如弹窗未打开）
 */
export function useAsyncResource<T>(loader: () => Promise<T>, key: string, enabled = true): AsyncResource<T> {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const [attempt, setAttempt] = useState(0);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const retry = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    // active 标记丢弃 key 切换/卸载后到达的旧请求结果，避免跨资源状态污染
    let active = true;
    setData(null);
    setError(null);
    setLoading(true);
    Promise.resolve()
      .then(() => loaderRef.current())
      .then((value) => {
        if (!active) return;
        setData(value);
        setLoading(false);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(toError(reason));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [key, enabled, attempt]);

  return { data, loading, error, retry };
}
