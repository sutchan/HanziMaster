// src/components/pages/stroke-order-hero.tsx v5.3.0
// OPT-15：首帧由 RSC 静态 SVG 直出；动画逻辑只在用户点击播放后动态加载。
'use client';

import { lazy, Suspense, useState } from 'react';
import { useTranslation } from '@/components/locale-provider';
import { StrokeOrderStatic } from '@/components/pages/stroke-order-static';

const StrokeOrderDemo = lazy(() =>
  import('@/components/learn/stroke-order-demo').then((m) => ({ default: m.StrokeOrderDemo }))
);

interface StrokeOrderHeroProps {
  character: string;
  strokeCount: number;
}

export function StrokeOrderHero({ character, strokeCount }: StrokeOrderHeroProps) {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);
  const label = t('learn.strokeDemoLabel');

  if (playing) {
    return (
      <div id="stroke-order-hero" className="w-full">
        <Suspense fallback={<StrokeOrderStatic character={character} label={label} />}>
          <StrokeOrderDemo character={character} strokeCount={strokeCount} />
        </Suspense>
      </div>
    );
  }

  return (
    <div id="stroke-order-hero" className="flex w-full flex-col items-center gap-4">
      <StrokeOrderStatic character={character} label={label} />
      <button
        id="stroke-hero-play"
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={t('learn.showStrokeOrder')}
        className="touch-target rounded-full bg-vermilion-500 px-5 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-vermilion-600"
      >
        {t('learn.showStrokeOrder')}
      </button>
    </div>
  );
}
