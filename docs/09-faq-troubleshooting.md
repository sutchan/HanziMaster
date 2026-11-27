# FAQ 与故障排除指南

> 文档版本：v5.3.0（与项目版本同步，权威版本见 `package.json`）

本文按「用户问题 → 开发/本机问题 → 部署/线上问题」分栏，并提供**按症状检索**的速查表。背景见 [08-user-guide.md](08-user-guide.md)、[03-development.md](03-development.md)、[05-deployment.md](05-deployment.md)，未解决项见 [tasks.md](tasks.md)。

## 0. 症状速查表

| 症状 / 报错 | 最可能原因 | 跳转 |
|------------|-----------|------|
| 页面英文、切换语言后刷新又变回英文 | 偏好未写入或被隐私模式阻止 | [1.2](#12-语言与主题) |
| 笔顺演示一直淡字、点击无反应 | chunk 加载失败（学习页有重试，书写弹窗旧版无重试） | [1.3](#13-笔顺与书写) |
| 发音按钮没声音 | WebView 缺少 Web Speech API 或系统无语音包 | [1.4](#14-发音) |
| 进度刷新后消失 | 隐私模式 / 站点数据被清理 / 多标签覆盖 | [1.5](#15-进度与数据) |
| 云同步提示不可用 | 部署未配置 Blob 凭证（503） | [1.6](#16-云同步) |
| `ERR_PNPM_IGNORED_BUILDS` | 本机 pnpm 忽略构建脚本 | [2.1](#21-本机工具链) |
| `next build` 卡在字体下载 | 沙箱无法访问 `fonts.gstatic.com` | [2.2](#22-构建与字体) |
| `[safe-delete][SAFE_DELETE_BULK_CONFIRM_REQUIRED]` | IDE 安全护栏拦截 `.next` 批量清理 | [2.3](#23-ide-安全护栏) |
| `NEXT_PUBLIC_SITE_URL must be a valid absolute http(s) URL` | 站点 URL 非法；未配置已有构建兜底 | [3.1](#31-构建环境变量) |
| 页面出现两条不同 CSP | 平台覆盖了 Next 注入的安全头 | [3.2](#32-安全响应头) |
| canonical / sitemap 出现 `localhost` | 生产站点 URL 曾漏配（历史事故） | [3.3](#33-seo--i18n-线上异常) |
| 部署后 `/learn` 404 | 被当作纯静态站点托管，中间件未运行 | [3.4](#34-部署形态) |

## 1. 用户常见问题

### 1.1 需要注册或登录吗？

不需要。无账户体系、无服务端学习记录。进度默认只存当前浏览器。跨设备迁移见 [08-user-guide.md](08-user-guide.md) §6。

### 1.2 语言与主题

**Q：切换语言后 URL 变了，刷新又变回英文？**

语言同时写入 URL 前缀、`?lang=` 与 cookie。浏览器禁止存储时刷新会回落默认语言；隐私模式下偏好无法持久化。

**Q：阿拉伯语界面下笔画/田字格被镜像了吗？**

没有。RTL 只对界面布局生效，笔顺 SVG 与田字格 Canvas 保持正确书写方向。

**Q：深色模式下字帖看不清？**

淡字底图有独立深色 token。若仍不清晰，可关闭减少动效后刷新并附截图反馈。

### 1.3 笔顺与书写

**Q：点「显示笔顺」没反应？**

学习页的笔顺演示与书写弹窗在 chunk 加载失败时都会显示重试按钮；点击重试即可重新加载（OPT-14 已完成）。

**Q：书写评分怎么算？**

由命中率、笔画方向覆盖与形状贴合综合得出；键盘笔画输入与指针路径共享同一判定。

**Q：可以用手指或触控笔吗？**

可以。Canvas 支持鼠标、触控与触控笔；高频采样会按最小间距抽稀，评分路径已复用单例画布（OPT-05 已完成）。

### 1.4 发音

**Q：点发音没声音？**

依赖 Web Speech API，部分 WebView / 企业浏览器不暴露该能力，此时会给出错误提示。确认系统语音包已安装、浏览器允许音频；不影响其它功能。

### 1.5 进度与数据

**Q：刷新后进度没了？**

常见原因：无痕窗口、浏览器清理站点数据、多标签并发整块覆写。建议定期导出备份。

**Q：重置进度会删云端备份吗？**

不会。重置只清本机 `hanzi-master-progress`；服务端会拒绝空进度覆盖云端。

### 1.6 云同步

**Q：上传/下载不可用或返回 503？**

部署未配置 Vercel Blob 凭证，应用自动降级为纯本地模式，属预期行为。

**Q：同步码忘了怎么办？**

无法找回。同步码是云端备份唯一凭证，服务端不保存码与身份映射。泄露后请在新设备生成新码并重新上传。

**Q：同步是自动的吗？**

不是，全部手动。修改后需再次上传；设置、主题、语言与同步码已支持跨标签同步（OPT-08 已完成），自动同步与冲突解决仍未提供。

## 2. 开发 / 本机问题

### 2.1 本机工具链

| 现象 | 处置 |
|------|------|
| `ERR_PNPM_IGNORED_BUILDS` | 用 Node 直跑等价命令（[03-development.md](03-development.md) §6） |
| 长命令被 IDE 误判为 watch 服务 | 加非交互标志、输出重定向到 `reports/`，或用 `node -e` 读结果 |
| Node 24 `localStorage` getter 遮蔽 | 测试里 mock 实例方法而非 `Storage.prototype`，`try/finally` 还原 |
| `git push` 报 `Internal Server Error` | `git -c http.version=HTTP/1.1 push origin main` |
| `Author identity unknown` | 提交级 `-c user.name=... -c user.email=...`，不改全局 git 配置 |

### 2.2 构建与字体

生产构建仍通过 `next/font/google` 下载拉丁展示字体；受限网络下可能超时报 `Connection timed out when requesting https://fonts.gstatic.com/...`。这是环境限制，可换网络或交由 CI 构建。中文字体已改为系统衬线栈并移除无效 latin 子集预载（OPT-01 已完成），不再因汉字回退影响渲染。

### 2.3 IDE 安全护栏

`next build` 清理 `.next` 可能触发 `SAFE_DELETE_BULK_CONFIRM_REQUIRED`（≥500 文件需审批）。按提示停止删除，不要重试或用等效批量删除；改用 `NEXT_DIST_DIR` 全新目录或交由 CI。

### 2.4 测试

`pnpm test` / `pnpm test --coverage`；阈值与命令见 [06-testing.md](06-testing.md)。E2E 配置、用例与 CI job 已接入（OPT-09），CI 实跑结果待验证。

## 3. 部署 / 线上问题

### 3.1 构建环境变量

**报错**：`NEXT_PUBLIC_SITE_URL must be a valid absolute http(s) URL without query/hash in production`

**原因**：`next.config.mjs` 对站点 URL 做 fail-closed 校验，防止 canonical / hreflang / sitemap / robots 指向 `localhost`。非法值（缺协议、带 query/hash、path）会中断构建。

**处置**：
1. 在平台环境变量显式设置 `NEXT_PUBLIC_SITE_URL=https://<正式域名>`（结尾无斜杠）；写 `.env.local` 无效。
2. 若平台确实无法配置，`pnpm build` 前置脚本 `scripts/prepare-site-url.mjs` 会在 `.env.production.local` 写入兜底 `https://hanzi.ewuse.com`（显式值优先、已配置不覆盖、文件不入库）。这保证构建可用，但换域名必须显式配置。
3. 不要用 `http://localhost` 或占位域名糊弄线上构建。

### 3.2 安全响应头

若 `curl -sSI` 出现两条不同 CSP，说明平台覆盖了 Next 的值。浏览器取交集，不一致会拦截资源。处置：关闭平台 CSP 覆写，保留 `next.config.mjs` 单一来源；`edgeone.json` 兜底 CSP 必须逐字一致。见 [05-deployment.md](05-deployment.md) §3.1。

### 3.3 SEO / i18n 线上异常

历史事故：canonical / hreflang / sitemap / robots 全指向 `localhost:3000`，`/zh-CN` 首屏 `lang="en"`。现已由构建期校验与 `proxy.ts` 中间件修复。复验：

```bash
curl -sSL https://<正式域名>/zh-CN | grep -iE '<html|canonical|hreflang|<h1'
curl -sSL https://<正式域名>/sitemap.xml | grep -i '<loc>' | head -5
curl -sSI https://<正式域名>/ | grep -iE 'content-security-policy|x-frame-options'
```

判据：无 `localhost`；`/zh-CN` 首屏 `lang` 与文案为中文。**该项仍为外部待验证任务 P0-32**（[tasks.md](tasks.md)）。

### 3.4 部署形态

本项目是 Next.js App Router 应用，**不是纯静态 SPA**：`src/proxy.ts` 中间件负责 URL 级 i18n，`/api/progress` 需要服务端运行时。若 `/learn`、`/zh-CN` 404，或日志出现 `No server-handler detected, generating routes.json for pure project`，说明被当纯静态托管。使用 Vercel Next.js 预设或 EdgeOne OpenNext 插件，输出目录保持 `.next`。

### 3.5 GA4 / Sentry 未生效

- GA4：需同时满足 ① 配置 `NEXT_PUBLIC_GA_MEASUREMENT_ID`；② 用户同意；③ 生产环境。
- Sentry：需配置 `SENTRY_DSN`；未配置时零开销不报错。

## 4. 仍未解决的已知问题

见 [10-optimization-roadmap.md](10-optimization-roadmap.md) 与 [tasks.md](tasks.md)：P0-32 线上复验、P2-21 母语者审校、OPT-03 分布式限流、OPT-09 E2E CI 实跑、OPT-15 性能基线等。

## 5. 相关文档

[08-user-guide.md](08-user-guide.md) · [03-development.md](03-development.md) · [05-deployment.md](05-deployment.md) · [06-testing.md](06-testing.md) · [tasks.md](tasks.md)
