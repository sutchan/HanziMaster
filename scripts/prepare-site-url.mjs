// scripts/prepare-site-url.mjs v5.2.61
// 生产构建兜底：构建环境未注入 NEXT_PUBLIC_SITE_URL 时，写入 .env.production.local。
// 设计约束：
//   1. 平台/控制台显式注入的变量永远优先，本脚本不覆盖；
//   2. 已在 .env.production.local 配置过的不覆盖；
//   3. 兜底值是 docs/05-deployment.md §7 记录的本项目正式域名，不是猜测；
//   4. 文件被 .gitignore 的 .env*.local 覆盖，绝不入库。
import { appendFileSync, existsSync, readFileSync } from 'node:fs';

const KEY = 'NEXT_PUBLIC_SITE_URL';
const FALLBACK = 'https://hanzi.ewuse.com';
const FILE = '.env.production.local';

if (process.env[KEY]) {
  console.log(`${KEY}: 构建环境已注入，跳过兜底`);
  process.exit(0);
}

let content = '';
if (existsSync(FILE)) {
  content = readFileSync(FILE, 'utf8');
  if (new RegExp(`^${KEY}=`, 'm').test(content)) {
    console.log(`${KEY}: ${FILE} 已配置，跳过兜底`);
    process.exit(0);
  }
}

const prefix = content.length && !content.endsWith('\n') ? '\n' : '';
appendFileSync(FILE, `${prefix}${KEY}=${FALLBACK}\n`, 'utf8');
console.log(`${KEY}: 未注入，已在 ${FILE} 写入兜底 ${FALLBACK}（显式环境变量优先）`);
