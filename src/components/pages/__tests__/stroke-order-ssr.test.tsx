// src/components/pages/__tests__/stroke-order-ssr.test.tsx v5.3.0
// OPT-15：SSR 首帧断言——字形路径静态直出，动画组件不在首屏 HTML 中。
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { strokeOrderData } from '@/lib/stroke-order-data';
import { LocaleProvider } from '@/components/locale-provider';
import { StrokeOrderHero } from '../stroke-order-hero';
import { StrokeOrderStatic } from '../stroke-order-static';

describe('OPT-15 首页笔顺首帧', () => {
  it('静态首帧内联真实笔顺数据并输出完整 SVG', () => {
    const html = renderToStaticMarkup(<StrokeOrderStatic character="大" label="Stroke outline" />);
    expect(html).toContain('id="stroke-order-first-frame"');
    expect(html).toContain('id="stroke-order-static-svg"');
    expect(html).toContain(`d="${strokeOrderData['大'].strokes[0]}"`);
    expect((html.match(/data-stroke=/g) ?? []).length).toBe(strokeOrderData['大'].strokes.length);
  });

  it('Hero 首屏 HTML 含静态字形与播放按钮，但不含动画组件', () => {
    const html = renderToStaticMarkup(
      <LocaleProvider defaultLocale="en">
        <StrokeOrderHero character="大" strokeCount={3} />
      </LocaleProvider>
    );
    expect(html).toContain('id="stroke-order-hero"');
    expect(html).toContain('stroke-order-static-svg');
    expect(html).toContain('id="stroke-hero-play"');
    expect(html).not.toContain('stroke-order-demo');
  });
});
