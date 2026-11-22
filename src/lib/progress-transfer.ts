// src/lib/progress-transfer.ts v5.2.58
// P2-17：学习进度 JSON 备份（导出 / 导入 / 严格校验 / v0 迁移），纯函数不触碰 localStorage。

import { getDefaultProgress, validateProgress, type ProgressData } from './progress-utils';
import { MAX_BACKUP_BYTES } from './cloud-sync';

// 上限唯一来源为 cloud-sync.ts，保持客户端导出 / 导入 / API 路由三处口径一致
export { MAX_BACKUP_BYTES };

export interface ProgressBackup {
  app: 'HanziMaster';
  version: 1;
  exportedAt: string;
  progress: ProgressData;
}

export function createProgressBackup(progress: ProgressData, exportedAt = new Date()): string {
  const backup: ProgressBackup = {
    app: 'HanziMaster',
    version: 1,
    exportedAt: exportedAt.toISOString(),
    progress: validateProgress(progress),
  };
  // 紧凑序列化：pretty-print 会把 quizResults 放大约 2 倍，可能造成「写入成功、读回 413」
  return JSON.stringify(backup);
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

/** 解析备份：非法 JSON / 错误应用 / 字段类型错误一律抛错，导入方不得写坏现有进度。 */
export function parseProgressBackup(raw: string): ProgressData {
  // UTF-16 码元数不超过 UTF-8 字节数，先做 O(1) 快速拒绝，避免超大输入触发全量编码分配
  if (typeof raw !== 'string' || raw.length > MAX_BACKUP_BYTES) {
    throw new Error('备份文件过大或格式错误');
  }
  if (new TextEncoder().encode(raw).length > MAX_BACKUP_BYTES) {
    throw new Error('备份文件过大或格式错误');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('备份文件不是合法 JSON');
  }
  if (!isRecord(parsed)) throw new Error('备份文件结构错误');

  // v0（旧版裸 ProgressData）迁移：允许直接导入并交给 validateProgress 清洗
  if (parsed.app === undefined && 'learnedCharIds' in parsed) {
    return validateProgress(parsed);
  }
  if (parsed.app !== 'HanziMaster' || parsed.version !== 1) {
    throw new Error('备份来源或版本不受支持');
  }
  if (typeof parsed.exportedAt !== 'string' || Number.isNaN(Date.parse(parsed.exportedAt))) {
    throw new Error('备份时间无效');
  }
  const progress = parsed.progress;
  if (
    !isRecord(progress) ||
    !Array.isArray(progress.learnedCharIds) ||
    !Array.isArray(progress.quizResults) ||
    !isRecord(progress.dailyActivity)
  ) {
    throw new Error('备份进度字段缺失或类型错误');
  }

  const clean = validateProgress(progress);
  if (
    clean.learnedCharIds.length === 0 &&
    clean.quizResults.length === 0 &&
    Object.keys(clean.dailyActivity).length === 0
  ) {
    return getDefaultProgress();
  }
  return clean;
}
