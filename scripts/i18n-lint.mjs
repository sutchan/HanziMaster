// scripts/i18n-lint.mjs v5.2.52
// 校验 11 语言包、扩展模块与站点语言常量的键/清单一致性，
// 并检查占位符集合一致性与超长文案（P3-2）。
// 叶子键一致性由单测 src/lib/__tests__/i18n.test.ts 与 site.test.ts 负责。

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/lib/i18n/translations');
const expected = ['en', 'zh-CN', 'zh-TW', 'es', 'ar', 'fr', 'pt-BR', 'de', 'ja', 'ko', 'ru'];
const errors = [];

const files = fs
  .readdirSync(root)
  .filter((f) => f.endsWith('.ts'))
  .map((f) => f.slice(0, -3))
  .sort();
const missing = expected.filter((locale) => !files.includes(locale));
const extra = files.filter((locale) => !expected.includes(locale));
if (missing.length) errors.push(`missing language files: ${missing.join(', ')}`);
if (extra.length) errors.push(`unexpected language files: ${extra.join(', ')}`);

const site = fs.readFileSync('src/lib/site.ts', 'utf8');
for (const locale of expected) {
  if (!site.includes(`'${locale}'`)) errors.push(`site.ts missing locale: ${locale}`);
}

const extensionModules = [
  'a11y', 'cloud', 'geo', 'legal', 'meanings', 'privacy', 'progress', 'pwa', 'quiz', 'seo', 'settings',
];
const byLocaleDir = path.join(root, 'extensions', 'by-locale');
for (const module of extensionModules) {
  const file = path.join(root, 'extensions', `${module}.ts`);
  if (!fs.existsSync(file)) errors.push(`missing extension module: extensions/${module}.ts`);
}
// OPT-02：扩展数据改为 per-locale 模块，lint 直接校验每个语言的全部模块片段
const byLocaleSources = Object.fromEntries(
  expected.map((locale) => {
    const file = path.join(byLocaleDir, `${locale}.ts`);
    if (!fs.existsSync(file)) {
      errors.push(`missing locale extensions: extensions/by-locale/${locale}.ts`);
      return [locale, ''];
    }
    return [locale, fs.readFileSync(file, 'utf8')];
  }),
);
for (const locale of expected) {
  const source = byLocaleSources[locale];
  if (!source.includes('export const extensions')) {
    errors.push(`by-locale/${locale}.ts missing extensions export`);
  }
  for (const module of extensionModules) {
    if (!new RegExp(`^  ${module}:\\s*\\{`, 'm').test(source)) {
      errors.push(`by-locale/${locale}.ts missing extension module: ${module}`);
    }
  }
}

// 占位符一致性：基准包按「键」比较（原按文件整体集合比较无法发现同一文件内跨键互换）
const PLACEHOLDER = /\{\{\s*([\w.-]+)\s*\}\}/g;
const TEXT_LIMIT = 160;

const collectByKey = (source) => {
  const byKey = new Map();
  // 全局匹配：同一行可写多个键（为 200 行门禁压缩行数时仍须逐键校验）
  for (const match of source.matchAll(/(?:^|[\s{,\n])([\w'.-]+):\s*'((?:[^'\\]|\\.)*)'/g)) {
    const names = [...match[2].matchAll(PLACEHOLDER)].map((m) => m[1]);
    const merged = new Set([...(byKey.get(match[1]) ?? []), ...names]);
    byKey.set(match[1], [...merged].sort().join(','));
  }
  return byKey;
};
const collectAll = (source) =>
  [...new Set([...source.matchAll(PLACEHOLDER)].map((m) => m[1]))].sort().join(',');

/** by-locale/<locale>.ts 是 a11y: {...} / cloud: {...} 结构，按顶层模块块收集键与占位符。 */
const collectExtensionFragments = (source) => {
  const blocks = new Map();
  const matches = [...source.matchAll(/^  (\w+):\s*\{/gm)];
  matches.forEach((match, index) => {
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : source.length;
    const text = source.slice(start, end);
    // 先抹掉字符串字面量，避免文案里的 "browser:" 之类被误判为对象键
    const structure = text.replace(/"(?:[^"\\]|\\.)*"/g, '""').replace(/'(?:[^'\\]|\\.)*'/g, "''");
    const keys = [...structure.matchAll(/(?:^|[\s,{])([\w'-]+):/g)].map((key) => key[1]).sort().join(',');
    blocks.set(match[1], { keys, placeholders: collectAll(text) });
  });
  return blocks;
};

const localeSources = Object.fromEntries(
  expected.map((locale) => [locale, fs.readFileSync(path.join(root, `${locale}.ts`), 'utf8')]),
);
const baselineByKey = collectByKey(localeSources.en);
for (const locale of expected) {
  const byKey = collectByKey(localeSources[locale]);
  for (const [key, names] of baselineByKey) {
    if (byKey.get(key) !== names) {
      errors.push(`${locale}.ts key "${key}" placeholder mismatch: expected [${names}], got [${byKey.get(key) ?? ''}]`);
    }
  }
}

// 扩展模块：按语言 × 模块双层校验键集合与占位符集合，避免英文回退掩盖缺键
for (const module of extensionModules) {
  const baseline = collectExtensionFragments(byLocaleSources.en).get(module);
  if (!baseline) continue;
  for (const locale of expected) {
    const fragment = collectExtensionFragments(byLocaleSources[locale]).get(module);
    if (!fragment) continue;
    if (fragment.keys !== baseline.keys) {
      errors.push(`by-locale/${locale}.ts ${module} key mismatch: expected [${baseline.keys}], got [${fragment.keys}]`);
    }
    if (fragment.placeholders !== baseline.placeholders) {
      errors.push(`by-locale/${locale}.ts ${module} placeholder mismatch: expected [${baseline.placeholders}], got [${fragment.placeholders}]`);
    }
  }
}

// 超长文案：主语言包中的 UI 文案超过阈值会破坏移动布局（合规长文在 extensions/legal.ts，不检查）
for (const locale of expected) {
  const lines = localeSources[locale].split('\n');
  for (const [index, line] of lines.entries()) {
    for (const match of line.matchAll(/:\s*'([^']*)'/g)) {
      if (match[1].length > TEXT_LIMIT) {
        errors.push(`${locale}.ts:${index + 1} text too long (${match[1].length} > ${TEXT_LIMIT})`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `i18n lint OK: ${expected.length} locales, ${extensionModules.length} extension modules, ` +
    `checked ${baselineByKey.size} keys, text limit ${TEXT_LIMIT}`,
);
