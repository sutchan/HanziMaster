// src/components/practice/__tests__/writing-canvas-animation-cache.test.ts v5.3.0
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createAnimationPaintCache,
  disposeAnimationCache,
  getThemeVersion,
  invalidateAnimationCache,
} from '../writing-canvas-animation-cache';
import { runStrokeAnimation } from '../writing-canvas-animation';

const tokens: Record<string, string> = {
  '--color-foreground': '#111111',
  '--font-serif': 'Noto Serif SC',
  '--color-primary': '#abcdef',
};

let tokenReads = 0;
let pathBuilds = 0;

class FakePath2D {
  constructor(public d: string) {
    pathBuilds += 1;
  }
}

function makeCtx() {
  return {
    lineWidth: 0,
    lineCap: '',
    lineJoin: '',
    strokeStyle: '',
    fillStyle: '',
    font: '',
    globalAlpha: 1,
    textAlign: '',
    textBaseline: '',
    setTransform: vi.fn(),
    scale: vi.fn(),
    translate: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
  };
}

const input = {
  character: '永',
  strokePaths: ['M0 0 L10 10'],
  completed: new Set([0]),
  width: 200,
  height: 200,
};

beforeEach(() => {
  tokenReads = 0;
  pathBuilds = 0;
  disposeAnimationCache();
  vi.stubGlobal('Path2D', FakePath2D);
  vi.stubGlobal('getComputedStyle', vi.fn(() => ({
    getPropertyValue: (key: string) => {
      tokenReads += 1;
      return tokens[key] ?? '';
    },
  })));
});

afterEach(() => {
  disposeAnimationCache();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('createAnimationPaintCache', () => {
  it('命中时不重复解析路径或读取颜色 token', () => {
    const cache = createAnimationPaintCache(input);
    const first = cache.read();
    expect(first.completedPaths).toHaveLength(1);
    expect(first.primary).toBe('#abcdef');
    const version = getThemeVersion();
    for (let i = 0; i < 5; i++) expect(cache.read()).toBe(first);
    expect(pathBuilds).toBe(1);
    expect(tokenReads).toBe(3);
    expect(getThemeVersion()).toBe(version);
  });

  it('主题变化失效后重建，且新旧缓存对象不同', () => {
    const cache = createAnimationPaintCache(input);
    const first = cache.read();
    invalidateAnimationCache();
    const second = cache.read();
    expect(second).not.toBe(first);
    expect(pathBuilds).toBe(2);
    expect(tokenReads).toBe(6);
  });

  it('输入（已完成集合）变化时失效', () => {
    const cache = createAnimationPaintCache(input);
    cache.read();
    const next = createAnimationPaintCache({
      ...input,
      strokePaths: [...input.strokePaths, 'M2 2 L3 3'],
      completed: new Set([0, 1]),
    });
    expect(next.read().completedPaths).toHaveLength(2);
    expect(pathBuilds).toBe(3);
  });
});

describe('runStrokeAnimation 帧内开销', () => {
  it('多帧只做一次准备：不逐帧 parsePath/读 CSS 变量/读 rect', () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    const ctx = makeCtx();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctx as unknown as CanvasRenderingContext2D
    );
    const canvas = document.createElement('canvas');
    const rectSpy = vi.spyOn(canvas, 'getBoundingClientRect');
    const onComplete = vi.fn();
    const start = performance.now();
    const handle = runStrokeAnimation({
      canvas,
      character: '永',
      median: [
        [0, 500],
        [1000, 500],
      ],
      size: 200,
      rect: { width: 200, height: 200 },
      completed: new Set([0]),
      strokePaths: ['M0 0 L10 10'],
      onComplete,
    });
    expect(frames).toHaveLength(1);
    frames.shift()?.(start);
    frames.shift()?.(start + 250);
    frames.shift()?.(start + 1000);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(pathBuilds).toBe(1);
    expect(tokenReads).toBe(3);
    expect(rectSpy).not.toHaveBeenCalled();
    expect(ctx.fill).toHaveBeenCalledTimes(3);
    handle.cancel();
  });

  it('动画中途主题变化会让下一帧重新读取缓存 token', () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    const ctx = makeCtx();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctx as unknown as CanvasRenderingContext2D
    );
    runStrokeAnimation({
      canvas: document.createElement('canvas'),
      character: '一',
      median: [],
      size: 100,
      completed: new Set<number>(),
      strokePaths: [],
      onComplete: () => {},
    });
    frames.shift()?.(0);
    expect(tokenReads).toBe(3);
    invalidateAnimationCache();
    frames.shift()?.(250);
    expect(tokenReads).toBe(6);
  });
});
