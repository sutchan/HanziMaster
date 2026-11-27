# 已完成任务归档 · Tasks Done

> 文档版本：v5.3.0（与项目版本同步，权威版本见 `package.json`）
> 最近归档：**2026-11-27 — 任务逐项复核、本地闭环与历史迁移（v5.3.0）**

## 2026-11-27 任务逐项复核与本地闭环批次 · v5.3.0

> 来源：`docs/tasks.md` 旧 §10 的 21 项 OPT/DOC 待办；本批次归档 18 项，剩余 OPT-03 / OPT-09 / OPT-15 仍为部分完成并保留在 `tasks.md`。任务原文完整保留在「任务」列，实现要点与验收证据见末列。

| ID | 任务 | 分类 | 完成版本 | 实现要点 / 验收证据 |
|----|------|------|---------|---------------------|
| OPT-01 | 字体子集与预载修复：`pnpm bundle:check` 含字体预算，汉字实际使用衬线字形 | 性能/UX | v5.3.0 | `src/app/layout.tsx` 移除 `Noto_Serif_SC({subsets:['latin']})` 四个字重预载；`src/app/styles/globals.css` 的 `--font-serif` 改为中文系统衬线栈（Songti SC / Noto Serif CJK SC / SimSun）；`scripts/check-bundle-size.mjs` 增加 `MAX_FONT_KB` / `MAX_FIRST_LOAD_KB` 与无产物 SKIP 分支。实测 `tsc`/`eslint` 通过，隔离生产构建成功 |
| OPT-02 | i18n 扩展按 locale 动态 import；`i18n:lint` 通过且首屏解析量下降 | 性能 | v5.3.0 | `src/lib/i18n/translations/extensions/by-locale/` 新增 11 个按语言入口；`load-translations.ts` 用 `Promise.all([baseLoaders[locale](), extensionLoaders[locale]()])`；`TranslationKey` 保持类型来源；`load-translations.test.ts` 用 spy 证明加载 `ja` 时其余 10 个 loader 未调用；`i18n:lint` 11 语言 / 11 模块 / 175 键通过 |
| OPT-04 | 笔顺路径/颜色预缓存，动画帧内零 Path2D 重建 | 性能 | v5.3.0 | 新增 `writing-canvas-animation-cache.ts`：`createAnimationPaintCache()` 在准备阶段解析 Path2D、读取颜色 token 与 rect，按输入签名 + 主题版本号命中缓存；`writing-canvas-animation.ts` 帧内只读缓存；MutationObserver 与 `prefers-color-scheme` 变化自动失效；`writing-canvas-animation-cache.test.ts` 5 例通过 |
| OPT-05 | 评分单例 canvas + 指针抽稀 + 单次投影；性能基线有记录 | 性能 | v5.3.0 | `writing-canvas-scoring.ts` 复用单例离屏 canvas；新增 `writing-canvas-projection.ts` 一次遍历同时得到 `along`/`dist`；`writing-canvas-input.ts` 对 `pointerMove` 加最小间距抽稀；`writing-canvas-scoring-regression.test.ts` 与 `writing-canvas-input-decimation.test.ts` 通过 |
| OPT-06 | Provider 拆分或 selector 订阅；切语言重渲染组件数下降 | 架构/性能 | v5.3.0 | `locale-provider.tsx` 拆为 `LocaleStateContext` + `TranslationContext`，`t` 经 `useStableEvent` 保持引用恒定；`useLocale`/`useTranslation` 公开 API 不变；`locale-render-stability.test.tsx` 断言词典异步到达不重渲染状态订阅者、t 引用不变 |
| OPT-07 | localStorage schema 迁移链 + 回滚单测；升级不丢数据 | 架构 | v5.3.0 | 新增 `src/lib/migrations.ts` 注册表（from/to/transform、键隔离、环检测）；`storage.ts` 的 `safeGetItem` 接入 `readWithMigration`，迁移成功回写、失败保留原值；`migrations.test.ts` 7 例覆盖损坏 JSON / 无迁移回退 / v0→v1→v2 / transform 抛错 |
| OPT-08 | `useSyncedStorage` 覆盖设置/主题/语言/同步码；双实例测试通过 | 架构/UX | v5.3.0 | 新增 `src/hooks/useSyncedStorage.ts`，统一订阅 `storage`、`STORAGE_SYNC_EVENT` 与既有自定义事件；`settings-dialog.tsx`/`data-controls.tsx` 接入；`useSyncedStorage.test.tsx` 6 例覆盖双实例、跨标签、四类状态键、写入失败不广播 |
| OPT-10 | `copyWithFallback()` + 失败 toast + AlertDialog 替换 confirm | UX | v5.3.0 | `cloud-sync-client.ts` 实现 Clipboard 失败→`select()`+`execCommand`→toast 与高亮；新增 `cloud-sync-confirm-dialog.tsx`（Radix Dialog 受控 alertdialog）替换 `window.confirm`；11 语言失败文案同步；`cloud-sync-client.test.ts` / `cloud-sync-controls.test.tsx` 通过 |
| OPT-11 | 体积门禁区分首屏/懒加载并新增 `MAX_FONT_KB` | 性能/架构 | v5.3.0 | `scripts/check-bundle-size.mjs` 按 build manifest 区分 first-load/lazy chunk，新增 `MAX_FIRST_LOAD_KB`、`MAX_FONT_KB` 与无产物 SKIP；用模拟产物验证预算触发与放行，隔离生产构建成功 |
| OPT-12 | `src/lib/api-errors.ts` 单一错误码源；映射完整性单测通过 | 架构 | v5.3.0 | 新增 `api-errors.ts` 覆盖 12 个服务端码 → status/messageKey；`route.ts`/`cloud-sync-server.ts`/`cloud-sync-controls.tsx` 共用地按 code 分支；`api-errors.test.ts` 从源码抽取实际码验证映射完整性与 11 语言文案 |
| OPT-13 | RTL 退场动画与方向键按 `dir` 计算；纳入 RTL e2e | UX | v5.3.0 | `toast.tsx` 退场按元素 `direction` 切 translate 方向；`settings-dialog.tsx`/`pages/learn-page.tsx` 方向键经 `getComputedStyle(el).direction` 换算步进；`rtl-direction.test.tsx` 4 例通过；RTL e2e 断言并入 OPT-09 |
| OPT-14 | `useAsyncResource` 统一加载态；书写弹窗失败可重试 | UX | v5.3.0 | 新增 `src/hooks/useAsyncResource.ts` 统一 `{data, loading, error, retry}`；`writing-dialog.tsx` 加载中显示骨架、失败复用 `ErrorState` 与重试按钮；`writing-dialog-async.test.tsx` / `useAsyncResource.test.tsx` 通过 |
| OPT-16 | 首屏主题脚本消除 FOUC；e2e 断言首帧主题正确 | UX | v5.3.0 | 与已归档 P1-45 为同一实现：`layout.tsx` 的 `THEME_INIT_SCRIPT` 在 hydration 前设置 `.dark`/`.js`；首帧主题 e2e 断言并入 OPT-09，故本重复登记随本批次归档 |
| OPT-17 | GA4 同意撤回即时停止采集；单测断言撤回后无新增 event | 合规 | v5.3.0 | 与已归档 P1-46 为同一实现：`updateAnalyticsConsent()` + GA4 `consent default/update denied`；本批次补 `consent-withdraw.test.tsx`，断言撤回后路由切换无新增 `dataLayer` event |
| OPT-18 | 测验重进 reset reducer + 清理定时器；e2e 断言通过 | UX | v5.3.0 | 与已归档 P2-27 为同一能力；新增 `quiz-session.ts` / `use-learn-quiz-session.ts` 显式 reducer 与定时清理，`quiz-session.test.ts` / `use-learn-quiz-session.test.ts` 通过；重进 e2e 断言并入 OPT-09，故本重复登记随本批次归档 |
| DOC-01 | 用 Redocly / Swagger CLI 校验 `docs/openapi.yaml` 并接入 CI | 文档/CI | v5.3.0 | `docs/openapi.yaml` 已为 OpenAPI 3.1 权威源；新增 `@redocly/cli@2.84.0`、`docs/redocly.yaml`、`openapi:lint` 脚本与 CI 步骤；实测 `Your API description is valid`（0 error / 0 warning） |
| DOC-02 | 刷新 `docs/assets/screenshots/` 使其与 v5.2.61 UI 一致（当前部分为历史版本） | 文档 | v5.3.0 | 4 张截图（home-light/home-dark/learn/practice）重截为 1280×720 PNG；Playwright 逐页验证 `status200`/`urlStable`/`langZhCN`/`themeMatches`/`noConsentOverlay`/`noRawTranslationKey`；修复 `/zh-CN` 302 自环与 `home.heroSuffix` 空字符串回退后重截 |
| DOC-03 | 新增文档相对链接自动校验脚本并接入 CI | 文档/CI | v5.3.0 | 新增 `scripts/check-doc-links.mjs`、`docs:links` 脚本与 CI 步骤；实测 26 文件 / 295 条相对链接 / 0 断链 |

> **本批次门禁**：`tsc --noEmit` 0 error；`eslint .` 0 error / 0 warning；全量单测 62 文件 / 298 用例通过（Vitest 3.2.7 兼容运行器，详见 `tasks.md` §1 说明）；`i18n:lint`、`check:lines`、`check:root`、`version:check`、文档链接、OpenAPI lint 全通过。

## 2026-11-20 SEO / GEO 代码层收口批次 · v5.2.57

| ID | 任务 | 分类 | 实现要点 |
|----|------|------|---------|
| SEO-GEO-1 | 语义化与结构化数据收口 | SEO | `/learn` `/practice` 补 h1、区块标题 h3→h2；`/privacy` `/terms` 去重 main；新增面包屑组件；JSON-LD 按路由/语言生成，FAQPage 仅首页、内页 BreadcrumbList |
| SEO-GEO-2 | 动态 llms.txt 与客户端元数据同步 | GEO | `llms.txt` 改为 Route Handler 从 SITE_URL 派生双语事实/FAQ/11 语言链接；客户端切语言同步 title / description / OG / Twitter / JSON-LD（复用同一纯函数映射） |
| SEO-GEO-3 | 量化目标与验证 | 质量 | 新增 `docs/seo-geo.md` 指标表、`scripts/seo-audit.mjs` 桌面/移动 UA 结构审计、语义结构与按路由 JSON-LD 单测；最终 Vitest **41 文件 / 217 用例**全通过（含外部会话并行新增用例） |

## 2026-11-20 19:58（UTC+8）临时文件治理批次 · v5.2.55

| ID | 任务 | 分类 | 完成版本 | 实现要点 / 验收证据 |
|----|------|------|---------|---------------------|
| P2-28 | 统一临时文件目录与清理策略 | 仓库卫生 / 工具链 | v5.2.55 | `scripts/temp-paths.mjs` 统一定义 `tmp/`/`cache/`/`log/`/`reports/`，`scripts/clean-temp.mjs` 仅清理四类受管目录并支持 dry-run / 单项 / 全量；`run-tests` 日志落 `log/`、TS 增量与 Vitest 缓存/覆盖率落 `cache/`、正式门禁报告落 `reports/`；根门禁只放行四类目录 + `.next/` 框架例外，删除根 `tsconfig.tsbuildinfo`；CI typecheck 与 coverage 路径同步；README 中英版、编码规范、开发/总览/测试/Git 文档完整记录适用范围、创建与清理策略。实测：Vitest 36 文件 / 200 用例、`check:root` clean、`typecheck`/`eslint`/`i18n:lint`/`check:csp` 全通过 |

## 2026-11-20 19:33（UTC+8）Release 链路验证批次 · v5.2.54

| ID | 任务 | 分类 | 完成版本 | 实现要点 / 验收证据 |
|----|------|------|---------|---------------------|
| P1-40 | `release.yml` 真实 Tag 触发 Release 验证 | CI/发布 | v5.2.54 | ① 修复 `vitest.setup.ts` 跨 Node 版本 Storage 实例不一致导致的 CI 假失败（v5.2.53），`CI` 在 `afe073e` 上 completed/success；② 修复 `release.yml` 门禁以 job id 精确匹配 Jobs API 显示名的恒假阴性（v5.2.54）；③ 推送 Tag `v5.2.54` → Release workflow run `44728160179` completed/success → Release `https://github.com/sutchan/HanziMaster/releases/tag/v5.2.54` 自动生成，正文由 `scripts/extract-changelog.mjs` 从 CHANGELOG 抽取且与 v5.2.54 条目一致 |

> 首次 Tag `v5.2.53` 的 Release 校验因门禁 job 名称匹配缺陷失败（run 44727364116），修复后以新版本 Tag 重验通过；失败记录保留在 GitHub Actions 历史中，不回滚历史 Tag。

## 2026-11-20 18:42（UTC+8）代码任务闭环批次 · v5.2.52

| ID | 任务 | 分类 | 完成版本 | 实现要点 / 验收证据 |
|----|------|------|---------|---------------------|
| P2-19 | 双平台 CSP 字符串一致性测试 | 安全/质量 | v5.2.52 | `scripts/check-csp-consistency.mjs` + `pnpm check:csp`：以生产配置导入 `next.config.mjs` 的 `headers()`，断言与 `edgeone.json` `/*` 规则 CSP 逐字一致；CI `quality` job 增门禁步骤；实测 `csp consistent` |
| P2-20 | 收紧 CSP 中自托管字体的冗余 CDN 条目 | 安全 | v5.2.52 | `next.config.mjs` 与 `edgeone.json` 同步移除 `fonts.googleapis.com` / `fonts.gstatic.com`（style-src / font-src / connect-src），GA4 条目保留；一致性门禁通过 |
| P1-41 | 首访 Cookie 同意横幅遮挡主视觉 | UX/无障碍 | v5.2.52 | `consent-banner.tsx` 已为底部非模态条 + `role=region`，本批次把 `<h2>` 降为 `<p>`，内容标题层级不再被插入 |
| P1-42 | Hero 承诺与真实能力不符 | 内容/设计 | v5.2.52 | `home-page.tsx` 重写：删两枚 blur 光球、玻璃卡、静态永字与虚构 72%；首屏改左文右田字格可播放笔顺（`next/dynamic` + 本地字形占位的 loading fallback）；真实能力文案与「无需注册 · 进度仅存本机」信任点 |
| P2-22 | 减少动效下首屏空白与 `.reveal` 兜底 | 无障碍 | v5.2.52 | 新增 `src/app/styles/reduced-motion.css`：系统偏好与 `html.reduce-motion` 两条路径均清零 animation/transition delay 并强制 hero/`.reveal` 可见；`.reveal` 改 `html.js` 作用域，无 JS 默认可见；首页复用 `useScrollReveal` 替代自建 observer |
| P2-23 | 首页标题层级与中文排版 | 无障碍/排版 | v5.2.52 | H1 → H2(特性) → H3(卡片)；中文标题走 `serif-font`，eyebrow 去 uppercase / 大字距；新增 `common.practice` 等 CTA 文案复用，11 语言词条同步 |
| P2-24 | CTA 错配与内容深度 | IA/内容 | v5.2.52 | 次 CTA 改 `common.practice` → `/practice`；虚构特性卡替换为「12 字库 / 本地进度」真实能力卡；保留 `HomeGeo` 事实/FAQ 区 |
| P2-25 | 首屏高度与移动端留白 | 响应式 | v5.2.52 | hero `min-h-[90vh]` → `min-h-[70vh]`，`py-20` → `py-12/16`；桌面左文右演示两栏，主视觉进入首屏 |
| P1-45 | 主题首屏闪烁（FOUC） | UX | v5.2.52 | `layout.tsx` `<head>` 注入静态主题预设脚本（无用户输入，`script-src 'unsafe-inline'` 已放行），hydration 前设置 `.dark` 与 `.js`，消除主题闪烁并给 `.reveal` 无 JS 兜底 |
| P1-46 | Cookie 同意撤回机制 | 合规/隐私 | v5.2.52 | 新增 `privacy-controls.tsx` 设置面板隐私分区与 `updateAnalyticsConsent()`；GA4 init 先 `consent default: denied`，脚本 onLoad 与撤回/重开均发 `consent update`；11 语言 `privacy.ts` 扩展模块 |
| P2-26 | 设置面板主题选择焦点管理 | 无障碍 | v5.2.52 | 数据分区拆为 `data-controls.tsx`，重置二次确认取消/完成后焦点回到 `#settings-reset`；`settings-dialog.test.tsx` 覆盖两条路径 |
| P2-27 | 首页测验重入与状态残留 | 交互健壮性 | v5.2.52 | 学习页每次打开/关闭清空 `quizAnswer`/`quizCorrect` 与定时器；`quiz-dialog.tsx` 作答后禁用输入与提交并拦截 Enter 重复提交；新增禁用态测试 |

> **实测基线（v5.2.52）**：`tsc --noEmit` 0 error；`eslint .` 0/0；Vitest **36 文件 / 200 用例**全通过；`check:lines` `all <= 200`；`check:root` `root clean`；`check:csp` `csp consistent`；`i18n:lint` 11 语言 / 10 扩展模块 / 175 键；`version:check` v5.2.52 in sync。

## 2026-11-20 18:18（UTC+8）任务状态复核批次 · v5.2.52

> 依据当前源码逐项实查 + 生产域 `https://hanzi.ewuse.com` 实测取证；不再沿用历史文字结论。
> 本批次归档 6 项：1 项完全闭环（P1-39），5 项**代码侧完成**、其线上验收拆分为新任务 P0-32 继续跟踪。

| ID | 任务 | 分类 | 完成版本 | 实现要点 / 验收证据 |
|----|------|------|---------|---------------------|
| P1-39 | 首次真实生产部署 + 线上安全头核验 | 部署/安全 | v5.2.52 | 生产域 `/zh-CN` 与 `/_next/static/*.css` 实测均返回 CSP / `X-Frame-Options: DENY` / `X-Content-Type-Options: nosniff` / `Referrer-Policy: strict-origin-when-cross-origin` / `Permissions-Policy` / `Cross-Origin-Opener-Policy: same-origin` 六类头；核验日期 2026-11-20 18:18（UTC+8），样本见 `reports/online-audit.txt`，结果回填 `docs/05-deployment.md` §3.1 |
| P0-30 | 生产环境变量 `NEXT_PUBLIC_SITE_URL` 必填校验 | 构建/SEO | v5.2.52 | `src/lib/site.ts:28-37` `getSiteUrlWarning`、`next.config.mjs` production 缺配置/非法值阻断构建、`layout.tsx:42-44` `logger.warn`、`.env.example` 生产必填说明、`src/lib/__tests__/site.test.ts` 三分支覆盖。**代码完成**；线上仍返回 `http://localhost:3000` canonical，复验转 P0-32 |
| P0-31 | SSR 首屏语言与 URL 前缀不一致 | i18n/SEO | v5.2.52 | `src/proxy.ts` 注入 `x-hanzi-locale` / `x-hanzi-path`，`layout.tsx` 服务端 `requestContext()` + `loadTranslations()` 并注入 `LocaleProvider.initialDictionary`。**代码完成**；线上 `/zh-CN` 仍 `lang="en"`，复验转 P0-32 |
| P1-38 | 补全 OG / Twitter 分享预览图 | SEO/社媒 | v5.2.52 | `src/app/opengraph-image.tsx` / `twitter-image.tsx` 动态 1200×630 分享图，按 Next.js 文件约定自动注入。**代码完成**；线上 `og:image` 缺失且 `/opengraph-image` 返回 302，复验转 P0-32 |
| P1-43 | metadata 按语言本地化 | SEO/i18n | v5.2.52 | `layout.tsx` `generateMetadata` + `src/lib/build-metadata.ts` + `seo` 扩展 11 语言 + `metadata.test.ts` 两两不同断言。**代码完成**；线上 `/en` / `/ja` 标题仍中文，复验转 P0-32 |
| P1-44 | 站内链接带语言前缀 | i18n/导航 | v5.2.52 | `src/lib/urls.ts` `localizedHref`，`home-page.tsx` / `layout-client.tsx` / `mobile-nav.tsx` / `nav-link.tsx` 统一前缀。**代码完成**；线上首页仍 `/learn` 等无前缀链接，复验转 P0-32 |

> **线上核验结论**：安全头已达标；SEO / i18n 相关 5 项代码已落地但生产域仍在跑旧构建，属部署问题而非代码缺陷。

## 2026-11-20 全面代码审查（18 项）

> 完整原因与修改思路见 [code-review-2026-11-20.md](code-review-2026-11-20.md)；对应测试已随代码合入。

- **CR-01 进度跨标签页覆盖** → `use-progress` 监听 `storage` 事件按 key 重载，避免旧状态整块覆写。
- **CR-02 进度 hydration 不一致** → 首帧统一默认进度，挂载后读取，加载前禁止写回。
- **CR-03 答题记录无上限** → `quizResults` 截断至最近 1000 条。
- **CR-04 进度数值校验过宽** → id/timestamp 严格校验（正整数/非负安全整数）。
- **CR-05 未来日期污染连胜** → `computeStreak` 过滤晚于今天的活动。
- **CR-06 准确率误报满分** → 非满分钳制到 99。
- **CR-07 storage envelope 缺 `_d`** → 回退默认值，保证返回类型一致。
- **CR-08 插值链式替换** → 单次正则扫描替换。
- **CR-09 笔顺 chunk 失败永久卡死** → 清 pending 允许重试 + 内部消费 rejection。
- **CR-10 懒加载未捕获异常** → 书写弹窗/笔顺演示/词典加载三处补 `.catch()`。
- **CR-11 Sentry tunnel 被 302** → `proxy` matcher 排除 `/monitoring`。
- **CR-12 AI 爬虫组覆盖禁用规则** → `robots` 每个 UA 组显式 disallow 敏感路径。
- **CR-13 SITE_URL 非法值构建异常** → 校验绝对 http(s) URL，非法值告警回退。
- **CR-14 RTL 对话框/提示错位** → 物理 `left-1/2` 居中。
- **CR-15 RTL 抽屉手势反向** → 按 `dir` 判定关闭方向。
- **CR-16 重复 DOM id 与英文 aria-label** → `id`/`idPrefix` prop + i18n 标签 + `type=button`。
- **CR-17 `main key={pathname}` 强制重挂** → 移除 key。
- **CR-18 测验可访问性与下载中断** → 结果 aria-live、选项键盘导航、Object URL 延迟释放。

## 说明

- 本文件归档 `docs/tasks.md` 中**已完成**的任务及其实现要点，作为唯一完成记录。
- 新增 / 进行中任务仍记录于 [tasks.md](tasks.md)；任务完成后移入本文件并注明完成版本。

## 归档（2026-11-04 批次）

| ID | 任务 | 分类 | 完成版本 | 实现要点 |
|----|------|------|---------|---------|
| T1 | 空状态 / 错误状态设计稿与代码实现 | UI/UX | v5.2.31 | `src/components/state/state-views.tsx`（EmptyState / ErrorState / LoadingSpinner）；全局 `src/app/error.tsx`、`not-found.tsx`、`loading.tsx`；学习页无选中时 EmptyState 兜底 |
| T2 | 焦点状态视觉增强 | UI/UX | v5.2.31 | `globals.css` 全局 `focus-visible`：2px `--color-ring` 描边 + 4px color-mix 光环（深色模式 38%） |
| T4 | React 组件与交互层测试 | 测试 | v5.2.31 | 安装 `@testing-library/react` / `jest-dom` / `user-event` / `jsdom`；新增 4 个测试文件（state-views / use-progress / use-pronunciation / character-grid），共 47 用例；vitest 环境切 jsdom，`vitest.setup.ts` 内存 Storage 兜底（规避 Node 24 实验性 localStorage getter 遮蔽）；`storage.ts` 改用 `window.localStorage` |
| T5 | 滚动出现动画扩展 | UI/UX | v5.2.31 | `reveal` 扩展至汉字网格与练习选项网格（复用既有 IntersectionObserver hook） |
| T6 | 移动端抽屉手势与触控区域 | UI/UX | v5.2.31 | `src/hooks/use-swipe-close.ts`（右滑 > 60px 关闭抽屉）；关闭 / 导航按钮保持 44px 触控目标 |
| T7 | 加载 / 反馈动画增强 | UI/UX | v5.2.31 | 路由级 `loading.tsx` 旋转指示；练习 / 测验 `use-haptic.ts` 震动反馈（正确 30ms / 错误 40-60-40ms）；按钮波纹为可选项未实现——按压反馈已由 button `active` 位移态覆盖 |
| T8 | 设计规范文档补充 | 文档 | v5.2.31 | `prototype/DESIGN_SPEC.md` 新增 §3.5「组件状态规范」（悬停 / 按压 / 禁用 / 焦点 / 选中 / 加载）与排版微调说明 |
| T9 | 键盘快捷键提示 | UI/UX | v5.2.31 | 学习页 ← / → 切换汉字（弹窗打开或组合键时忽略）+ `.kbd` 键位提示（11 语言 `learn.kbdHint`） |
| T10 | 卡片悬停微缩放 / 导航下划线 | UI/UX | v5.2.31 | 字符卡 `hover:scale-[1.03]`、`active:scale-[0.98]`；导航链接平滑下划线动画（origin-left scaleX） |
| T11 | 字符选择过渡 / 导航高亮平滑 | UI/UX | v5.2.31 | 详情面板按 `key` 重挂载重放 `animate-fade-in-elegant`；导航 active 下划线过渡 |
| T12 | color-mix 派生强调色 | UI/UX | v5.2.31 | `@theme` 新增 `--color-primary-hover / --color-primary-border`（color-mix 单一来源派生），字符卡 / 练习选项边框接入 |
| T13 | 排版微调 | UI/UX | v5.2.31 | h1–h3 统一 `-0.01em` 字间距；移动端（≤640px）小字号行高 ≥ 1.65 |
| T14 | 原型图增强 | 原型 | v5.2.31 | `wireframes.html` 新增 §3.5 状态可视化（强制态演示 / 状态组件 / 动画帧重播）+ 断点指示器（`wireframes-part2.css` / `wireframes-states.js`）；深色模式预览由既有 theme 切换支持 |
| T3 | 安全审计与修复（`pnpm audit --prod` 零漏洞） | 部署/安全 | v5.2.31 | `next` 16.2.9 → **16.4.4**（清零 16.2/16.3 系列 5 个 critical 公告）；`shadcn` 移至 devDependencies（切断 `systeminformation` critical 到生产路径）；`pnpm-workspace.yaml` overrides 钉住 14 个传递依赖补丁版下限（sharp / undici / vite / zod / js-yaml / fast-uri 等）；dev 工具链残留 moderate/low 不进入生产产物，随升级持续消化 |

> 以上为 2026-11-04 首批全部 14 项（T1–T14）的完成归档。

## 归档（2026-11-04 冗余文件清理批次）

| ID | 任务 | 分类 | 完成版本 | 实现要点 |
|----|------|------|---------|---------|
| P0-15 | 修复 security:audit 脚本（npm audit → pnpm audit） | 构建 | v5.2.33 | `security:audit` = `pnpm audit --prod --audit-level=high`、新增 `security:audit:dev` = `pnpm audit --audit-level=high`；`.github/SECURITY.md:40` 与 `docs/05-deployment.md:128` 命令同步；实测 `pnpm audit --prod` 0 漏洞 |
| P0-26 | 完善 scripts/ 测试运行器与产物目录 | 仓库卫生 | v5.2.33 | `scripts/run-tests.mjs` 支持 `--coverage` 透传、产物落 `reports/test-out.txt`；`scripts/check-line-count.mjs` 产物落 `reports/line-count.txt`；`.gitignore` 增 `/reports/`；`package.json` 新增 `test:run` / `check:lines` |
| P0-28 | 删除空 test/ 目录 | 仓库卫生 | v5.2.33 | 仓库根 `test/` 空目录已删除（E2E 目录预留改用 `e2e/`，见 P1-22） |

> 本批次为「项目冗余文件分析与清理」的执行结果：另删除 `i18n-add.mjs` / `sync-5231.mjs` / `audit-parse.mjs`（一次性迁移与解析脚本，能力已并入 `scripts/`）与 `test-out.txt` / `build-out.txt` / `build-err.txt` / `linecheck-result.txt` / `vitest-*.txt`（可再生产物）。

## 归档（2026-11-04 生产就绪度审查批次）

| ID | 任务 | 分类 | 完成版本 | 实现要点 |
|----|------|------|---------|---------|
| P0-25 | 删除根目录高危脚本 `deploy-fix.mjs` | 仓库卫生 | v5.2.32 | 该脚本硬编码 `V = '5.2.30'` 并会改写 `package.json` / `README` / `CHANGELOG`，误执行即污染版本号；已从仓库根删除。其版本同步能力由 P2-9（`scripts/sync-version.mjs`，版本号动态读取 `package.json`）承接 |
| P0-27 | 删除根目录审计与测试产物 JSON | 仓库卫生 | v5.2.32 | 删除 `audit-raw.json`（82.28 KB）、`audit-prod.json`（590 B）、`vitest-result.json`（18.3 KB，记录的是已过期的失败态 `success:false`）；实测基线为 Vitest 9 文件 / 47 用例全通过。产物落 `reports/` 由 P0-26 承接 |
| P0-14 | 修复 `pnpm lint` 脚本（`next lint` 已从 Next 16 移除） | 构建 | v5.2.32 | `package.json` 的 `"lint": "next lint"` → `"eslint ."`（覆盖 `src/` + `prototype/` + `scripts/`）；实测 `node node_modules/eslint/bin/eslint.js .` → 0 error / 0 warning，退出码 0 |

> 本批次由生产就绪度审查（P0 清单）派生；P0-15（`security:audit` 拆分生产/全量）、P0-26（scripts/ 测试运行器完善与 `reports/` 产物目录）仍在 `tasks.md` 中处于「进行中」。

## 归档（2026-11-05 任务推进批次 · v5.2.35）

本批次共完成 **51 项**。逐项实现要点、验收数字与依赖变更见 [CHANGELOG.md](../CHANGELOG.md) `v5.2.35` 小节；
本表保留 ID / 任务 / 分类 / 完成版本索引，不重复搬运描述。

| ID | 任务 | 分类 | 完成版本 |
|----|------|------|---------|
| P0-1 | 新增 MIT LICENSE 文件 | 法律 | v5.2.35 |
| P0-2 | package.json 补 license 字段 | 法律 | v5.2.35 |
| P0-3 | 新增 NOTICE 第三方许可声明 | 法律 | v5.2.35 |
| P0-4 | 笔顺数据来源署名与许可标注 | 法律 | v5.2.35 |
| P0-5 | 新增隐私政策内容模块 | 法律 | v5.2.35 |
| P0-6 | 新增服务条款内容模块 | 法律 | v5.2.35 |
| P0-7 | 新增 /privacy 路由页 | 法律 | v5.2.35 |
| P0-8 | 新增 /terms 路由页 | 法律 | v5.2.35 |
| P0-9 | i18n 新增 legal 区块（11 语言） | 法律/i18n | v5.2.35 |
| P0-10 | 新增追踪同意状态模块 | 法律 | v5.2.35 |
| P0-11 | 新增 Cookie 同意横幅组件 | 法律/UI | v5.2.35 |
| P0-12 | GA4 接入同意门控 + GA ID 走 env | 法律/安全 | v5.2.35 |
| P0-13 | 页脚注入法律链接与免责声明 | 法律/UI | v5.2.35 |
| P0-16 | 新增 GitHub Actions CI 工作流 | CI | v5.2.35 |
| P0-17 | CI 增加覆盖率门禁 | CI/测试 | v5.2.35 |
| P0-18 | 新增部署工作流 | CI/部署 | v5.2.35 |
| P0-19 | 新增 Dependabot 依赖更新配置 | CI | v5.2.35 |
| P0-20 | 新增 .env.example | 构建 | v5.2.35 |
| P0-21 | 接入错误监控（Sentry） | 运维 | v5.2.35 |
| P0-22 | 新增 global-error.tsx 根级错误兜底 | 运维/UI | v5.2.35 |
| P0-23 | 为 /learn、/practice 新增路由级 error.tsx | 运维/UI | v5.2.35 |
| P0-24 | 新增健康检查端点 | 运维 | v5.2.35 |
| P1-1 | 新增 sitemap.ts | SEO | v5.2.35 |
| P1-2 | 新增 robots.ts | SEO | v5.2.35 |
| P1-3 | 新增 manifest.ts | SEO/PWA | v5.2.35 |
| P1-4 | 补全根布局 metadata | SEO | v5.2.35 |
| P1-5 | 为 /learn、/practice 新增页面级 metadata | SEO | v5.2.35 |
| P1-6 | 新增 JSON-LD 结构化数据 | SEO | v5.2.35 |
| P1-10 | radix-ui 整包导入改按需子包 | 性能 | v5.2.35 |
| P1-13 | 接入 @next/bundle-analyzer | 性能 | v5.2.35 |
| P1-14 | 接入体积预算门禁 | 性能/CI | v5.2.35 |
| P1-15 | vitest 覆盖率配置与阈值 | 测试 | v5.2.35 |
| P1-16 | storage 模块单测 | 测试 | v5.2.35 |
| P1-20 | locale-provider / theme-provider 单测 | 测试 | v5.2.35 |
| P1-21 | toast 组件单测 | 测试 | v5.2.35 |
| P1-22 | 接入 Playwright E2E 冒烟测试 | 测试 | v5.2.35 |
| P1-23 | 接入 axe-core 自动化 a11y 测试 | 测试/a11y | v5.2.35 |
| P1-26 | listbox roving tabindex 规范 | a11y | v5.2.35 |
| P1-30 | CSP 补强 | 安全 | v5.2.35 |
| P1-31 | 移除废弃 X-XSS-Protection 响应头 | 安全 | v5.2.35 |
| P1-33 | 新增方向性判断模块 | i18n/RTL | v5.2.35 |
| P1-34 | LocaleProvider 同步 document.dir | i18n/RTL | v5.2.35 |
| P2-2 | 移除 next.config.mjs 无效 images.remotePatterns | 构建 | v5.2.35 |
| P2-3 | 移除 layout.tsx 冗余 preconnect | 性能 | v5.2.35 |
| P2-4 | 修复 useTheme undefined 检查死代码 | 代码质量 | v5.2.35 |
| P2-7 | README 免责声明与数据准确性声明 | 文档/法律 | v5.2.35 |
| P2-9 | 新增版本戳同步脚本 | 工具 | v5.2.35 |
| P2-10 | 补齐 ui/* 组件版本戳 | 代码质量 | v5.2.35 |
| P3-1 | format 脚本覆盖根目录 .mjs | 工具 | v5.2.35 |
| P3-3 | 社区文件与法律文件互链 | 文档 | v5.2.35 |
| P3-4 | 原型与实现一致性回归检查 | 工具 | v5.2.35 |


> 归档后 `tasks.md` 仅保留未完成任务；本批次实测基线：19 个测试文件 / 77 用例、覆盖率 92.77% 行 / 90.19% 函数、
> 生产构建 10 个路由全部成功、体积 1108 KB（预算 1500 KB）。
> 注：v5.2.36–v5.2.37 期间测试文件增至 24 个（writing-canvas-* 拆分、双 quiz-dialog 等），上数为 v5.2.35 快照，不再刷新。

## 归档（2026-11-07 文档同步批次）

| ID | 任务 | 分类 | 完成版本 | 实现要点 |
|----|------|------|---------|---------|
| P2-8 | 同步 docs 文档与实现 | 文档 | v5.2.37 | 全量文档-代码一致性审查：`01-overview`（目录树 / 依赖表 / env 表 / CI 与法律页）、`02-architecture`（安全头清单、路由表、测试数）、`03-development`（命令表补 8 脚本、env 指引）、`04-api-reference`（组件边界、`Translations` 类型、`resolvedTheme`、扩展模块、`/api/health`）、`06-testing`（24 个测试文件清单、E2E 章节、覆盖率阈值现状）、`alignment-checklist`（现状全面刷新）、双 README（脚本表、目录树、技术栈、页面表、env）；另修 `dependabot.yml` 失效 pattern、`SECURITY.md` 联系方式、token 术语与 `--duration-*` 命名。验收：文档所有命令在 `package.json` scripts 中存在且路径引用有效。 |
| P1-17 | 描红判定算法单测 | 测试 | v5.2.37 | 三个测试文件实测通过：`writing-canvas-utils.test.ts`（scoreStroke / judgeUserStroke 命中判定、容差边界、空笔画、坐标越界、drawHint）、`writing-canvas-drawing.test.ts`、`writing-canvas-geometry.test.ts`。覆盖率实测 `writing-canvas-utils.ts` **行覆盖 100%**（验收 ≥90%），分支 97.72%。 |
| P1-18 | learn 测验流程单测 | 测试 | v5.2.37 | `src/components/learn/__tests__/quiz-dialog.test.tsx` 实测通过：打开弹窗、输入拼音、答对/答错分支、得分回写 `useProgress`、关闭重置。 |
| P1-19 | practice 测验流程单测 | 测试 | v5.2.37 | `src/components/practice/__tests__/quiz-dialog.test.tsx` 实测通过：4 选 1 选择、正确率统计、答错提示、结果回写。 |

> 归档实测基线（2026-11-07，v5.2.37）：`pnpm install` 重建依赖后实测——Vitest **24 文件 / 137 用例**全通过；覆盖率 **93.88% 行 / 93.88% 语句 / 91.8% 函数 / 94.65% 分支**（阈值 80/70/80/80 通过）；`tsc --noEmit` 0 error；ESLint 0 error / 0 warning；`check:lines` / `i18n:lint` / `version:check` 全绿。

## 归档（2026-11-07 M1 收尾批次 · v5.2.38）

| ID | 任务 | 分类 | 完成版本 | 实现要点 |
|----|------|------|---------|---------|
| P2-15 | 404 / 错误页 noindex | SEO | v5.2.38 | `src/app/not-found.tsx` 拆为 Server 外壳（导出 `metadata.robots = { index: false, follow: false }`）+ 新增 Client 内核 `src/components/not-found-client.tsx`（交互逻辑不变）。`global-error.tsx` 为 Client Component，按 Next.js 规范无法导出 `metadata`，且 5xx 响应本身不被索引，已作降级说明。 |
| P2-16 | 发音能力降级提示 | UX/i18n | v5.2.38 | `use-pronunciation.ts` 新增 `speechSupported` 三态返回值（null = 检测中，挂载后 `useEffect` 检测，避免 hydration mismatch）；`character-detail.tsx` 在不支持或播放失败时禁用发音按钮并以 `role="status"` 展示可读提示；新增 i18n 键 `learn.pronunciationUnavailable`（11 语言同步，繁中用台湾用语「支援」），`i18n:lint` 与键一致性测试通过。 |
| P2-13 | loading.tsx 骨架屏细化 | UI/UX | v5.2.38 | 新增 `src/app/learn/loading.tsx`（标题 + 12 字卡网格，网格断点与 `character-grid.tsx` 完全一致 + 详情大卡）与 `src/app/practice/loading.tsx`（标题 + 双选项卡 + 周进度卡）骨架，均用语义 token + `animate-pulse`、`aria-hidden`；根 `loading.tsx` 保留旋转指示兜底。 |

> 归档实测基线（2026-11-07，v5.2.38）：Vitest **24 文件 / 138 用例**全通过（新增 `speechSupported` 用例）；`tsc --noEmit` 0 error；ESLint 0 error / 0 warning；`check:lines` / `i18n:lint` 全绿。

## 归档（2026-11-07 根目录卫生批次 · v5.2.40）

| ID | 任务 | 分类 | 完成版本 | 实现要点 |
|----|------|------|---------|---------|
| P0-29 | 根目录清洁度门禁与产物目录规范 | 仓库卫生 | v5.2.40 | 新增 `scripts/check-root-clean.mjs`（白名单制门禁，结果写 `reports/root-clean.txt`）+ `package.json` `check:root`；CI `quality` job 首步执行；`.gitignore` 兜底 `*.out` / `audit-*.json` / `*-result.json`；`coding-standards.md` §4 增产物目录强制说明、§11 门禁表加行；`03-development.md` §3 与两份 README 脚本表同步。配套将「脚本产物统一落 `reports/`、一次性脚本放 `scripts/`」固化为全局用户规则（`code-quality.mdc`） |

> 归档实测（2026-11-07，v5.2.40）：`check:root` → `root clean`；`version:check` → `v5.2.40 in sync`。

## 归档（2026-11-07 仓库页面优化批次 · v5.2.43）

| ID | 任务 | 分类 | 完成版本 | 实现要点 |
|----|------|------|---------|---------|
| P2-1 | 移除 Tailwind v4 死配置并迁移色阶 token | 构建/设计系统 | v5.2.43 | 死配置 `tailwind.config.ts`（v4 需 `@config` 才生效，从未引入）导致 `ink` / `vermilion` / `indigo` 色阶与 `shadow-ink*` 阴影从未进入产物 CSS——主页 hero CTA、导航 Logo 渐变、强调文字等在浅色模式白底白字不可见。修复：色阶与阴影迁入新增 `src/app/styles/theme-colors.css` 的 `@theme`；删除 `tailwind.config.ts`；`components.json` `tailwind.config` 置空；产物 CSS 实测含 `.bg-vermilion-500` / `.text-ink-900` / `.shadow-ink-lg` / `.from-vermilion-500`；10 处文档引用同步为单一来源表述 |

> 归档实测（2026-11-07，v5.2.43）：`next build` 成功；页面截图核实浅色/深色模式视觉恢复设计稿效果（`docs/assets/screenshots/`）。

## 归档（2026-11-08 剩余任务闭环批次 · v5.2.44）

> 来源：`docs/tasks.md` §0.2「状态复核与优先级重排（2026-11-08 11:42 UTC+8）」列出的 22 项；本批次全部闭环，实现要点另见 `CHANGELOG.md` [5.2.44]。

| ID | 任务 | 分类 | 实现要点 |
|----|------|------|---------|
| P1-7 | [locale] 路由骨架与重定向 | i18n 架构 | 新增 `src/proxy.ts`（Next 16 proxy）：`/{locale}/...` 重写到既有页面 + `?lang=`，无前缀旧深链按 cookie / Accept-Language / `?lang=` 协商后 302 到本地化 URL；无需复制三套页面，旧链接不 404 |
| P1-8 | 页面 i18n 化与 hreflang | i18n 架构 | `layout.tsx` 的 `alternates.languages` 指向 11 个语言前缀 URL（x-default 保留 `/`）；`sitemap.ts` 输出 `/{locale}{path}`；根 layout 依 cookie 输出动态 `lang` / `dir`，客户端依 URL 前缀同步 |
| P1-9 | 语言切换器改为 URL 导航 | i18n 架构 | `LocaleProvider.getUrlLocale` 以路径前缀为最高优先级；`setLocale` 用 `history.replaceState` 写入 /{locale}/ 前缀并清掉 `?lang=`，同时持久化 localStorage + cookie，刷新后语言保持 |
| P1-11 | 11 语言词典按需加载 | 性能 | 新增 `src/lib/i18n/load-translations.ts`：每语言独立动态 `import()`；主包仅保留英文兜底词典；切换语言时保留上一份词典直至新 chunk 就绪，避免闪烁；14 个原运行时引用均为 type-only |
| P1-12 | 笔顺数据与重型组件懒加载 | 性能 | `stroke-order-loader.ts` 按字符动态加载 12KB 笔顺数据（同 chunk 只加载一次）；`stroke-order-demo` / `writing-dialog` / `quiz-dialog` 经 `next/dynamic` 拆包，笔顺演示带骨架屏 |
| P1-24 | 移动抽屉焦点陷阱 | 无障碍 | `mobile-nav.tsx`：Tab / Shift+Tab 环绕、背景 `inert`、Escape 关闭、关闭后焦点归还触发元素；同时修复 `onClose` 身份变化导致「打开即关闭」的缺陷；新增 3 例单测 |
| P1-25 | Canvas 键盘/读屏替代路径 | 无障碍 | `writing-canvas-keyboard.tsx` 提供笔画编号输入表单（label / help / role="status"）；`scoreKeyboardSequence` 把序列转成轨迹点，复用指针路径同一 `judgeUserStroke` 评分管线，结果经同一 `onAccuracyChange` 回传；11 语言文案 |
| P1-27 | 测验选项选中语义 | 无障碍 | `practice/quiz-dialog.tsx` 选项改 `role="radiogroup"/"radio"` + `aria-checked`，颜色之外补 ✓ 图标与 ring；测试同步改为按 radio 查询 |
| P1-28 | a11y 文案 i18n | 无障碍 | toast 关闭/区域标签、Dialog 默认 `closeLabel` 与 Footer、笔顺 SVG、Canvas `aria-label` 全部走 `t()`；a11y 扩展补充 11 语言键盘路径文案 |
| P1-29 | 测验释义 i18n | 内容 i18n | `CharacterQuiz.meaning` → `meaningKey: TranslationKey`，12 汉字指向 `practice.meanings.*`；测验与书写弹窗均用 `t(character.meaningKey)` |
| P1-32 | EdgeOne 安全响应头 | 安全/部署 | `edgeone.json` 显式声明 CSP / X-Frame-Options / X-Content-Type-Options / Referrer-Policy / Permissions-Policy / COOP（与 `next.config.mjs` 逐字一致）；`docs/05-deployment.md` §3.1 增权威源说明与三条 `curl -sSI` 核验命令 |
| P1-35 | RTL 逻辑属性 | RTL | 10 个文件的 `ml/mr/left/right/text-left` 等改为 `ms/me/start/end/text-start`；设置开关旋钮加 `ltr:/rtl:` 位移；修复批量替换误伤 `rounded-lg` 并复核 |
| P1-36 | RTL 笔顺/书写适配 | RTL | `rtl.css` 明确汉字笔顺 SVG 与田字格 Canvas 为几何绘制，禁止 `scaleX(-1)` 镜像，笔画编号仍按 1→N；补充单一来源与兼容兜底说明 |
| P1-37 | release.yml 自动发布 | CI/发布 | 新增 `.github/workflows/release.yml`：tag/版本一致校验 → 同 commit CI 全 job 与 Deploy 结论校验 → 同名 Release 查重 → `gh release create`；正文由 `scripts/extract-changelog.mjs` 从 CHANGELOG 抽取；`workflow_dispatch` 兜底；文档 §6.1 / §6 同步 |
| P2-5 | RSC 边界拆分 | 架构 | `src/app/page.tsx` / `learn/page.tsx` / `practice/page.tsx` 改为 Server Component 薄壳；交互岛迁入 `src/components/pages/{home,learn,practice}-page.tsx`，导入全部走 `@/` 别名，公开契约不变 |
| P2-6 | 结构化日志 | 代码质量 | 新增 `src/lib/logger.ts`（唯一 console 出口、JSON 结构、敏感键脱敏、Error 序列化、生产禁用 debug）；`app/error.tsx` 改用 logger；新增 3 例单测 |
| P2-11 | Toast Provider 化 | 代码质量 | `toast.tsx` 重构为 `ToastProvider` + `useToast()`，移除模块级单例；`layout-client.tsx` 包裹 Provider，`settings-dialog.tsx` 与测试改用 Context；新增 Provider 隔离用例 |
| P2-12 | 依赖精确钉住 | 构建 | 32 个 `^` 范围依赖按实际安装版本钉为精确版本，`pnpm install --lockfile-only` 同步 lockfile，`--frozen-lockfile` 实测通过；`docs/05-deployment.md` §8 增升级/回滚策略 |
| P2-14 | PWA 离线兜底与安装引导 | PWA | `public/sw.js`（网络优先 + 缓存 + 导航失败回退 `/offline.html`，不缓存跨域/API）、自包含 `public/offline.html`、`PwaInstallPrompt`（仅 `beforeinstallprompt` 时出现且可永久关闭）+ `pwa` 扩展 11 语言文案；`manifest.ts` 已存在 |
| P2-17 | 进度导出/导入 | 产品 | `src/lib/progress-transfer.ts`：JSON 备份、严格校验、5MB 上限、v0 裸数据迁移；设置面板新增 `ProgressTransferControls`（导出下载 / 导入文件，校验通过才写入）；`useProgress` 监听导入事件刷新内存态；重置二次确认沿用既有实现；新增 3 例单测 |
| P2-18 | 动画令牌收敛 | 代码质量 | `utilities.css` 新增 `.animate-float-gentle-reverse`，移除 `page.tsx:34` 内联 `style={{animation:...}}`；动画名统一来自 token |
| P3-2 | i18n 译文审校流程 | i18n/质量 | 新增 `docs/i18n-review.md`（术语、语境、占位符、数字单位、RTL 长度、lang/dir、a11y、法律文本、新增语言流程）；`scripts/i18n-lint.mjs` 扩展至 6 个模块并检查占位符集合一致与文案 >160 字符；审校项纳入 PR 模板 |

> **实测基线（v5.2.44）**：`tsc --noEmit` 0 error；`eslint src scripts` 0 error / 0 warning；Vitest **29 文件 / 158 用例**全通过；`check:lines` `all <= 200`；`check:root` `root clean`；`i18n:lint` 11 语言 / 6 扩展模块 / 占位符一致；`version:check` `v5.2.44 in sync`；`pnpm install --frozen-lockfile` 通过。
> **外部环境核验（代码已交付，非本机能验）**：P1-32 线上 `curl -sSI`、P1-37 真实 Tag 触发 Release、P3-2 母语者人工审校——清单保留在 `docs/tasks.md` §0.4，不计入未完成任务。

## 归档（2026-11-09 缺陷修复批次 · v5.2.46）

| ID | 任务 | 分类 | 实现要点 |
|----|------|------|---------|
| BUG-1 | 笔顺演示与书写画布上下颠倒（用户报告） | 缺陷修复 | 根因：笔顺数据为 Hanzi Writer 格式（1024 网格、y 轴向上、基线 y=900），渲染/判定均未做 y 翻转且 viewBox 误用 1000。修复：`stroke-order-demo.tsx` 加 `<g transform="scale(1, -1) translate(0, -900)">` + viewBox 1024；`writing-canvas-utils.ts` 新增 `scaleY()`（x 走 `scale()`，分母改 1024），引导动画与 `scoreKeyboardSequence` 统一走翻转映射；`writing-canvas-animation.ts` 已完成笔改为坐标变换后填充；描红判定拆至 `writing-canvas-scoring.ts`（含 Path2D 反变换与线宽比例放大） |

> **实测基线（v5.2.46）**：`tsc --noEmit` 0 error；`eslint src` 0 error / 0 warning；Vitest **30 文件 / 165 用例**全通过；`version:check` `v5.2.46 in sync`。实现细节见 `CHANGELOG.md` [5.2.46]。

## 归档（2026-11-12 仓库卫生批次 · v5.2.48）

| ID | 任务 | 分类 | 实现要点 |
|----|------|------|---------|
| W-1 | 统一临时文件固定子目录（用户指示） | 仓库卫生 | `.tmp/` 定为会话级一次性脚本 / 探针 / 中间产物的唯一固定子目录（gitignore、按需创建、用完即删、不入库）；`scripts/` 放可复用工具脚本、正式产物写 `reports/`，仓库根禁止散落临时文件；`check-root-clean.mjs` 放行 `.tmp` 并更新失败提示，同时修正 `TEMP_PATTERNS` 误把目录名 `.tmp` 当文件后缀的缺陷（临时特征只对文件生效）；ESLint / Prettier / tsconfig / vitest 同步忽略 `.tmp`；`.gitignore` 补 `/.tmp-*` / `/_tmp_*` / `*_tmp*` 历史命名兜底；`coding-standards.md` §4 / §11、`01-overview.md`、`03-development.md` §3、`06-testing.md` §4 同步说明 |

> **实测基线（v5.2.48）**：`.tmp/` 内放含类型错误的 `.ts` 探针与 `.mjs` / `.txt` 产物后，`check:root`、`tsc --noEmit`、`eslint .`、`check:lines`、`version:check`、Vitest **32 文件 / 170 用例**均 exit 0；ESLint `isPathIgnored` / Prettier `--file-info` 返回 ignored；隔离沙盒中根目录临时产物仍被门禁拦截（exit 1）。验证脚本与探针用完即删，临时目录清理后 `check:root` 仍为 `root clean`。

## 历史快照附录（由 `docs/tasks.md` 迁移，2026-11-27）

> 以下内容为旧 `tasks.md` 的历史段落原文，按「完成项不留任务清单」规则迁入归档；其中出现的「待办 / 进行中 / 未完成」均为当时快照，**当前状态一律以 `docs/tasks.md` 为准**。

### 0.2 状态复核与优先级重排（2026-11-08 11:42 UTC+8）

**本次更新记录（历史快照，勿当作当前待办）**：下表「当时状态」列为 2026-11-08 的历史截图，**22 项均已于 v5.2.44 完成并归档**（见本文件）。当前未完成任务仅见 `tasks.md` 头部统计：

| 新优先级 | 任务 | 复核结论（2026-11-08 11:42 实况） | 当时状态 |
|---|---|---|---|
| **P1′ 立即执行** | P2-18 动画令牌 | `page.tsx:34` 内联 animation 仍在 | `待办` |
| | P1-27 测验选项 ARIA | 选项为普通 button，无 radiogroup | `待办` |
| | P1-28 a11y 文案 | 词典 11 语言齐备；toast / 笔顺 / 画布 / dialog 默认仍硬编码 | `进行中` |
| | P1-29 释义 i18n | `practice.meanings.*` 词典齐备，`practice/page.tsx:21-32` 仍英文硬编码 | `进行中` |
| | P1-24 抽屉焦点陷阱 | 仅 Escape + 初始聚焦，`id="mobile-nav"` | `待办` |
| | P2-6 结构化日志 | 无 logger.ts；全 src 仅 1 处 console.error | `待办` |
| | P2-11 toast Context | 仍模块级单例 | `待办` |
| | P2-17 进度导入导出 | 重置 + 二次确认已有；导出/导入缺 | `待办` |
| | P2-14 PWA 离线 | `manifest.ts` 已有；offline / sw / 引导缺 | `待办` |
| | P3-2 i18n 审校 | i18n-lint 仅查清单；`docs/i18n-review.md` 缺 | `进行中` |
| **P2′ 架构里程碑** | P1-7/8/9 URL 级 i18n | 无 `[locale]` / proxy；`?lang=` + cookie 等价子集 | `待办` / `进行中` |
| | P1-11 词典按需加载 | `i18n/index.ts` 全静态 import | `待办` |
| | P1-12 懒加载 | 全仓 `next/dynamic` 0 命中 | `待办` |
| | P1-35/36 RTL | 有 `dir` + `rtl.css` 覆写；物理方向类约 15 文件 | `进行中` / `待办` |
| | P2-5 RSC 边界 | 三页面仍全 `'use client'`（根 layout 为 RSC） | `待办` |
| | P2-12 依赖钉住 | 关键依赖仍 `^`；无升级/回滚文档 | `待办` |
| | P1-25 Canvas 键盘替代 | 仅指针事件，无键盘/读屏替代 | `待办` |
| **P3′ 外部环境** | P1-32 EdgeOne 头 | `edgeone.json` 仅 Cache-Control | `待办` |
| | P1-37 release.yml | 无文件；规范已在 `docs/git-workflow.md` §6.1 | `待办` |

同步修正的过时描述：测试文件数 19 → **29**；P2-14「无 manifest」→ 已有 `src/app/manifest.ts`；P2-17「无清除入口」→ 设置面板已有重置 + 二次确认；P2-5「零 RSC」→ 根 layout 为 RSC。

### 0.3 本轮闭环结果（2026-11-08 12:20 UTC+8）

22 项全部完成并归档，逐项实现要点与验收证据见本文件「2026-11-08 剩余任务闭环批次 · v5.2.44」，变更总览见 `CHANGELOG.md` [5.2.44]。

| 分组 | 闭环任务 | 关键交付 |
|------|---------|---------|
| i18n 架构与性能 | P1-7 / 8 / 9 / 11 / 12 | `src/proxy.ts` 语言前缀 URL、hreflang/sitemap、`load-translations.ts` 动态词典、`stroke-order-loader.ts` + `next/dynamic` 拆包 |
| 无障碍与 RTL | P1-24 / 25 / 27 / 28 / 29 / 35 / 36 | 焦点陷阱 + inert、键盘笔画序列替代路径、radiogroup 语义、a11y/释义全量 i18n、逻辑属性与禁止镜像约束 |
| 架构与质量 | P2-5 / 6 / 11 / 18 | RSC 薄壳 + 交互岛、`src/lib/logger.ts`、ToastProvider、动画 token 收敛 |
| 产品与平台 | P1-32 / 37、P2-12 / 14 / 17 | EdgeOne 安全头兜底、`release.yml`、依赖精确钉住、PWA 离线兜底、进度导出导入 |
| 流程 | P3-2 | `docs/i18n-review.md` + `i18n:lint` 占位符/超长文案检查 + PR 模板审校项 |

### 0.4 外部核验（已升级为受跟踪任务）

以下三项原为「本地无法验证」的外部动作，现升级为受跟踪任务，结果回填对应文档：

- **P1-39** 首次真实生产部署 + 线上安全头 `curl` 核验（原「EdgeOne 安全响应头」，平台以实际部署为准，当前 CI 主路径为 Vercel）→ `docs/05-deployment.md` §3.1
- **P1-40** `release.yml` 真实 Tag 触发 Release 验证 → `docs/git-workflow.md` §6.1
- **P2-21** 译文母语者人工审校（11 语言关键路径抽查）→ `docs/i18n-review.md`

### 1. 当前质量基线（v5.2.55 实测；后续以命令输出为准）

| 门禁 | 命令 | 结果 |
|------|------|------|
| 类型检查 | `node node_modules/typescript/bin/tsc --noEmit` | ✅ 0 error |
| Lint | `node node_modules/eslint/bin/eslint.js .` | ✅ 0 error / 0 warning |
| 单测 | `node scripts/run-tests.mjs` | ✅ **36 文件 / 200 用例**全通过（v5.2.55 实测） |
| 覆盖率 | `pnpm test:run --coverage` | 阈值门禁见 CI `coverage` job；数值以实测为准 |
| 行数 | `pnpm check:lines` | ✅ `all <= 200` |
| 根目录清洁度 | `pnpm check:root` | ✅ `root clean`（仅 `tmp/`/`cache/`/`log/`/`reports/` 四类受管子目录 + `.next/` 框架例外） |
| i18n | `pnpm i18n:lint` | ✅ 11 语言 / 9 扩展模块 / 占位符一致 / 文案 ≤160 |
| 版本展示 | `pnpm version:check` | ✅ `v5.2.55 in sync` |
| 冻结安装 | `pnpm install --frozen-lockfile` | ✅ 通过（依赖已精确钉住） |
| 生产依赖漏洞 | `pnpm security:audit` | ✅ 0 高危（v5.2.31 T3 基线） |
| 生产构建 | `pnpm build` | 见 CI；本地构建产物由 `reports/build-out.log` 记录 |
| 体积预算 | `pnpm bundle:check` | 见 CI `quality` job |

> 2026-11-04 的历史结论（19 文件 / 77 用例、92.77% 覆盖率、1108 KB 产物、10 路由）已由上述实测取代；优势项（无 `any`/`TODO`/`console.log`（仅 logger 出口）/`dangerouslySetInnerHTML`、TS strict、token 单一来源、localStorage schema 校验）保持不退化。

### 2. 生产就绪残差缺口（2026-11-09 新鲜度审查）

> 来源：对 v5.2.45 代码库逐项实查（重跑门禁、读 `next.config.mjs` / `edgeone.json` / `vercel.json` / `deploy.yml` / `layout.tsx` / `site.ts` / `docs/05-deployment.md`），不沿用历史文字结论。结论：**代码面已生产就绪**，残差为「上线前最后必做校验 + 少量打磨」共 7 项。

#### P2-21 · 译文母语者人工审校排期 `i18n/质量` `待办`

- **现状**：`docs/i18n-review.md`（P3-2）已定义术语 / 语境 / RTL 长度等审校清单与 PR 模板项，但 11 语言译文**尚未经过母语者人工抽查**，机器 / 对齐翻译可能存在语境错误。
- **目标**：各语言母语者按 `docs/i18n-review.md` §2 抽查关键路径（导航 / 设置 / 练习 / 测验 / 法律页）译文，记录并修正问题。
- **验收**：① 11 语言至少各抽 1 名审校并提交问题清单；② 关键路径译文错误已修正并复测 `i18n:lint` 通过。
- **涉及**：`docs/i18n-review.md`、各语言词典
- **依赖**：P3-2（流程已建）

### 2.4 建议执行顺序

0. **线上事故优先（§3 审计新增）**：P0-30（先修生产域 SITE_URL 并重新部署）→ P0-31（SSR 语言）→ P1-41（首访横幅遮挡）。
1. **上线前必做**：P1-39（安全头核验）→ P1-40（Release 验证）。
2. **上线同期打磨**：P1-38（OG 图）→ P2-19（CSP 一致性测试）→ P2-20（CSP 收紧）→ P2-21（译文审校，可后置但建议发版前启动）。

### 3. 线上首页审计（2026-11-09，https://hanzi.ewuse.com/zh-CN）

#### 3.0 取证方式与总体结论

| 手段 | 实测证据 |
|------|---------|
| 真实浏览器 1280×720 / 390×844 | 客户端最终为简中、控制台 **0 error / 0 warning**；首访「统计与隐私」横幅在桌面浮于首屏中央、在移动占底部约 190px，均遮挡「永字八法」主视觉卡；`/learn` 经 302 跳到 `/zh-CN/learn` |
| SSR 原始 HTML | `/zh-CN` 返回 `<html lang="en" dir="ltr">`、h1 为英文 `Master Chinese`，整页 SSR 文案英文（web_fetch 同证）；客户端 hydration 后才切中文 |
| head / SEO | `<link rel="canonical">` = `http://localhost:3000/`；11 条 hreflang 全为 localhost；`/sitemap.xml` 的 `<loc>` 与 `/robots.txt` 的 `Host` / `Sitemap` 全为 localhost；无 `og:image` / `twitter:image`；`/en` 页 `<title>` / `og:locale` 仍中文或 `en_US` |
| 无障碍 / 动效 | `prefers-reduced-motion: reduce` 下 `.hero-title` 实测 `opacity:0`、`animation-delay:0.3s`、`animation-duration:1e-05s` → 首屏标题前 0.3s 空白（`.hero-visual` 延迟 0.75s）；横幅无 `role=dialog` / `aria-modal`，且 `H2` 混入内容标题层级；页面 `H1 → H3` 跳级 |
| 源码对照 | `home-page.tsx` 硬编码「72%」进度、3 张特性卡宣称「词源与文化 / 自适应学习（我们的算法）」但应用无字源内容与自适应算法（`docs/04-api-reference.md` 已注明历史键名不代表 AI 后端）、`min-h-[90vh]`、自建 IntersectionObserver；`layout.tsx` 静态中文 metadata；`proxy.ts` rewrite + `?lang=`；`locale-provider.tsx` 首屏 `useEffect` 才切语言 |

**结论**：工程基线健康（无控制台错误、响应式与设置/主题/语言入口齐全），但线上 SEO 配置与首屏语言属阻断级事故；首页在「内容真实性、首访体验、可访问性、国际化一致性」四个维度有系统性问题，且 Hero 未把产品最独特的笔顺演示作为主视觉。

#### 3.4 设计方向（供实现时参考，不另立任务）

以「田字格 + 真实笔顺动画」为唯一记忆点：删掉两枚 blur 光球、玻璃卡、字距 eyebrow 等通用 SaaS 装饰；中文标题统一中文字体与朴素标点；特性卡换成真实功能（12 字库 / 笔顺演示 / 拼音测验 / 本地进度），删除「72%」等虚构统计并补「无需注册 · 进度仅存本机」信任点。约束：一屏一个记忆点、动效只在用户触发时（播放笔顺）出现、尊重减少动效、焦点可见、对比度 AA、11 语言与 RTL 不退化。

### 3.5 v5.2.49 实施进展（2026-11-12，代码已落地 / 待线上复验）

| 任务 | 本批次已落地 | 剩余验收（需部署后执行） |
|------|-------------|------------------------|
| P0-30 | `getSiteUrlWarning` 纯函数 + `layout.tsx` / `next.config.mjs` 生产告警；`.env.example` 与部署清单明确必填 | 生产平台设置 `NEXT_PUBLIC_SITE_URL=https://<正式域名>` 并重新部署；`curl` 全链路不得出现 localhost |
| P0-31 | `proxy.ts` 注入 `x-hanzi-locale` / `x-hanzi-path`；`layout.tsx` 服务端预载词典 + `LocaleProvider.initialDictionary` | 禁用 JS / `curl` 抓 `/zh-CN` 得 `lang="zh-CN"` 且正文中文；浏览器首帧无语言跳动 |
| P1-38 | `opengraph-image.tsx` / `twitter-image.tsx` 动态 1200×630 分享图 | 线上 `/opengraph-image` 返回 200，`og:image` 为生产绝对 URL |
| P1-43 | `generateMetadata` 按 11 语言输出 title / description / `og:locale` / canonical / hreflang；4 个子页面本地化标题 | `curl` 比对 `/en`、`/zh-CN`、`/ja` 的 `<title>` / og 标签两两不同 |
| P1-44 | 全站 `Link` 统一 `/{locale}/...`，active 判定去前缀 | 从 `/zh-CN` 点击所有站内链接直达、network 无 302 |
| GEO（本批次新增） | `llms.txt`、JSON-LD `@graph`、首页事实/FAQ、`robots.ts` AI 爬虫规则、`sitemap.ts` 55 条规范 URL + hreflang | 线上访问 `llms.txt` / `robots.txt` / `sitemap.xml`；搜索控制台与生成式引擎收录观察 |

> 线上核验命令见 `docs/05-deployment.md` §7。代码侧门禁（`tsc` / 全量单测 / ESLint / `i18n:lint` 8 模块 / `check:lines`）已全绿；**上述 5 项验收含线上 `curl`，完成前不归档**。

### 4. 全面代码审查（2026-11-20）

> 完整报告：[code-review-2026-11-20.md](code-review-2026-11-20.md)（含每项问题原因与修改思路）。18 项已修复项已归档至本文件。

#### 4.1 本轮已修复（两轮共 45 项：第一轮 18 + 第二轮 27）

| 类别 | 修复点 | 主要文件 |
|------|--------|---------|
| 进度与统计 | 跨标签页同步、hydration 一致、答题记录上限、id/时间戳严格校验、未来日期连胜、准确率满分钳制、空进度不写回键 | `use-progress.ts`、`progress-utils.ts` |
| 存储与插值 | envelope 缺 `_d` 回退默认值、替换值不再二次解析、写入失败不再广播假成功 | `storage.ts`、`i18n/translate.ts`、`consent.ts`、`settings.ts` |
| 懒加载 | 笔顺 chunk 失败可重试 + 三处消费端 `.catch()`、发音 API 构造检测与异常捕获 | `stroke-order-loader.ts`、`writing-dialog.tsx`、`stroke-order-demo.tsx`、`locale-provider.tsx`、`use-pronunciation.ts` |
| 配置与 SEO | Sentry tunnel 不再被 302、AI 爬虫组补敏感路径禁入、`SITE_URL` 非法值生产构建阻断、Accept-Language q 权重与 manifest 语言协商 | `proxy.ts`、`robots.ts`、`site.ts`、`next.config.mjs`、`request-locale.ts`、`manifest.ts` |
| RTL / 可访问性 / 性能 | 对话框与提示 RTL 居中、抽屉手势方向、重复 DOM id、i18n aria-label、移除 `main key`、测验结果播报与选项键盘导航（含 practice roving tabindex 条件修正）、Object URL 延迟释放、错误页 `lang`/`dir`、Toast 计时器清理 | `dialog.tsx`、`use-swipe-close.ts`、`theme-toggle.tsx`、`locale-toggle.tsx`、`layout-client.tsx`、两个 `quiz-dialog.tsx`、`progress-transfer-controls.tsx`、`global-error.tsx`、`toast.tsx` |
| CI / Release / 门禁 | 删除失效 e2e job 与门禁依赖、tag 注入修复、按实际 commit 查询门禁、i18n-lint 按键与扩展检查、3 处测试假阳性修正、行数与 bundle 脚本边界 | `.github/workflows/ci.yml`、`release.yml`、`scripts/i18n-lint.mjs`、3 个测试文件、`check-line-count.mjs`、`check-bundle-size.mjs` |

详细逐项清单见 `docs/code-review-2026-11-20.md` §2/§3。

### 6. 任务状态复核与线上核验（2026-11-20 18:18 UTC+8）

> 本轮逐项读取当前源码、并对生产域 `https://hanzi.ewuse.com` 实测（证据 `reports/online-audit.txt`），不沿用历史结论。

#### 6.1 本次更新记录

- **归档 6 项**（详见本文件同批次小节）：P0-30、P0-31、P1-38、P1-39、P1-43、P1-44。其中 P1-39 **完全闭环**；其余 5 项为**代码侧完成**、线上验收拆出 P0-32。
- **状态更新 5 项**：P1-41、P2-24、P1-46、P2-26、P2-27 由「待办」改为「部分完成」，并写入复核后的剩余项与行号证据。
- **优先级调整**：新增 P0-32（生产部署复验）为 **P0**——线上实际仍在跑旧构建，SEO / i18n 事故未消除。
- **时间戳**：2026-11-20 18:18（UTC+8）；任务计数实算为未完成 15 / 已归档 125。

#### 6.2 线上实测结论

| 检查项 | 实测结果 | 结论 |
|--------|---------|------|
| 安全头（`/zh-CN` 与 `/_next/static/*.css`） | CSP / X-Frame-Options: DENY / X-Content-Type-Options: nosniff / Referrer-Policy / Permissions-Policy / COOP 六类齐全 | ✅ P1-39 闭环 |
| `<html>` | `lang="en" dir="ltr"`（`/zh-CN`、`/ja` 同样） | ❌ SSR 语言未上线 |
| canonical / hreflang | `<link rel="canonical" href="http://localhost:3000"/>`；hreflang 0 条 | ❌ SITE_URL 未在生产生效 |
| `<title>` / `og:locale` | `/zh-CN`、`/en`、`/ja` 均为中文标题、`og:locale=en_US` | ❌ 本地化 metadata 未上线 |
| `og:image` / `twitter:image` | MISSING；`/opengraph-image` 与 `/twitter-image` 均 302 | ❌ 分享图未上线 |
| 站内链接 | `/learn` `/practice` `/privacy` `/terms` 均无语言前缀 | ❌ 本地化链接未上线 |
| sitemap / robots | 200，但内容含 `localhost` | ❌ 绝对 URL 未上线 |

### 7. 本轮闭环结果与剩余外部任务（2026-11-20 18:42 UTC+8）

#### 7.1 代码侧已全部闭环

按 §6 复核清单推进并完成 **12 项**，全部移入本文件「2026-11-20 18:42 批次」：

| 分组 | 任务 | 交付摘要 |
|------|------|---------|
| SEO / 安全 | P2-19 / P2-20 | `check:csp` 双平台一致性门禁纳入 CI；两处 CSP 移除冗余字体 CDN |
| 首页体验 | P1-42 / P2-23 / P2-24 / P2-25 | 首页重构为「左文右田字格笔顺演示」，删除虚构统计与通用装饰，真实能力卡与 CTA 对齐，标题层级与中文字体修正 |
| 无障碍 / 动效 | P1-41 / P2-22 / P2-26 | 横幅标题降级、减少动效零延迟与无 JS 兜底、设置面板焦点归还 |
| 隐私 / 主题 | P1-45 / P1-46 | head 主题预设消除 FOUC；设置面板可撤回统计同意并同步 GA4 consent update |
| 交互健壮性 | P2-27 | 学习页测验重开清空状态、作答后禁用提交、Enter 防重复 |

**实测门禁**：`tsc --noEmit` 0 error；`eslint .` 0 error / 0 warning；Vitest **36 文件 / 200 用例**全通过；`check:lines` `all <= 200`；`check:root` `root clean`；`check:csp` `csp consistent`；`i18n:lint` 11 语言 / 10 扩展模块 / 175 键；`version:check` v5.2.55 in sync。

#### 7.2 剩余 3 项（均需平台 / 人工介入）

| ID | 优先级 | 任务 | 阻塞原因 | 下一步 |
|----|--------|------|---------|--------|
| P0-32 | P0 | 生产部署后 SEO / i18n 全链路复验 | Vercel Secrets 未配置，Deploy 实际跳过；生产域仍跑旧构建 | 配置三项 Vercel Secrets + `NEXT_PUBLIC_SITE_URL`，重新部署后按 `docs/05-deployment.md` §7 逐项 `curl` 并回填 |
| P2-21 | P2 | 11 语言母语者人工审校 | 需外部审校人，非代码可闭环 | 按 `docs/i18n-review.md` §2 抽查并记录问题清单 |

> 本清单不再保留「代码已完成但未验收」的条目：实现完成即归档，验收动作独立建任务跟踪。

### 8. CI / Release 链路验证与最终状态（2026-11-20 19:33 UTC+8）

| 事项 | 结果 | 证据 |
|------|------|------|
| CI 跨 Node 版本假失败 | 已修复 | `vitest.setup.ts` 统一 Storage 实例；push `afe073e` 后 `CI: completed/success`（run 44725980719 系列） |
| P1-40 真实 Tag/Release | ✅ 完成 | 推送 `v5.2.54` Tag → `Release: completed/success`（run 44728160179）→ Release `https://github.com/sutchan/HanziMaster/releases/tag/v5.2.54` 自动生成，正文与 CHANGELOG 一致 |
| P0-32 生产部署 | ❌ 平台阻断 | Deploy run `44727890228` 注解 `Vercel secrets 未配置，跳过部署`；线上复测仍 `lang="en"` / localhost canonical / 无 hreflang / 无 og:image |
| P2-21 母语者审校 | ⏳ 待外部 | `docs/i18n-review.md` 清单已就绪，需 11 语言审校人 |

**当前版本**：v5.2.55（`package.json` 权威源，README / metadata / 文档戳已同步）。
**未完成任务**：2 项（P0-32 平台配置、P2-21 人工审校），均非本机可闭环。

### 9. 临时文件治理（2026-11-20 19:58 UTC+8）

P2-28 已完成并归档，当前约定：

| 目录 | 用途 | 清理 |
|------|------|------|
| `tmp/` | 一次性脚本 / 探针 / 中间产物 | `pnpm clean:tmp`（默认，会话结束） |
| `cache/` | TS 增量、Vitest/Vite 缓存、覆盖率 | `pnpm clean:cache`（可再生） |
| `log/` | 测试输出等运行日志 | `pnpm clean:log` |
| `reports/` | 门禁与 Release 正式产物 | 按需覆盖；`pnpm clean:all` 统一清理 |

路径与创建逻辑集中在 `scripts/temp-paths.mjs`，清理仅在受管路径白名单内进行（`--dry-run` 可预览）；`.next/` 是 Next/Vercel 框架自有构建目录的唯一例外，由 `next.config.mjs` 的 `distDir` 显式声明。根目录门禁、TS/Vitest/CI 产物路径与全部规范文档已同步；详见 [coding-standards.md](coding-standards.md) §4 与 [03-development.md](03-development.md) §3。

