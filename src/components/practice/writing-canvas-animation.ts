// src/components/practice/writing-canvas-animation.ts v5.3.0
// 书写引导动画：沿当前笔画中位线逐帧描线，已完成的笔画以浅色填充字形呈现。
// 抽离自 writing-canvas.tsx，使组件文件 ≤200 行（单一职责：动画播放）。
// OPT-04：路径/颜色/尺寸在准备阶段缓存，帧内只读取缓存。

import { drawMedianStroke, drawPreparedHint, scale } from './writing-canvas-utils';
import { createAnimationPaintCache } from './writing-canvas-animation-cache';

export interface StrokeAnimationHandle {
  cancel: () => void;
}

export interface StrokeAnimationOptions {
  canvas: HTMLCanvasElement;
  character: string;
  /** 当前笔画的中位线（笔顺方向），用于沿线路径描线 */
  median: number[][];
  /** 画布实际边长（min(width, height)），用于坐标缩放；未提供 rect 时作为正方形边长 */
  size: number;
  /** 准备阶段读取的画布 rect；提供后帧内无需再次读取 rect */
  rect?: { width: number; height: number };
  /** 已完成笔画下标集合，渲染为浅色虚线轮廓 */
  completed: Set<number>;
  /** 全部笔画的 SVG path（有序），用于绘制已完成笔画轮廓 */
  strokePaths: string[];
  /** 动画完成回调（单笔播放结束） */
  onComplete: () => void;
}

// 触发当前笔画的引导动画（沿中位线描线，duration≈500ms）
export function runStrokeAnimation(opts: StrokeAnimationOptions): StrokeAnimationHandle {
  const { canvas, character, median, size, completed, strokePaths, onComplete } = opts;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { cancel: () => {} };
  // 准备阶段：解析路径与主题 token 一次，帧内只读缓存（主题变化由缓存句柄失效重建）
  const rect = opts.rect ?? { width: size, height: size };
  const paintCache = createAnimationPaintCache({ character, strokePaths, completed, ...rect });
  const start = performance.now();
  const dur = 500;
  let raf: number | null = null;

  const frame = (now: number) => {
    const progress = Math.min((now - start) / dur, 1);
    const paint = paintCache.read();
    drawPreparedHint(canvas, character, paint);
    // 已完成笔：切换到数据坐标系（x 缩放、y 翻转 + 900 基线）后填充缓存的轮廓
    paint.completedPaths.forEach((p) => {
      if (!p) return;
      ctx.save();
      ctx.translate(0, scale(900, paint.size));
      ctx.scale(paint.size / 1024, -paint.size / 1024);
      ctx.fillStyle = paint.fg;
      ctx.globalAlpha = 0.15;
      ctx.fill(p);
      ctx.restore();
    });
    // 当前笔：沿中位线动画描线
    if (median && median.length >= 2) {
      drawMedianStroke(ctx, median, paint.size, progress, paint.primary, 5);
    }
    if (progress < 1) {
      raf = requestAnimationFrame(frame);
    } else {
      raf = null;
      onComplete();
    }
  };

  raf = requestAnimationFrame(frame);
  return {
    cancel: () => {
      if (raf !== null) cancelAnimationFrame(raf);
    },
  };
}

/** 播放下一笔引导动画；全部播完或正在播放时忽略（从 writing-canvas.tsx 抽出，P2 行数门禁）。 */
export function startNextStroke(params: {
  canvas: HTMLCanvasElement;
  character: string;
  strokePaths: string[];
  medians?: number[][][];
  completed: Set<number>;
  animHandleRef: { current: StrokeAnimationHandle | null };
  animStrokeRef: { current: number };
  /** 引导播放完成后回调（此时笔尚未跟写，不能计入 completed） */
  onGuidanceReady?: (index: number) => void;
}): void {
  const { canvas, character, strokePaths, medians, completed, animHandleRef, animStrokeRef, onGuidanceReady } = params;
  const next = completed.size;
  if (next >= strokePaths.length || animHandleRef.current) return;
  animStrokeRef.current = next;
  const rect = canvas.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height);
  animHandleRef.current = runStrokeAnimation({
    canvas,
    character,
    median: medians?.[next] ?? [],
    size,
    // 复用已读取的 rect，避免动画帧内重复 getBoundingClientRect
    rect: { width: rect.width, height: rect.height },
    completed,
    strokePaths,
    onComplete: () => {
      // completed 表示「已跟写完成」，引导播放完只标记可跟写，由调用方在判定后加入
      animStrokeRef.current = -1;
      animHandleRef.current = null;
      onGuidanceReady?.(next);
    },
  });
}
