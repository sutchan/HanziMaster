// src/components/practice/__tests__/writing-canvas-input-decimation.test.ts v5.2.61
import type { PointerEvent as ReactPointerEvent } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { pointerDown, pointerMove, type WritingInputCtx } from '../writing-canvas-input';

const event = (x: number, y: number): ReactPointerEvent<HTMLCanvasElement> =>
  ({
    isPrimary: true,
    button: 0,
    pointerId: 1,
    clientX: x,
    clientY: y,
  }) as unknown as ReactPointerEvent<HTMLCanvasElement>;

function makeCtx(): { ctx: WritingInputCtx; ctx2d: { lineTo: ReturnType<typeof vi.fn>; stroke: ReturnType<typeof vi.fn> } } {
  const ctx2d = {
    lineTo: vi.fn(),
    stroke: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    setTransform: vi.fn(),
    scale: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    fill: vi.fn(),
    lineWidth: 0,
    lineCap: '',
    lineJoin: '',
    strokeStyle: '',
    fillStyle: '',
    font: '',
    globalAlpha: 1,
    textAlign: '',
    textBaseline: '',
  };
  const canvas = document.createElement('canvas');
  vi.spyOn(canvas, 'getContext').mockReturnValue(ctx2d as unknown as CanvasRenderingContext2D);
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0 } as DOMRect);
  // pointerDown 会调用 syncCanvasSize（读 rect），以上桩已覆盖
  const ctx: WritingInputCtx = {
    canvas,
    character: '永',
    strokePaths: ['M0 0 L1 1'],
    medians: [[[0, 500], [1000, 500]]],
    isDrawing: { current: false },
    pointerId: { current: null },
    userPoints: { current: [] },
    traces: { current: [] },
    accuracy: { current: [] },
    completed: { current: new Set<number>() },
    tracing: { current: 0 },
    animHandle: { current: null },
    animStroke: { current: -1 },
    onAccuracyChange: undefined,
    resetRefs: vi.fn(),
  };
  return { ctx, ctx2d };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('pointerMove 最小间距抽稀', () => {
  it('小于 2px 的移动不落点，达到阈值才记录', () => {
    const { ctx, ctx2d } = makeCtx();
    pointerDown(ctx, event(10, 10));
    expect(ctx.userPoints.current).toEqual([{ x: 10, y: 10 }]);
    pointerMove(ctx, event(11, 10));
    pointerMove(ctx, event(11.5, 10));
    expect(ctx2d.lineTo).not.toHaveBeenCalled();
    expect(ctx.userPoints.current).toHaveLength(1);
    pointerMove(ctx, event(13, 10));
    expect(ctx2d.lineTo).toHaveBeenCalledWith(13, 10);
    expect(ctx.userPoints.current).toEqual([
      { x: 10, y: 10 },
      { x: 13, y: 10 },
    ]);
  });

  it('抬笔后重新落笔会从新起点重新计距', () => {
    const { ctx } = makeCtx();
    pointerDown(ctx, event(20, 20));
    pointerMove(ctx, event(30, 20));
    expect(ctx.userPoints.current).toHaveLength(2);
    // 直接重置绘制状态模拟下一笔（pointerUp 的完整判定路径不在本用例范围）
    ctx.isDrawing.current = false;
    ctx.pointerId.current = null;
    ctx.tracing.current = 0;
    // 新起点 10 与旧末点 30 相距很远：若 lastPoints 未重置，下面的 11 会被误记为有效点
    pointerDown(ctx, event(10, 20));
    pointerMove(ctx, event(11, 20));
    expect(ctx.userPoints.current).toEqual([{ x: 10, y: 20 }]);
    pointerMove(ctx, event(13, 20));
    expect(ctx.userPoints.current).toEqual([
      { x: 10, y: 20 },
      { x: 13, y: 20 },
    ]);
  });
});
