// src/components/pages/stroke-order-static.tsx v5.2.61
// OPT-15：RSC 静态首帧——笔顺数据构建期内联，服务端直接输出完整字形 SVG，无 JS 依赖。
import { strokeOrderData } from '@/lib/stroke-order-data';

interface StrokeOrderStaticProps {
  character: string;
  label: string;
}

export function StrokeOrderStatic({ character, label }: StrokeOrderStaticProps) {
  const strokes = strokeOrderData[character]?.strokes ?? [];
  return (
    <div id="stroke-order-first-frame" className="relative aspect-square w-full max-w-[220px] border border-vermilion-200/80 bg-card dark:border-vermilion-800/70 dark:bg-ink-900/40">
      <svg
        id="stroke-order-static-svg"
        viewBox="0 0 1024 1024"
        className="h-full w-full"
        role="img"
        aria-label={`${character} ${label}`}
      >
        <path
          d="M512 0V1024 M0 512H1024"
          fill="none"
          stroke="var(--color-vermilion-400)"
          strokeWidth="2"
          strokeDasharray="16 16"
          opacity="0.3"
        />
        {/* 与 stroke-order-demo 同一坐标系：scale(1,-1) translate(0,-900) */}
        <g transform="scale(1, -1) translate(0, -900)">
          {strokes.map((d, i) => (
            <path
              key={i}
              data-stroke={i + 1}
              d={d}
              fill="var(--color-ink-300)"
              opacity="0.45"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
