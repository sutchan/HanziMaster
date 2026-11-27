// src/lib/storage.ts v5.3.0
// Secure localStorage utilities with version control + 链式迁移（OPT-07）
import { migrateEnvelope, type StorageEnvelope } from './migrations';

export const STORAGE_VERSION = 1;

export type StorageData<T> = StorageEnvelope<T>;

/** 按指定版本写入 envelope；写入失败返回 false，供调用方判定是否真的持久化成功。 */
function writeEnvelope<T>(key: string, value: T, version: number): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const data: StorageData<T> = { _v: version, _d: value };
    window.localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

/**
 * 读取版本化数据：版本不符时尝试按注册表逐级升级并回写。
 * 无可用迁移、JSON 损坏或 transform 抛错时返回默认值，原始数据保持不动（不覆盖、不丢证据）。
 */
export function readWithMigration<T>(key: string, defaultValue: T, targetVersion = STORAGE_VERSION): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    const parsed: unknown = JSON.parse(item);
    if (typeof parsed !== 'object' || parsed === null) return defaultValue;
    const envelope = parsed as StorageEnvelope<unknown>;
    if (typeof envelope._v !== 'number' || !('_d' in envelope)) return defaultValue;
    if (envelope._v === targetVersion) return envelope._d as T;

    const migrated = migrateEnvelope<T>(key, envelope, targetVersion);
    if (!migrated.ok) return defaultValue;
    writeEnvelope(key, migrated.value, migrated.version);
    return migrated.value;
  } catch {
    return defaultValue;
  }
}

/** 兼容既有调用方：目标版本为当前应用 schema 版本。 */
export function safeGetItem<T>(key: string, defaultValue: T): T {
  return readWithMigration(key, defaultValue);
}

/** 写入结果可判定的版本：配额超限/隐私模式下返回 false，避免调用方误报成功。 */
export function trySetItem<T>(key: string, value: T): boolean {
  return writeEnvelope(key, value, STORAGE_VERSION);
}

export function safeSetItem<T>(key: string, value: T): void {
  trySetItem(key, value);
}

/** 安全地移除一个键；存储不可用时静默失败，与既有行为一致。 */
export function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // 存储不可用（隐私模式 / 配额）时不影响业务流程
  }
}
