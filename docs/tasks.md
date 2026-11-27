# 任务清单 · Task Backlog

> 文档版本：v5.3.0（与项目版本同步，权威版本见 `package.json`）
> 最后更新：**2026-11-27 09:37（UTC+8）— 任务逐项复核、本地闭环与历史迁移批次**
> 本文件是**未完成任务 / 当前进度的单一来源**；已完成任务一律归档至 [tasks-done.md](tasks-done.md)，实现要点见 [CHANGELOG.md](../CHANGELOG.md)。

## 0. 说明与规则（单一来源）

- `tasks.md` 只保留**未完成项**；任何新任务、待办、backlog 只写这里，完成后立即移入 `tasks-done.md`。
- 状态口径：`待办 / 进行中 / 部分完成 / 待外部 / 已完成 / 已取消`；`已完成` 不滞留本文件。
- 每个任务拆到最小可执行模块：一处明确改动 + 一条可验证验收标准。
- 任务计数、测试数、版本号均为实算；历史快照只保留在 `tasks-done.md`，不在本文件维护第二套状态。
- 外部动作（平台凭证、真实部署、母语者审校、CI 实跑）不得以「代码已实现」替代验收结果。

### 0.1 当前清单概览（共 5 项未完成）

| 优先级 | 未完成 | 已归档 | 结论 |
|--------|--------|--------|------|
| **P0** | 2 | 26 | P0-32 生产复验（平台阻断）；OPT-03 分布式限流（外部存储） |
| **P1** | 1 | 59 | OPT-09 E2E/a11y 配置与用例已落地，CI 实跑待验证 |
| **P2** | 1 | 49 | P2-21 母语者人工审校（外部） |
| **P3** | 1 | 5 | OPT-15 首帧代码已落地，LCP/CLS 基线待记录 |
| **合计** | **5** | **157** | 本轮从旧 §10 归档 18 项，保留 3 项部分完成 + 2 项外部动作 |

> 本轮归档清单见 `tasks-done.md`「2026-11-27 任务逐项复核与本地闭环批次 · v5.3.0」。
> 旧 `tasks.md` 中的历史快照（§0.2~§9）已整体迁移到 `tasks-done.md`「历史快照附录」，原文不删减、不再维护状态。

### 0.2 本次状态复核与优先级重排（2026-11-27 09:37 UTC+8）

- **归档 18 项**：OPT-01/02/04/05/06/07/08/10/11/12/13/14/16/17/18 与 DOC-01/02/03，均已本地实现或验证并写入归档文档。
- **保留 5 项**：P0-32、P2-21 为外部动作；OPT-03、OPT-09、OPT-15 为本地代码已落地但外部/CI 验收未闭环的部分完成项。
- **发现并修复 2 项新缺陷**：`/zh-CN` 语言前缀 rewrite 二次命中导致 302 自环；合法空字符串译文被 `|| key` 误判为缺键并渲染 `home.heroSuffix`。两者均有回归单测，截图已按修复后 UI 重做。
- **优先级处理**：OPT-03 保持 P0（多实例限流仍可能突破阈值）；OPT-09 保持 P1（CI 门禁未实跑）；OPT-15 保持 P3（仅缺量化基线）。
- **时间戳**：2026-11-27 09:37（UTC+8）；计数实算为未完成 5 / 已归档 157。

## 1. 当前质量基线（2026-11-27 实测）

| 门禁 | 命令 | 结果 |
|------|------|------|
| 类型检查 | `node node_modules/typescript/bin/tsc --noEmit` | ✅ 0 error |
| Lint | `node node_modules/eslint/bin/eslint.js .` | ✅ 0 error / 0 warning |
| 单测 | 见下方说明 | ✅ 62 文件 / 298 用例通过（修正后复跑口径） |
| 行数 | `node scripts/check-line-count.mjs` | ✅ `all <= 200` |
| 根目录清洁度 | `node scripts/check-root-clean.mjs` | ✅ `root clean` |
| i18n | `node scripts/i18n-lint.mjs` | ✅ 11 语言 / 11 扩展模块 / 175 键 |
| 版本展示 | `node scripts/sync-version.mjs --check` | ✅ `v5.3.0 in sync` |
| 文档相对链接 | `node scripts/check-doc-links.mjs` | ✅ 26 文件 / 292 链接 / 0 断链 |
| OpenAPI | `node node_modules/@redocly/cli/bin/cli.js lint --config docs/redocly.yaml docs/openapi.yaml` | ✅ valid，0 error / 0 warning |
| 体积预算 | `node scripts/check-bundle-size.mjs` | ⏭ 仓库根无 `.next` 产物，脚本按设计输出 SKIP；隔离生产构建已成功 |
| E2E | `node node_modules/@playwright/test/cli.js test` | ⏳ CI 待验证（本机浏览器修订号与依赖不匹配） |

> 本机 Vitest 5.1.1 在 Node 26 下最小冒烟测试即出现 runner 初始化失败（`Cannot read properties of undefined (reading 'config')`），与项目代码无关；本轮使用已缓存的 Vitest 3.2.7 与等价 setup 实跑全量 298 用例通过。CI 使用 Node 24.11.0 与 pin 的 Vitest 5.1.1，需在流水线复核。

## 2. 未完成任务（按当前优先级）

### 2.1 P0

#### P0-32 · 生产部署后 SEO / i18n 全链路复验 `部署/SEO/事故` `待外部（平台阻断）`

- **现状（2026-11-27 复核）**：代码侧 P0-30 / P0-31 / P1-38 / P1-43 / P1-44 已实现并归档；Deploy run `44727890228` 注解为 `Vercel secrets 未配置，跳过部署`，生产域仍跑旧构建。平台配置阻断，非代码缺陷。
- **目标**：① 在 GitHub 仓库配置 `VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` Secrets 并在平台设置 `NEXT_PUBLIC_SITE_URL=https://hanzi.ewuse.com`；② 重新触发 Deploy 并确认日志不再出现「跳过部署」；③ 按 `docs/05-deployment.md` §7 逐项 `curl` 复验。
- **验收**：① `/zh-CN` / `/ja` 的 `<html lang>`、`<title>`、`og:locale` 与页面语言一致，禁 JS 抓取首帧正文语言正确；② canonical / hreflang / sitemap / robots / JSON-LD 全为 `https://hanzi.ewuse.com`，无 `localhost`；③ `og:image` / `twitter:image` 为生产绝对 URL，`/opengraph-image` 返回 200 且 `content-type: image/png`；④ 站内链接均为 `/{locale}/...`；⑤ 结果回填 `docs/05-deployment.md` §7 并注明日期。
- **涉及**：部署平台环境变量与 Deploy、`docs/05-deployment.md` §7
- **依赖**：当前 `main` 已含全部代码改动；需平台部署权限（非本机可闭环）

#### OPT-03 · 云同步限流分布式收敛 `架构/性能` `部分完成`

- **现状**：已新增 `src/lib/rate-limiter.ts`（`RateLimiter` 接口、`InMemoryRateLimiter` TTL sweep、上限淘汰、同步并发语义）与 `setRateLimiter()` 注入点，并发/过期/淘汰单测通过。默认内存实现仅单实例有效，多实例阈值仍为 `30×实例数`。
- **目标**：在 Serverless 启动处注入 Redis / Upstash / EdgeOne KV 等共享实现，使阈值收敛为 30 req/min/码。
- **验收**：共享后端下并发请求、TTL 过期与多实例阈值单测/集成测试通过。
- **涉及**：`src/lib/rate-limiter.ts`、`src/lib/cloud-sync-server.ts`
- **依赖**：外部共享存储与凭证；未配置前不得标记完成。

### 2.2 P1

#### OPT-09 · E2E / a11y 门禁 CI 实跑 `质量/CI` `部分完成`

- **现状**：已新增 `playwright.config.ts`、`e2e/a11y.spec.ts`（10 条用例：首页/learn/practice axe 扫描、`ar` RTL、键盘导航、焦点归还、主题首帧、同意撤回无新增 event、测验重进复位），`test:e2e` 脚本与 CI job 已接入。本机 Playwright 默认 chromium 修订号与已安装浏览器不一致，dev server 受字体网络影响，未取得本地通过结果。
- **目标**：CI 完成 `pnpm exec playwright install --with-deps chromium` 后执行 `pnpm test:e2e` 并全绿。
- **验收**：CI e2e job 成功，报告含 10 条用例；首帧主题 / RTL / 同意撤回 / 测验复位断言全部通过。
- **涉及**：`playwright.config.ts`、`e2e/`、`.github/workflows/ci.yml`
- **依赖**：CI 运行器与浏览器安装（非本机可闭环）

### 2.3 P2

#### P2-21 · 译文母语者人工审校排期 `i18n/质量` `待外部`

- **现状**：`docs/i18n-review.md` 已定义术语 / 语境 / RTL 长度等审校清单与 PR 模板项，但 11 语言译文尚未经过母语者人工抽查。
- **目标**：各语言母语者按 `docs/i18n-review.md` §2 抽查关键路径（导航 / 设置 / 练习 / 测验 / 法律页）译文，记录并修正问题。
- **验收**：① 11 语言至少各抽 1 名审校并提交问题清单；② 关键路径译文错误已修正并复测 `i18n:lint` 通过。
- **涉及**：`docs/i18n-review.md`、各语言词典
- **依赖**：P3-2（流程已建）；需外部审校人

### 2.4 P3

#### OPT-15 · 首页首帧性能基线记录 `性能/UX` `部分完成`

- **现状**：`src/components/pages/home-page.tsx` 已改为内联笔顺数据的静态首帧 SVG，动画组件仅在点击播放后动态加载；`stroke-order-ssr.test.tsx` 已断言 SSR 首帧。LCP / CLS 尚未按同一口径实测。
- **目标**：用 Lighthouse 或 Playwright 在桌面 + 移动节流下记录 LCP / CLS 前后基线，写入 `docs/seo-geo.md`。
- **验收**：同一命令两次运行记录可复现；LCP ≤ 2.5s、CLS ≤ 0.1 或明确记录未达标原因。
- **涉及**：`docs/seo-geo.md`、E2E 性能用例
- **依赖**：OPT-09 的 E2E 基础设施在 CI 可用

## 3. 后续维护约定

- 新任务写入本文件并标注优先级 / 现状证据 / 验收标准 / 涉及文件；完成后立即移入 `tasks-done.md`。
- 每次改动按 `docs/git-workflow.md` bump 一个最小版本，同步 `CHANGELOG.md` 与全局展示位。
- 外部核验任务的结果回填后，把对应行标注「已核验 + 日期」并保留历史记录，不删除。
- 任务计数、测试数、版本号等数据型描述一律实算，禁止凭记忆填写。
- 历史快照不再回写本文件；统一进入 `tasks-done.md`「历史快照附录」。
