// src/components/practice/writing-canvas-animation-cache.ts v5.3.0
// 书写引导动画的帧缓存：准备阶段一次性解析 Path2D、读取颜色 token 与画布尺寸；主题变化后自动失效重建。

import {
  parsePath,
  resolveFg,
  resolvePrimary,
  resolveSerif,
  type HintPaint,
} from './writing-canvas-utils';

export interface AnimationPaint extends HintPaint {
  /** 已完成笔画的轮廓路径，下标与 strokePaths 对齐；解析失败为 null。 */
  completedPaths: (Path2D | null)[];
  /** 当前笔高亮色（主题 token）。 */
  primary: string;
  /** 画布实际边长 min(width, height)，与调用方传入的 size 一致。 */
  size: number;
}

export interface AnimationPaintInput {
  character: string;
  strokePaths: string[];
  completed: Set<number>;
  width: number;
  height: number;
}

export interface AnimationPaintCache {
  /** 读取当前缓存；命中时不解析路径、不读 CSS 变量、不读 rect。 */
  read: () => AnimationPaint;
}

let themeVersion = 0;
let observer: MutationObserver | null = null;
let mediaQuery: MediaQueryList | null = null;

const bumpVersion = () => {
  themeVersion += 1;
};

/** 监听 <html> 的 class/style 与系统配色变化，主题切换时让缓存失效。 */
const ensureThemeObserver = () => {
  if (observer || typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
  observer = new MutationObserver(bumpVersion);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style', 'data-theme'],
  });
  if (typeof window !== 'undefined' && window.matchMedia) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener?.('change', bumpVersion);
  }
};

export const getThemeVersion = () => themeVersion;

/** 显式失效（测试或外部主题切换使用），下一次 read 会重建全部缓存项。 */
export const invalidateAnimationCache = () => {
  bumpVersion();
};

/** 释放模块级监听，避免测试间相互干扰；不提升版本号。 */
export const disposeAnimationCache = () => {
  observer?.disconnect();
  observer = null;
  if (mediaQuery) mediaQuery.removeEventListener?.('change', bumpVersion);
  mediaQuery = null;
};

const buildPaint = (input: AnimationPaintInput): AnimationPaint => {
  const fg = resolveFg();
  return {
    width: input.width,
    height: input.height,
    fg,
    serif: resolveSerif(),
    primary: resolvePrimary(),
    size: Math.min(input.width, input.height),
    completedPaths: [...input.completed].map((i) => {
      const d = input.strokePaths[i];
      return d === undefined ? null : parsePath(d);
    }),
  };
};

/** 创建一次动画的缓存句柄：缓存归句柄所有，多个动画并行时不会互相覆盖。 */
export function createAnimationPaintCache(input: AnimationPaintInput): AnimationPaintCache {
  ensureThemeObserver();
  // 缓存条目按输入签名与主题版本号双重校验；completed 是活引用，集合变化也能触发重建。
  const signature = () =>
    JSON.stringify([
      input.character,
      input.width,
      input.height,
      input.strokePaths,
      [...input.completed].sort((a, b) => a - b),
    ]);
  let entry: { key: string; version: number; paint: AnimationPaint } | null = null;
  return {
    read: () => {
      const current = getThemeVersion();
      const key = signature();
      if (entry && entry.key === key && entry.version === current) return entry.paint;
      const paint = buildPaint(input);
      entry = { key, version: current, paint };
      return paint;
    },
  };
}
