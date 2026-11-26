// playwright.config.ts v5.2.61
// OPT-09：Playwright 端到端门禁。CI 使用已构建产物（pnpm start），本地默认 pnpm dev。
// 浏览器不可用时本配置仍完整；CI job 负责安装 chromium。

import { defineConfig, devices, type ReporterDescription } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';
const isCI = process.env.CI === 'true';
// 本机已有浏览器版本与 Playwright 默认修订号不一致时，可用该变量指向兼容的可执行文件
const chromiumExecutable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const port = new URL(baseURL).port || '3000';
const reporters: ReporterDescription[] = isCI
  ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
  : [['list']];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: reporters,
  outputDir: 'test-results',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(chromiumExecutable ? { launchOptions: { executablePath: chromiumExecutable } } : {}),
      },
    },
  ],
  webServer: {
    // 中文注释：CI 先由 workflow 完成 build 再用 pnpm start；本地用 node 直跑 dev 避开 pnpm 依赖检查
    command: isCI ? `pnpm start --port ${port}` : `node node_modules/next/dist/bin/next dev --port ${port}`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
