// src/components/practice/writing-canvas-projection.ts v5.2.61
// 中位线投影扫描：一次遍历同时得到「到折线最短距离」与「沿折线累计弧长」，
// 供贴合度命中判定与方向覆盖判定共用，避免同一批点对折线做多轮投影。

import { scale, scaleY } from './writing-canvas-utils';

export interface CanvasPoint {
  x: number;
  y: number;
}

export interface Projection {
  /** 最近投影点沿折线的累计弧长 */
  along: number;
  /** 到折线的最短距离 */
  dist: number;
}

export interface PreparedMedian {
  pts: CanvasPoint[];
  total: number;
}

/** 准备阶段把数据坐标中位线缩放为画布坐标，并预计算折线总长。 */
export function prepareMedian(median: number[][], size: number): PreparedMedian {
  const pts = median.map(([x, y]) => ({ x: scale(x, size), y: scaleY(y, size) }));
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    total += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
  }
  return { pts, total };
}

/** 一次遍历扫描全部用户点：dist 供贴合度使用，along 供方向/覆盖使用。 */
export function scanMedian(points: CanvasPoint[], prepared: PreparedMedian): Projection[] {
  const { pts } = prepared;
  return points.map((p) => {
    // along 只在非退化段上选最近投影（与旧 projectOnMedian 一致）；
    // dist 统计所有段（与旧 distToSegment 回退一致），两者在同一循环中得出。
    let bestAlong = 0;
    let bestAlongDist = Infinity;
    let bestDist = Infinity;
    let along = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      if (len === 0) {
        // 退化段按端点距离处理，与 distToSegment 的旧口径一致
        const d = Math.hypot(p.x - a.x, p.y - a.y);
        if (d < bestDist) bestDist = d;
        continue;
      }
      const raw = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (len * len);
      const t = Math.max(0, Math.min(1, raw));
      const d = Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
      if (d < bestAlongDist) {
        bestAlongDist = d;
        bestAlong = along + t * len;
      }
      if (d < bestDist) bestDist = d;
      along += len;
    }
    return { along: bestAlong, dist: bestDist };
  });
}

/** 方向/覆盖因子：直接消费已扫描的 along 序列，不再对用户点重复投影。 */
export function directionCoverage(scans: Projection[], total: number): number {
  if (total === 0 || scans.length < 2) return 0.5;
  let traveled = 0;
  let prev = scans[0].along;
  for (let i = 1; i < scans.length; i++) {
    const delta = scans[i].along - prev;
    // 反向移动倒扣，完整正向描完才得满分
    traveled += delta >= 0 ? delta : delta * 0.5;
    prev = scans[i].along;
  }
  return 0.5 + 0.5 * Math.min(Math.max(traveled / total, 0), 1);
}
