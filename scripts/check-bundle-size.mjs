// scripts/check-bundle-size.mjs v5.2.61
// 体积预算门禁：在 pnpm build 之后运行，读取 .next/static/chunks 的实际产物。
// 阈值可用 MAX_BUNDLE_KB / MAX_CHUNK_KB / MAX_FIRST_LOAD_KB / MAX_FONT_KB 覆盖。
// 首屏 chunk 仅在 app-build-manifest.json / build-manifest.json 真实存在时判定，否则明确跳过。
// 产物报告写 reports/bundle-size.txt；无构建产物时跳过而不误报失败。

import fs from 'node:fs';
import path from 'node:path';
import { NEXT_DIST_DIR, REPORTS_DIR, ensureDir } from './temp-paths.mjs';

/** 同时写入 reports/ 与 stdout，便于 CI 日志和事后审计共用同一份文本。 */
const emitReport = (lines) => {
  const text = lines.join('\n');
  ensureDir(REPORTS_DIR);
  fs.writeFileSync(path.join(REPORTS_DIR, 'bundle-size.txt'), `${text}\n`);
  console.log(text);
};

// 跟随 next.config.mjs 的 NEXT_DIST_DIR，避免验证独立产物时检查旧目录
const chunksDir = path.join(NEXT_DIST_DIR, 'static/chunks');
if (!fs.existsSync(chunksDir)) {
  emitReport([
    'SKIP: no build output found.',
    `Expected ${path.relative(process.cwd(), chunksDir)}.`,
    'Run `pnpm build` before the size gate; budgets are not evaluated.',
  ]);
  process.exit(0);
}

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });

const toItem = (file) => ({
  abs: file,
  file: path.relative(process.cwd(), file),
  kb: fs.statSync(file).size / 1024,
});

const chunkFiles = walk(chunksDir).filter((file) => file.endsWith('.js')).map(toItem);
const mediaDir = path.join(NEXT_DIST_DIR, 'static/media');
const fontExtensions = new Set(['.woff2', '.woff', '.ttf', '.otf', '.eot']);
const fontFiles = fs.existsSync(mediaDir)
  ? walk(mediaDir)
      .filter((file) => fontExtensions.has(path.extname(file).toLowerCase()))
      .map(toItem)
  : [];

/** 读取真实存在的构建清单，收集根布局与首页的首屏 chunk；缺失时不猜测归属。 */
const collectFirstLoad = () => {
  const candidates = new Set();
  const appManifest = path.join(NEXT_DIST_DIR, 'app-build-manifest.json');
  if (fs.existsSync(appManifest)) {
    const { pages = {} } = JSON.parse(fs.readFileSync(appManifest, 'utf8'));
    for (const key of ['/layout', '/page']) {
      for (const entry of pages[key] ?? []) candidates.add(path.resolve(NEXT_DIST_DIR, entry));
    }
  }
  const buildManifest = path.join(NEXT_DIST_DIR, 'build-manifest.json');
  if (fs.existsSync(buildManifest)) {
    const { rootMainFiles = [], polyfillFiles = [] } = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
    for (const entry of [...rootMainFiles, ...polyfillFiles]) {
      candidates.add(path.resolve(NEXT_DIST_DIR, entry));
    }
  }
  // 清单中的路径可能已被清理，只保留实际存在的产物
  return new Set([...candidates].filter((file) => fs.existsSync(file)));
};

const firstLoadPaths = collectFirstLoad();
const firstLoadKnown = firstLoadPaths.size > 0;
const firstLoad = chunkFiles.filter((item) => firstLoadPaths.has(item.abs));
const lazy = chunkFiles.filter((item) => !firstLoadPaths.has(item.abs));

const sumKb = (items) => items.reduce((sum, item) => sum + item.kb, 0);
const totalKb = sumKb(chunkFiles);
const firstLoadKb = sumKb(firstLoad);
const lazyKb = sumKb(lazy);
const fontKb = sumKb(fontFiles);
const largestChunk = [...chunkFiles].sort((a, b) => b.kb - a.kb).slice(0, 5);
const largestFont = [...fontFiles].sort((a, b) => b.kb - a.kb)[0];

const budgets = {
  total: Number(process.env.MAX_BUNDLE_KB ?? 1500),
  chunk: Number(process.env.MAX_CHUNK_KB ?? 500),
  firstLoad: Number(process.env.MAX_FIRST_LOAD_KB ?? 400),
  font: Number(process.env.MAX_FONT_KB ?? 200),
};
const kb = (value) => value.toFixed(1);

emitReport([
  `chunks: ${chunkFiles.length} (first load ${firstLoad.length}, lazy ${lazy.length})`,
  firstLoadKnown
    ? `first load: ${kb(firstLoadKb)} KB (budget ${budgets.firstLoad} KB)`
    : 'first load: SKIP (no app-build-manifest.json / build-manifest.json)',
  `lazy chunks: ${kb(lazyKb)} KB (informational)`,
  `total: ${kb(totalKb)} KB (budget ${budgets.total} KB)`,
  `largest chunk: ${kb(largestChunk[0]?.kb ?? 0)} KB (budget ${budgets.chunk} KB)`,
  ...largestChunk.map((item) => `  ${kb(item.kb).padStart(8)} KB  ${item.file}`),
  `fonts: ${fontFiles.length} files, ${kb(fontKb)} KB (budget ${budgets.font} KB)`,
  ...(largestFont ? [`  largest font: ${kb(largestFont.kb)} KB  ${largestFont.file}`] : []),
]);

// 未识别首屏归属时不把它当作 0 KB 放行，而是跳过该项预算，避免假绿/假红
const violations = [];
if (totalKb > budgets.total) violations.push(`total ${kb(totalKb)} KB > ${budgets.total} KB`);
if ((largestChunk[0]?.kb ?? 0) > budgets.chunk) {
  violations.push(`largest chunk ${kb(largestChunk[0].kb)} KB > ${budgets.chunk} KB`);
}
if (firstLoadKnown && firstLoadKb > budgets.firstLoad) {
  violations.push(`first load ${kb(firstLoadKb)} KB > ${budgets.firstLoad} KB`);
}
if (fontKb > budgets.font) violations.push(`fonts ${kb(fontKb)} KB > ${budgets.font} KB`);

if (violations.length > 0) {
  console.error(`Bundle size budget exceeded: ${violations.join('; ')}`);
  process.exit(1);
}
