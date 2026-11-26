// e2e/a11y.spec.ts v5.2.61
// OPT-09：可访问性与交互回归。使用 axe 扫描公开页面，并覆盖 RTL、键盘、
// 焦点归还、主题首帧、同意撤回后的统计事件、测验重进复位。

import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] as const;
const PUBLIC_PATHS = ['/en/', '/en/learn', '/en/practice'] as const;

/** 注入 gtag 探针：dev 环境不加载真实 GA，但同意状态同步仍会调用 window.gtag。 */
const installGtagProbe = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    const calls: unknown[][] = [];
    const scope = window as unknown as {
      __e2eGtagCalls: unknown[][];
      gtag: (...args: unknown[]) => void;
    };
    scope.__e2eGtagCalls = calls;
    scope.gtag = (...args: unknown[]) => {
      calls.push(args);
    };
  });
};

const eventCallCount = (page: Page): Promise<number> =>
  page.evaluate(() => {
    const scope = window as unknown as { __e2eGtagCalls: unknown[][] };
    return scope.__e2eGtagCalls.filter((args) => args[0] === 'event').length;
  });

for (const route of PUBLIC_PATHS) {
  test(`axe 扫描 ${route} 无 WCAG A/AA 违规`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('#main-content')).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).withTags([...AXE_TAGS]).analyze();
    expect(violations.map((item) => `${item.id}(${item.nodes.length})`)).toEqual([]);
  });
}

test('阿拉伯语页面首帧为 RTL', async ({ page }) => {
  await page.goto('/ar/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const direction = await page
    .locator('#app-shell')
    .evaluate((element) => getComputedStyle(element).direction);
  expect(direction).toBe('rtl');
});

test('Tab 键首先聚焦跳过主内容链接', async ({ page }) => {
  await page.goto('/en/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-to-content')).toBeFocused();
});

test('语言菜单：方向键移动、Esc 关闭并归还焦点', async ({ page }) => {
  await page.goto('/en/');
  const trigger = page.locator('#locale-toggle-desktop-button');
  await trigger.focus();
  await page.keyboard.press('Enter');
  const menu = page.locator('#locale-toggle-desktop-menu');
  await expect(menu).toBeVisible();
  const options = menu.getByRole('option');
  const selected = await options.evaluateAll((elements) =>
    elements.findIndex((element) => element.getAttribute('aria-selected') === 'true')
  );
  expect(selected).toBeGreaterThanOrEqual(0);
  await options.nth(selected).focus();
  await page.keyboard.press('ArrowDown');
  await expect(options.nth((selected + 1) % (await options.count()))).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('设置弹窗：方向键切换主题、Esc 关闭并归还焦点', async ({ page }) => {
  await page.goto('/en/');
  const trigger = page.locator('#settings-open-desktop');
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('#settings-dialog');
  await expect(dialog).toBeVisible();
  const radios = dialog.locator('[role="radio"]');
  const checked = await radios.evaluateAll((elements) =>
    elements.findIndex((element) => element.getAttribute('aria-checked') === 'true')
  );
  expect(checked).toBeGreaterThanOrEqual(0);
  await radios.nth(checked).focus();
  await page.keyboard.press('ArrowRight');
  await expect(radios.nth((checked + 1) % 3)).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('主题首帧：localStorage 偏好在 hydration 前生效', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem('hanzi-master-theme', 'dark'));
  await page.goto('/en/', { waitUntil: 'domcontentloaded' });
  const state = await page.evaluate(() => ({
    dark: document.documentElement.classList.contains('dark'),
    js: document.documentElement.classList.contains('js'),
  }));
  expect(state.js).toBe(true);
  expect(state.dark).toBe(true);
});

test('撤回统计同意后不产生新的 event', async ({ page }) => {
  await installGtagProbe(page);
  await page.goto('/en/');
  await page.locator('#consent-accept').click();
  await expect(page.locator('#consent-banner')).toBeHidden();
  // 同意动作本身会同步 consent 状态，清零后再观察撤回与后续导航
  await page.evaluate(() => {
    (window as unknown as { __e2eGtagCalls: unknown[][] }).__e2eGtagCalls.length = 0;
  });
  await page.locator('#settings-open-desktop').click();
  await page.locator('#settings-consent-toggle').click();
  await expect(page.locator('#consent-banner')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('#site-header nav a[href*="/learn"]').first().click();
  await expect(page).toHaveURL(/\/en\/learn/);
  expect(await eventCallCount(page)).toBe(0);
});

test('测验重进：答题结果与选中态复位', async ({ page }) => {
  await page.goto('/en/practice');
  const quizOption = page.locator('#practice-options button').nth(1);
  await quizOption.click();
  const dialog = page.locator('#practice-quiz-dialog');
  await expect(dialog).toBeVisible();
  await dialog.locator('#practice-quiz-options [role="radio"]').first().click();
  await expect(dialog.locator('#practice-quiz-result')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await quizOption.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('#practice-quiz-result')).toHaveCount(0);
  await expect(dialog.locator('#practice-quiz-options [role="radio"][aria-checked="true"]')).toHaveCount(0);
});
