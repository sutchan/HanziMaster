// src/lib/direction.ts v5.2.61
// OPT-13：方向键与退场动画的方向统一从元素实际 computed direction 推导，禁止硬编码 ±1。

/** 返回逻辑前进方向：LTR 为 +1，RTL 为 -1（视觉右/左随阅读方向翻转）。 */
export function getDirectionDelta(element: HTMLElement | null): 1 | -1 {
  if (typeof window === 'undefined') return 1;
  const node = element ?? document.documentElement;
  return window.getComputedStyle(node).direction === 'rtl' ? -1 : 1;
}

/** 学习页 ← → 键对应的汉字索引步进：RTL 下左右语义互换。 */
export function getArrowStep(key: string, element: HTMLElement | null): number {
  if (key === 'ArrowRight') return getDirectionDelta(element);
  if (key === 'ArrowLeft') return -getDirectionDelta(element);
  return 0;
}
