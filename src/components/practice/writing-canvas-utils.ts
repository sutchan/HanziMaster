// src/components/practice/writing-canvas-utils.ts v5.2.61
// 书写画布的绘制工具函数集：设计 token 读取、坐标变换、淡字底图与中位线绘制。
// 描红贴合度判定见 writing-canvas-scoring.ts（单一职责拆分，保证单文件 ≤200 行）。

// 从设计 token 读取前景色与衬线字体
export const resolveFg = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--color-foreground').trim() || '#1a1a1a';
export const resolveSerif = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--font-serif').trim() || 'serif';
// 品牌朱砂红（作为当前笔高亮色）
export const resolvePrimary = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#c53d43';

// 坐标系约定：笔顺数据为 Hanzi Writer 格式——1024×1024 网格、y 轴向上、字形以 y=900 为顶基线。
// 画布映射：x → (x/1024)*size；y → ((900 - y)/1024)*size（垂直翻转，修正笔顺上下颠倒）。
// 归一化 x：把数据网格 x 缩放到画布实际尺寸
export function scale(v: number, size: number) {
  return (v / 1024) * size;
}

// 翻转并缩放 y：数据 y 轴向上 → 画布 y 轴向下
export function scaleY(v: number, size: number) {
  return ((900 - v) / 1024) * size;
}

// 解析 SVG path 字符串为 Path2D（浏览器原生支持），解析失败返回 null
export function parsePath(d: string): Path2D | null {
  try {
    return new Path2D(d);
  } catch {
    return null;
  }
}

/** 同步 backing store 到当前 rect × DPR；返回尺寸是否变化（变化会清空画布内容）。 */
export const syncCanvasSize = (canvas: HTMLCanvasElement): boolean => {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.round(rect.width * dpr);
  const height = Math.round(rect.height * dpr);
  if (canvas.width === width && canvas.height === height) return false;
  canvas.width = width;
  canvas.height = height;
  return true;
};

/** 淡字底图的预计算输入：宽高与颜色 token 在准备阶段取一次，帧内复用。 */
export interface HintPaint {
  width: number;
  height: number;
  fg: string;
  serif: string;
}

/** 用缓存的尺寸/颜色绘制淡字底图；不读取 rect 与 CSS 变量，供动画帧复用。 */
export function drawPreparedHint(canvas: HTMLCanvasElement, character: string, paint: HintPaint) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  // 与 syncCanvasSize 同口径，但尺寸来自缓存，避免动画帧内读取 rect
  const width = Math.round(paint.width * dpr);
  const height = Math.round(paint.height * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = paint.fg;
  ctx.font = `${Math.min(paint.width, paint.height) * 0.4}px ${paint.serif}`;
  ctx.fillStyle = paint.fg;
  ctx.globalAlpha = 0.08;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(character, paint.width / 2, paint.height / 2);
  ctx.globalAlpha = 1;
}

// 淡字底图绘制（通用入口）：现取 rect/token 后委托给缓存版本，保持原有公开行为
export const drawHint = (canvas: HTMLCanvasElement, character: string) => {
  const rect = canvas.getBoundingClientRect();
  drawPreparedHint(canvas, character, {
    width: rect.width,
    height: rect.height,
    fg: resolveFg(),
    serif: resolveSerif(),
  });
};

/** 尺寸变化后重放已完成的指针笔迹；点位为 CSS 像素，与 pointerMove 记录时同坐标系。 */
export const redrawUserStrokes = (
  canvas: HTMLCanvasElement,
  traces: { x: number; y: number }[][],
) => {
  if (traces.length === 0) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.strokeStyle = resolveFg();
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const points of traces) {
    if (points.length < 2) continue;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
  }
};

// 沿中位线绘制一笔：从 start 到 end 按 progress(0-1) 逐点描线
export const drawMedianStroke = (
  ctx: CanvasRenderingContext2D,
  medians: number[][],
  size: number,
  progress: number,
  color: string,
  lineWidth: number,
) => {
  if (medians.length < 2) return;
  const total = medians.length - 1;
  const seg = Math.min(Math.max(progress, 0), 1) * total;
  const idx = Math.floor(seg);
  const t = seg - idx;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(scale(medians[0][0], size), scaleY(medians[0][1], size));
  for (let i = 1; i <= idx; i++) {
    ctx.lineTo(scale(medians[i][0], size), scaleY(medians[i][1], size));
  }
  if (idx < total) {
    const a = medians[idx];
    const b = medians[idx + 1];
    ctx.lineTo(
      scale(a[0] + (b[0] - a[0]) * t, size),
      scaleY(a[1] + (b[1] - a[1]) * t, size)
    );
  }
  ctx.stroke();
};
