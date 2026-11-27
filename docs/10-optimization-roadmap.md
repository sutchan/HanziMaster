# 优化建议与未来展望

> 文档版本：v5.3.0（与项目版本同步，权威版本见 `package.json`）
> 评估基准：v5.3.0 源码；维度：代码实现 / 架构设计 / 性能 / 用户体验

本文记录**经源码核验的优化建议及当前状态**。每条包含：问题背景、具体实施方案（含技术选型与步骤）、预期效果（量化优先）、实施优先级。任务化追踪见 [tasks.md](tasks.md)，已完成项见 [tasks-done.md](tasks-done.md)。**状态列于 2026-11-27 复核；已完成项的正文保留为决策依据，不再视为待办。** 量化值为基于文件体积与代码路径的估算，最终以构建产物与 Lighthouse 实测为准。

## 1. 汇总索引

| ID | 维度 | 问题摘要 | 优先级 | 状态（2026-11-27） | 责任人 | 计划时间 |
|----|------|---------|--------|-------------------|-------|---------|
| OPT-01 | 性能/UX | CJK 字体只载 latin 子集、4 字重预载 | **P0** | ✅ 已完成并归档 | 前端维护者（待指派） | 2026-12-05 |
| OPT-02 | 性能 | i18n 扩展词典全语言静态入主包 | **P0** | ✅ 已完成并归档 | 前端维护者（待指派） | 2026-12-05 |
| OPT-03 | 架构/性能 | 云同步限流为无淘汰进程内 Map | **P0** | 🟡 部分完成：内存实现完成，分布式待外部存储 | 后端/平台（待指派） | 2026-12-12 |
| OPT-04 | 性能 | 笔顺动画每帧解析 SVG Path | P1 | ✅ 已完成并归档 | 前端维护者（待指派） | 2026-12-12 |
| OPT-05 | 性能 | 评分管线重复建 canvas、O(P×M) 判定、指针未节流 | P1 | ✅ 已完成并归档 | 前端维护者（待指派） | 2026-12-12 |
| OPT-06 | 架构/性能 | 五层 Provider + 单一 i18n Context 全树重渲染 | P1 | ✅ 已完成并归档 | 前端维护者（待指派） | 2026-12-19 |
| OPT-07 | 架构 | localStorage 有版本封装但无迁移机制 | P1 | ✅ 已完成并归档 | 前端维护者（待指派） | 2026-12-19 |
| OPT-08 | 架构/UX | 跨标签同步只覆盖进度 | P1 | ✅ 已完成并归档 | 前端维护者（待指派） | 2026-12-19 |
| OPT-09 | UX/架构 | axe 依赖已装但未接入 CI | P1 | 🟡 部分完成：配置/用例完成，CI 实跑待验证 | QA/前端（待指派） | 2026-12-26 |
| OPT-10 | UX | 同步码复制失败静默、32 位靠手抄 | P1 | ✅ 已完成并归档 | 前端维护者（待指派） | 2026-12-26 |
| OPT-11 | 性能/架构 | 包体积门禁只统计总量，不约束首屏与字体 | P2 | ✅ 已完成并归档 | 平台（待指派） | 2027-01-09 |
| OPT-12 | 架构 | API 错误码在路由/服务端/客户端三处定义 | P2 | ✅ 已完成并归档 | 全栈（待指派） | 2027-01-09 |
| OPT-13 | UX | RTL 物理属性与方向键硬编码 | P2 | ✅ 已完成并归档 | 前端维护者（待指派） | 2027-01-09 |
| OPT-14 | UX | 书写弹窗笔顺加载失败静默空态 | P2 | ✅ 已完成并归档 | 前端维护者（待指派） | 2027-01-09 |
| OPT-15 | 性能/UX | 首页 Hero 完全 CSR，LCP 依赖 hydration | P3 | 🟡 部分完成：首帧完成，LCP/CLS 基线待记录 | 前端维护者（待指派） | 2027-01-23 |
| OPT-16 | UX | 深色模式 FOUC（首访闪烁） | P1 | ✅ 已完成并归档（与 P1-45 重复登记） | 前端维护者（待指派） | 2026-12-26 |
| OPT-17 | 合规 | GA4 同意撤回后未即时停止采集 | P1 | ✅ 已完成并归档（与 P1-46 重复登记） | 前端/合规（待指派） | 2026-12-26 |
| OPT-18 | UX | 测验重进时旧结果/计时器未复位 | P2 | ✅ 已完成并归档（与 P2-27 重复登记） | 前端维护者（待指派） | 2027-01-09 |

> 责任人当前按角色标注「待指派」——项目无人员台账，需由维护者指定具体姓名后回填；计划时间为建议排期，非承诺日期。

## 2. P0：发布前建议处理

### OPT-01 · 字体配置与中文渲染错配

- **问题背景**：`src/app/layout.tsx:33-38` 用 `Noto_Serif_SC({ subsets:['latin'], weight:[400,500,600,700] })` 且默认预载；`globals.css:16` 的 `--font-serif` 被 hashed family 覆盖，但只下载 latin 子集。应用核心可见文本是汉字，实际回退到 Georgia/系统宋体；4 个拉丁字重 woff2 进入 `<head>` 关键路径。
- **实施方案**：① 首选移除 `next/font/google` 的 `Noto_Serif_SC`，改用系统中文衬线栈（`Songti SC` / `Source Han Serif SC` / `SimSun` / `serif`），用 `size-adjust` / `ascent-override` 稳定回退；② 若必须自托管，改 `next/font/local` 仅加载这 12 个汉字的 subset（可压至数 KB），字重收敛到 1–2 个并设 `preload:false`；③ 在 `scripts/check-bundle-size.mjs` 增加 `MAX_FONT_KB` 回归。
- **预期效果**：首屏预载字节减少约 60–120 KB；汉字真正使用设计的衬线字形；LCP 关键路径不再被无效字体阻塞。
- **优先级**：P0 · 前端维护者（待指派） · 2026-12-05

### OPT-02 · i18n 扩展词典未按需加载

- **问题背景**：`src/lib/i18n/load-translations.ts:8-25` 只把基础词典按 locale 动态 import，末尾统一调用 `extendTranslations`；`translations/extensions/index.ts:3-13,22-33` 静态导入全部 11 语言扩展。切换语言实际只需 1/11。
- **实施方案**：① 扩展改为按 locale 动态 import：`loadTranslations()` 中 `Promise.all([loaders[locale](), import('./extensions/by-locale/' + locale)])`；② 或按领域拆页（geo/seo/legal 只在对应路由加载），`extendTranslations(base, locale, ext)` 接收已加载片段；③ `TranslationKey` 保持 `import type`，避免运行时引入全量键表；④ 用 `i18n-lint.mjs` 继续校验键集合一致。
- **预期效果**：首屏扩展解析量从约 15–25 KB（gzip）降至 1.5–2 KB；词典切换仍保持类型安全。
- **优先级**：P0 · 前端维护者（待指派） · 2026-12-05

### OPT-03 · 云同步限流无淘汰、无分布式语义

- **问题背景**：`src/lib/cloud-sync-server.ts:18-32` 用 `const buckets = new Map()`，`WINDOW_MS=60_000`、`MAX_REQUESTS=30`，无 TTL/delete；Serverless 多实例各自计数，实际阈值为 30×实例数；同步码为 32 位 hex，攻击者可用随机合法码无限灌入 Map。
- **实施方案**：① 抽象 `RateLimiter` 接口 `allow(key): boolean`；② 生产注入 Redis / Upstash / EdgeOne KV 的 `INCR + EXPIRE` 滑动窗口；③ 本地保留内存实现并加每 5 分钟 sweep 清理过期桶作为 fallback；④ 复用现有单测并补并发/TTL 用例。
- **预期效果**：多实例下阈值收敛为 30 req/min/码；常驻内存不再单调增长（10 万码约 6 MB → 有上限）。
- **优先级**：P0 · 后端/平台（待指派） · 2026-12-12

## 3. P1：下一个迭代

### OPT-04 · 笔顺动画每帧重复解析 SVG

- **背景**：`writing-canvas-animation.ts:36-50` 的 `frame()` 每帧调用 `drawHint()`，对已完成笔画逐个 `parsePath()` / `resolveFg()`；`writing-canvas-utils.ts:6-9,27-33,48-65` 每帧读 CSS 变量与 rect。500 ms / 60 fps、最多 4 笔时每帧额外 8 次同步布局读取。
- **方案**：动画开始前一次性 `prepareStrokePaths(strokes): Path2D[]` 并缓存颜色 token（主题切换失效）；淡字底图改为离屏纹理（`OffscreenCanvas`），帧内只 `drawImage` + `ctx.fill(cachedPaths[i])`。
- **预期效果**：单笔动画同步样式/布局读取从约 180–300 次降至接近 0，低端安卓掉帧明显改善。
- **优先级**：P1 · 2026-12-12

### OPT-05 · 评分管线重复建 canvas 与 O(P×M) 判定

- **背景**：`writing-canvas-scoring.ts:36,43,64-105` 每次 `scoreStroke` 都创建离屏 canvas；`directionCoverage` 对每点两次 O(M) 投影；`writing-canvas-input.ts:81-89,100-108` 每个 `pointerMove` 都 push，无最小间距过滤。120 Hz 笔一笔可产生 300–600 点。
- **方案**：模块级复用单例离屏 canvas（按 size/dpr 调整）；`pointerMove` 加 ≥2 CSS px 最小间距或 RDP 抽稀；`projectOnMedian` 一次遍历同时返回 `along` 与 `dist`；高频场景考虑 Web Worker + `OffscreenCanvas.isPointInStroke`。
- **预期效果**：点数降一个数量级；点到线段距离计算从单笔 3000–6000 次降至数百次；抬笔评分不再阻塞主线程。
- **优先级**：P1 · 2026-12-12

### OPT-06 · Provider 嵌套与 i18n Context 全树重渲染

- **背景**：`layout.tsx:103-110` 五层 Provider；`locale-provider.tsx:152-161` 的 `t` 依赖 `dictionary`，词典切换即换引用。20+ 组件订阅 `useTranslation()`，词典异步到达时整树同帧重渲染。
- **方案**：引入 Zustand（selector 订阅）或 Jotai 拆分 locale/theme/toast/drawer；保守方案拆为 `LocaleStateContext` + `TranslationContext`，`t` 用稳定 `useEvent` 引用；`ConsentBanner` / `PwaInstallPrompt` 移出 Provider 子树独立挂载。
- **预期效果**：单次词典加载触发的重渲染从 20–30 个组件降至 ≤5 个。
- **优先级**：P1 · 2026-12-19

### OPT-07 · localStorage 版本封装无迁移机制

- **背景**：`storage.ts:5,26-29` 版本不等直接 `return defaultValue`；`settings.ts:19-34` 仅做字段归一化。schema 升级到 `_v:2` 时存量进度、同步码、设置被静默丢弃。
- **方案**：新增 `src/lib/migrations.ts` 注册表 `{ from, to, transform }`；`safeGetItem` 升级为 `readWithMigration(key, schemaVersion, migrations)`，按链逐级升级并回写；明确 `schemaVersion` 与 `APP_VERSION` 对齐策略；单测覆盖 v0→v1→v2、损坏 JSON、迁移失败回滚。
- **预期效果**：消除「升级即数据丢失」，迁移失败可回滚并保留原始值。
- **优先级**：P1 · 2026-12-19

### OPT-08 · 跨标签同步只覆盖进度

- **背景**：`use-progress.ts:56-68` 监听 `storage`；但 `settings-dialog.tsx:28-36` 仅打开时 `loadSettings()`，`locale-provider.tsx:96-117`、`cloud-sync-controls.tsx:28` 各自持有 state。A 标签改主题/语言/同步码，B 标签无感知。
- **方案**：抽象 `useSyncedStorage<T>(key, fallback)` 统一订阅 `storage` + 自定义事件（纳入已有 `CONSENT_CHANGE_EVENT` / `PROGRESS_IMPORTED_EVENT`）；或提升到 Zustand `persist` middleware；单测用两个 hook 实例模拟跨标签事件。
- **预期效果**：至少 4 类状态（设置/主题/语言/同步码）与 2 个同页组件实例保持一致。
- **优先级**：P1 · 2026-12-19

### OPT-09 · axe 依赖未接入 CI

- **背景**：`package.json:53,56` 已装 `@axe-core/playwright` 与 `@playwright/test`，但全仓除 lockfile 外 0 命中；`vitest.config.ts:15-16` 排除 `e2e/**`；`scripts/` 无 axe 脚本。已有大量无障碍实现无自动化回归。
- **方案**：新增 `playwright.config.ts` 与 `e2e/a11y.spec.ts`，用 `AxeBuilder` 扫描 `/`、`/learn`、`/practice`、writing/quiz/settings 弹窗、移动抽屉（含 `ar`）；补键盘-only 场景（Tab/Esc/方向键/焦点归还）断言；CI 增加 `pnpm test:e2e` 门禁。
- **预期效果**：覆盖 11 语言 × 3 页面 × 4 弹窗 + 移动抽屉，消除人工回归组合爆炸。
- **优先级**：P1 · 2026-12-26

### OPT-10 · 同步码复制失败静默

- **背景**：`cloud-sync-controls.tsx:39-54` 的 `navigator.clipboard?.writeText(next).catch(() => undefined)` 两处均无失败反馈；码仅以 `font-mono` input 展示；覆盖旧码用 `window.confirm`。32 字符手抄若单字符错误率 1%，整体出错概率约 27%。
- **方案**：实现 `copyWithFallback()`：Clipboard 失败时 `input.select()` + `execCommand('copy')`，仍失败则 toast 明确提示并高亮文本；展示二维码或分段格式化；用 Radix `AlertDialog` 替换 `window.confirm`。
- **预期效果**：复制失败从静默变为可感知；手抄错误概率趋近 0。
- **优先级**：P1 · 2026-12-26

### OPT-16 · 深色模式首访 FOUC

- **背景**：主题在客户端 `useEffect` 中应用，首访首帧会先闪浅色再切深色（历史 code review 未闭环项 P1-45）。
- **方案**：在 `<head>` 注入阻塞式内联脚本，从 `localStorage` / `prefers-color-scheme` 读取主题并提前给 `<html>` 加 `dark` class；CSP 保持 `unsafe-inline` 允许该脚本；补 e2e 断言首帧 `data-theme` 正确。
- **预期效果**：首屏主题闪烁次数为 0；CLS 不因主题切换产生。
- **优先级**：P1 · 2026-12-26

### OPT-17 · GA4 同意撤回未即时停止采集

- **背景**：同意撤回事件已广播，但已初始化的 GA4 实例未销毁/停止（历史 code review 未闭环项 P1-46）。
- **方案**：在 `ConsentBanner` 撤回分支调用 GA4 `gtag('consent', 'update', { analytics_storage: 'denied' })` 并清理已排队的 hit；补单测断言撤回后 `dataLayer` 无新增 event。
- **预期效果**：撤回后新增采集次数为 0，满足合规要求。
- **优先级**：P1 · 2026-12-26

## 4. P2：可排期

### OPT-11 · 包体积门禁不约束首屏

- **背景**：`scripts/check-bundle-size.mjs:22-29,43-45` 遍历全部 `.next/static/chunks/*.js`，总预算 1500 KB、单块 500 KB；懒加载 chunk 也计入，无法驱动首屏优化；字体与 CSS 无预算。
- **方案**：按路由区分 first-load chunk，新增 `MAX_FIRST_LOAD_KB`（建议 120–150 KB gzip）；增加 `MAX_FONT_KB` 统计 `.next/static/media/*.woff2`；用已有 `@next/bundle-analyzer` 输出按路由报告并在 CI 存档。
- **预期效果**：门禁可量化首屏预算，防止懒加载总量掩盖首屏膨胀。
- **优先级**：P2 · 2027-01-09

### OPT-12 · API 错误码三处定义

- **背景**：`api/progress/route.ts:13-17,25,31,50`、`cloud-sync-server.ts:69-82`、`cloud-sync-controls.tsx:63-64,81-82,99-100` 各自定义错误码；`not_configured` / `invalid_json` / `use_post` 缺正式消息映射，客户端按 `err.message` 字符串比较。
- **方案**：建 `src/lib/api-errors.ts`：`type SyncErrorCode` 联合类型 + `SYNC_ERRORS` 映射 `{ code → status / messageKey }`；路由与服务端共同引用，客户端按 `response.json().error` 分支并走 i18n key；加「所有服务端码都有映射」单测。
- **预期效果**：缺映射码归零；新增错误码从改三处降为改一处。
- **优先级**：P2 · 2027-01-09

### OPT-13 · RTL 物理属性与方向键硬编码

- **背景**：`toast.tsx:82` 退场用物理方向 `translate-x-full`；`rtl.css:14-16` 只覆写入场；`settings-dialog.tsx:85-92`、`learn-page.tsx:96-97` 方向键映射固定 +1/-1。Canvas/SVG 不镜像的处理是正确的，不应改动。
- **方案**：退场动画按 `dir` 切换 `slideOutRight/Left`；方向键用 `getComputedStyle(el).direction === 'rtl' ? -1 : 1` 计算 delta；纳入 OPT-09 的 RTL e2e 扫描。
- **预期效果**：`ar` 语言键盘导航与动效方向一致。
- **优先级**：P2 · 2027-01-09

### OPT-14 · 书写弹窗笔顺加载失败静默

- **背景**：`writing-dialog.tsx:29-45` catch 仅 `setStrokeData(null)`；对照 `stroke-order-demo.tsx:37-43,119-128` 有 `loadFailed` 与重试按钮。用户看到空白田字格，无法区分「无笔顺数据」与「加载失败」。
- **方案**：抽 `useAsyncResource<T>(loader, deps)` 统一返回 `{ data, loading, error, retry }`；`WritingDialog` 复用 `ErrorState`（`state-views.tsx:39-67`）与重试按钮；加载中展示骨架。
- **预期效果**：首次进入需下载约 12 KB chunk 的失败路径可恢复。
- **优先级**：P2 · 2027-01-09

### OPT-18 · 测验重进状态未复位

- **背景**：历史 code review 未闭环项 P2-27：重新进入测验时旧结果与计时器未完全复位。
- **方案**：在弹窗挂载/重开时统一 reset reducer，清理 `setTimeout` / `setInterval` 句柄；补 e2e 断言重进后计时从 0 开始、结果区为空。
- **预期效果**：重进一致性 100%，无残留计时器触发 setState。
- **优先级**：P2 · 2027-01-09

## 5. P3：长期 / 可选

### OPT-15 · 首页 Hero 完全 CSR

- **背景**：`src/app/page.tsx:5-6` 虽是 RSC 但直接渲染 `'use client'` 的 `HomePage`；`home-page.tsx:2,13-24,61` 的 StrokeOrderDemo 用 `dynamic(..., { ssr:false })`，首屏唯一记忆点不在 SSR HTML 中，需等 hydrate 后才发起 chunk 请求。12 个字的数据总量仅约 12 KB。
- **方案**：首页演示改为 RSC 直接输出静态首帧 `<svg>`（数据内联，去掉 `ssr:false`），仅在点击「播放」时动态 import 动画逻辑；`/learn` 详情同样预渲染字形轮廓；用 Lighthouse/Playwright 记录 LCP 与 CLS 基线。
- **预期效果**：LCP 路径减少 1 次 JS chunk RTT（弱网约 100–300 ms）与视觉跳变。
- **优先级**：P3 · 2027-01-23

## 6. 实施约束

- 每条建议进入 [tasks.md](tasks.md) 后按同一 ID 追踪；完成后移入 `tasks-done.md` 并在此表标记完成版本。
- 量化指标必须在实施前后用同一命令复测：`pnpm build`、`pnpm bundle:check`、`pnpm test --coverage`、Lighthouse（桌面 + 移动节流）。
- 涉及 i18n 的改动必须运行 `pnpm i18n:lint`；涉及 UI 的改动必须覆盖深色与 `ar` RTL。
- 责任人字段当前为角色占位，需维护者指定具体姓名后回填。
