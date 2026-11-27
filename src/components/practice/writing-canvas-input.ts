// src/components/practice/writing-canvas-input.ts v5.3.0
// 书写画布指针交互：笔顺引导与跟写交替、指针身份过滤与 DPR/尺寸同步（单一职责拆分，保证组件 ≤200 行）。

import type { PointerEvent as ReactPointerEvent } from 'react';
import type { StrokeAnimationHandle } from './writing-canvas-animation';
import { startNextStroke } from './writing-canvas-animation';
import { judgeUserStroke } from './writing-canvas-scoring';
import { drawHint, syncCanvasSize } from './writing-canvas-utils';

export interface WritingInputCtx {
  canvas: HTMLCanvasElement | null;
  character: string;
  strokePaths?: string[];
  medians?: number[][][];
  isDrawing: { current: boolean };
  pointerId: { current: number | null };
  userPoints: { current: { x: number; y: number }[] };
  /** 已完成笔画的轨迹快照，供画布尺寸变化后重放，避免视觉墨迹丢失。 */
  traces: { current: { x: number; y: number }[][] };
  accuracy: { current: number[] };
  completed: { current: Set<number> };
  tracing: { current: number | null };
  animHandle: { current: StrokeAnimationHandle | null };
  animStroke: { current: number };
  onAccuracyChange?: (avg: number) => void;
  resetRefs: () => void;
}

/** pointerMove 最小抽稀间距（CSS 像素）：低于此距离的移动不落点，降低轨迹密度与后续评分开销。 */
const MIN_POINT_DISTANCE = 2;
/** 按画布记录上一落点：inputContext 每次事件重建，不能挂在 ctx 对象上。 */
const lastPoints = new WeakMap<HTMLCanvasElement, { x: number; y: number }>();

const getPoint = (ctx: WritingInputCtx, e: ReactPointerEvent<HTMLCanvasElement>) => {
  const rect = ctx.canvas?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0 };
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};

const startStroke = (ctx: WritingInputCtx, e: ReactPointerEvent<HTMLCanvasElement>) => {
  ctx.isDrawing.current = true;
  const p = getPoint(ctx, e);
  ctx.userPoints.current = [p];
  if (ctx.canvas) lastPoints.set(ctx.canvas, p);
  const strokeCtx = ctx.canvas?.getContext('2d');
  strokeCtx?.beginPath();
  strokeCtx?.moveTo(p.x, p.y);
};

/** 播放下一笔引导；播完后只标记可跟写，跟写判定后才计入 completed。 */
export const playNextStroke = (ctx: WritingInputCtx) => {
  if (!ctx.canvas || !ctx.strokePaths) return;
  startNextStroke({
    canvas: ctx.canvas,
    character: ctx.character,
    strokePaths: ctx.strokePaths,
    medians: ctx.medians,
    completed: ctx.completed.current,
    animHandleRef: ctx.animHandle,
    animStrokeRef: ctx.animStroke,
    onGuidanceReady: (index) => { ctx.tracing.current = index; },
  });
};

export const pointerDown = (ctx: WritingInputCtx, e: ReactPointerEvent<HTMLCanvasElement>) => {
  // 只接受主键/触摸主指针：多指同时落下会互相覆盖同一条轨迹
  if (!e.isPrimary || e.button !== 0 || !ctx.canvas) return;
  // 容器尺寸变化（旋转/响应式）后重设 backing store 并重绘，避免坐标与墨迹错位
  if (syncCanvasSize(ctx.canvas)) drawHint(ctx.canvas, ctx.character);
  ctx.pointerId.current = e.pointerId;
  if (ctx.strokePaths) {
    if (ctx.completed.current.size >= ctx.strokePaths.length && ctx.animStroke.current === -1) {
      ctx.resetRefs();
      drawHint(ctx.canvas, ctx.character);
      ctx.pointerId.current = null;
      return;
    }
    if (ctx.animStroke.current !== -1) return;
    if (ctx.tracing.current === null) {
      playNextStroke(ctx);
      return;
    }
  }
  startStroke(ctx, e);
};

export const pointerMove = (ctx: WritingInputCtx, e: ReactPointerEvent<HTMLCanvasElement>) => {
  if (!ctx.isDrawing.current || e.pointerId !== ctx.pointerId.current) return;
  const strokeCtx = ctx.canvas?.getContext('2d');
  if (!strokeCtx) return;
  const p = getPoint(ctx, e);
  const last = ctx.canvas ? lastPoints.get(ctx.canvas) : undefined;
  // 抽稀：与上一记录点过近时既不落笔也不记点，保持绘制与评分轨迹一致
  if (last && Math.hypot(p.x - last.x, p.y - last.y) < MIN_POINT_DISTANCE) return;
  strokeCtx.lineTo(p.x, p.y);
  strokeCtx.stroke();
  if (ctx.canvas) lastPoints.set(ctx.canvas, p);
  if (ctx.strokePaths) ctx.userPoints.current.push(p);
};

export const pointerUp = (ctx: WritingInputCtx, e: ReactPointerEvent<HTMLCanvasElement>) => {
  if (e.pointerId !== ctx.pointerId.current) return;
  ctx.pointerId.current = null;
  if (!ctx.isDrawing.current) return;
  ctx.isDrawing.current = false;
  if (!ctx.strokePaths || ctx.userPoints.current.length === 0 || ctx.tracing.current === null) return;
  const current = ctx.tracing.current;
  if (ctx.canvas && ctx.strokePaths[current]) {
    const rect = ctx.canvas.getBoundingClientRect();
    ctx.accuracy.current = judgeUserStroke({
      userPoints: ctx.userPoints.current,
      strokePath: ctx.strokePaths[current],
      median: ctx.medians?.[current],
      size: Math.min(rect.width, rect.height),
      prevAccuracies: ctx.accuracy.current,
      onAccuracyChange: ctx.onAccuracyChange,
      enforceDirection: true,
    });
  }
  ctx.completed.current.add(current);
  ctx.traces.current.push([...ctx.userPoints.current]);
  ctx.tracing.current = null;
  ctx.userPoints.current = [];
  playNextStroke(ctx);
};
