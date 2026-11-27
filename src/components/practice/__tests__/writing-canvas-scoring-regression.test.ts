// src/components/practice/__tests__/writing-canvas-scoring-regression.test.ts v5.3.0
import { afterEach, describe, expect, it, vi } from 'vitest';
import { scale, scaleY } from '../writing-canvas-utils';
import { judgeUserStroke, scoreStroke } from '../writing-canvas-scoring';
import { prepareMedian, scanMedian } from '../writing-canvas-projection';

type Pt = { x: number; y: number };

// 以下为重构前的参考实现，仅用于数值回归对照（不导出、不参与生产代码）
const legacyDist = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};

const legacyPts = (median: number[][], size: number) =>
  median.map(([x, y]) => ({ x: scale(x, size), y: scaleY(y, size) }));

const legacyScore = (points: Pt[], median: number[][], size: number, tol = 18) => {
  if (!points.length) return 0;
  const pts = legacyPts(median, size);
  let hit = 0;
  for (const p of points) {
    let min = Infinity;
    for (let i = 0; i < pts.length - 1; i++) {
      min = Math.min(min, legacyDist(p.x, p.y, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y));
    }
    if (min <= tol) hit++;
  }
  return hit / points.length;
};

const legacyProject = (p: Pt, pts: Pt[]) => {
  let best = { along: 0, dist: Infinity };
  let along = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) continue;
    const raw = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (len * len);
    const t = Math.max(0, Math.min(1, raw));
    const d = Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
    if (d < best.dist) best = { along: along + t * len, dist: d };
    along += len;
  }
  return best.along;
};

const legacyCoverage = (points: Pt[], median: number[][], size: number) => {
  const pts = legacyPts(median, size);
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) total += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
  if (total === 0 || points.length < 2) return 0.5;
  let traveled = 0;
  let prev = legacyProject(points[0], pts);
  for (let i = 1; i < points.length; i++) {
    const cur = legacyProject(points[i], pts);
    const delta = cur - prev;
    traveled += delta >= 0 ? delta : delta * 0.5;
    prev = cur;
  }
  return 0.5 + 0.5 * Math.min(Math.max(traveled / total, 0), 1);
};

const medians = [
  [
    [0, 500],
    [1000, 500],
  ],
  [
    [100, 700],
    [400, 200],
    [900, 600],
  ],
  [
    [200, 300],
    [200, 300],
    [800, 300],
  ],
];

const traces: Pt[][] = [
  [],
  [{ x: 20, y: 78 }],
  [
    { x: 10, y: 78 },
    { x: 100, y: 78 },
    { x: 190, y: 78 },
  ],
  [
    { x: 190, y: 120 },
    { x: 90, y: 60 },
    { x: 5, y: 90 },
  ],
];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('OPT-05 数值回归', () => {
  it('中位线回退评分与旧实现逐例一致', () => {
    for (const median of medians) {
      for (const points of traces) {
        expect(scoreStroke(points, undefined, median, 200)).toBeCloseTo(legacyScore(points, median, 200), 12);
      }
    }
  });

  it('一次扫描同时给出 dist/along，数值与旧投影一致', () => {
    const median = medians[1];
    const prepared = prepareMedian(median, 200);
    const scans = scanMedian(traces[3], prepared);
    const pts = legacyPts(median, 200);
    scans.forEach((s, i) => {
      expect(s.along).toBeCloseTo(legacyProject(traces[3][i], pts), 10);
      let min = Infinity;
      for (let j = 0; j < pts.length - 1; j++) {
        min = Math.min(min, legacyDist(traces[3][i].x, traces[3][i].y, pts[j].x, pts[j].y, pts[j + 1].x, pts[j + 1].y));
      }
      expect(s.dist).toBeCloseTo(min, 10);
    });
  });

  it('方向修正后的 judgeUserStroke 与旧公式一致', () => {
    for (const median of medians) {
      for (const points of traces) {
        if (!points.length) continue;
        const actual = judgeUserStroke({
          userPoints: points,
          strokePath: undefined,
          median,
          size: 200,
          prevAccuracies: [],
          enforceDirection: true,
        })[0];
        const expected = legacyScore(points, median, 200) * legacyCoverage(points, median, 200);
        expect(actual).toBeCloseTo(expected, 10);
      }
    }
  });

  it('多次评分只创建一个离屏 canvas', () => {
    class FakePath2D {
      constructor(public d: string) {}
    }
    vi.stubGlobal('Path2D', FakePath2D);
    const probe = { lineWidth: 0, isPointInStroke: vi.fn(() => true) };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      probe as unknown as CanvasRenderingContext2D
    );
    const create = vi.spyOn(document, 'createElement');
    for (let i = 0; i < 4; i++) expect(scoreStroke([{ x: 1, y: 1 }], 'M0 0 L1 1', undefined, 200)).toBe(1);
    expect(create.mock.calls.filter(([tag]) => tag === 'canvas')).toHaveLength(1);
    expect(probe.isPointInStroke).toHaveBeenCalledTimes(4);
  });
});
