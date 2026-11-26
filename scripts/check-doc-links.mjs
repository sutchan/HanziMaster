// scripts/check-doc-links.mjs v5.2.61
// DOC-03：校验 docs/ 与根 README 的 Markdown 相对链接和图片路径。
// 跳过 http(s)、mailto、tel、协议相对 URL 与纯锚点；结果写 reports/doc-links.txt。

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, REPORTS_DIR, ensureDir } from './temp-paths.mjs';

const DOCS_DIR = path.join(ROOT, 'docs');
const ROOT_READMES = ['README.md', 'README_EN.md'].map((name) => path.join(ROOT, name));
// 目标串必须在 ) 或空白处停止；中文标点后的相邻链接之间通常没有空格
const INLINE_LINK = /!?\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\s*\)/g;
const REF_USAGE = /!?\[([^\]]+)\]\[([^\]]*)\]/g;
const REF_DEFINITION = /^\s*\[([^\]]+)\]:\s*(\S+)/;
const EXTERNAL = /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : file.endsWith('.md') ? [file] : [];
  });

const files = [...walk(DOCS_DIR), ...ROOT_READMES.filter((file) => fs.existsSync(file))];

/** 去掉尖括号、锚点与查询串，只留下需要落盘校验的路径。 */
const normalizeTarget = (raw) =>
  raw
    .trim()
    .replace(/^</, '')
    .replace(/>$/, '')
    .split('#')[0]
    .split('?')[0];

const isSkippable = (target) => target === '' || EXTERNAL.test(target);

/** 相对路径按当前 Markdown 文件解析；以 / 开头则按仓库根解析。 */
const resolveTarget = (file, target) =>
  path.resolve(target.startsWith('/') ? ROOT : path.dirname(file), target.replace(/^\//, ''));

/** 允许省略 .md / index.md 的写法，与 GitHub 渲染行为保持一致。 */
const targetExists = (file, target) => {
  const resolved = resolveTarget(file, target);
  return [
    resolved,
    `${resolved}.md`,
    path.join(resolved, 'README.md'),
    path.join(resolved, 'index.md'),
  ].some((candidate) => fs.existsSync(candidate));
};

const extractInline = (line) => {
  const targets = [];
  for (const match of line.matchAll(INLINE_LINK)) targets.push(match[1]);
  return targets;
};

const extractReferences = (line) => {
  const refs = [];
  for (const match of line.matchAll(REF_USAGE)) refs.push(match[2] || match[1]);
  return refs;
};

const broken = [];
let checked = 0;

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const refs = new Map();
  let inFence = false;

  // 先收集引用定义，再逐行校验，避免定义出现在用例之后时漏检
  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const match = line.match(REF_DEFINITION);
    if (match) refs.set(match[1].toLowerCase(), normalizeTarget(match[2]));
  }

  inFence = false;
  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    const cleaned = line.replace(/`[^`]*`/g, '');
    if (REF_DEFINITION.test(cleaned)) return;

    const targets = [
      ...extractInline(cleaned),
      ...extractReferences(cleaned).map((ref) => refs.get(ref.toLowerCase()) ?? ''),
    ];
    for (const raw of targets) {
      const target = normalizeTarget(raw);
      if (isSkippable(target)) continue;
      checked += 1;
      if (!targetExists(file, target)) {
        broken.push(`${path.relative(ROOT, file)}:${index + 1} -> ${target}`);
      }
    }
  });
}

const report = [
  `files: ${files.length}`,
  `relative links checked: ${checked}`,
  `broken links: ${broken.length}`,
  ...broken.map((item) => `  ${item}`),
].join('\n');
ensureDir(REPORTS_DIR);
fs.writeFileSync(path.join(REPORTS_DIR, 'doc-links.txt'), `${report}\n`);
console.log(report);

if (broken.length > 0) {
  console.error(`Found ${broken.length} broken documentation link(s)`);
  process.exit(1);
}
