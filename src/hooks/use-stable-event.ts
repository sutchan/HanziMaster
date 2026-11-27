// src/hooks/use-stable-event.ts v5.3.0
'use client';

import { useCallback, useRef } from 'react';

/**
 * useEvent 的稳定引用实现（OPT-06）：返回的函数引用恒定，内部始终调用最新闭包。
 * 用于翻译函数：词典异步切换时 t 不变，避免依赖 t 的 memo 子树失效。
 */
export function useStableEvent<A extends unknown[], R>(callback: (...args: A) => R): (...args: A) => R {
  const callbackRef = useRef(callback);
  // 渲染期同步最新闭包：词典到位后下一次 t() 调用立即读到新词典
  callbackRef.current = callback;
  return useCallback((...args: A) => callbackRef.current(...args), []);
}
