// src/lib/migrations.ts v5.3.0
// 版本化 localStorage 数据的迁移注册表：按 from → to 逐级升级，失败时保留原始数据。

export interface StorageEnvelope<T = unknown> {
  _v: number;
  _d: T;
}

/** 单步迁移：transform 只负责数据形状转换，不访问存储。 */
export interface Migration {
  from: number;
  to: number;
  transform: (data: unknown) => unknown;
}

export type MigrationFailure = 'invalid' | 'no-path' | 'transform-failed' | 'cycle';
export type MigrationResult<T> =
  | { ok: true; value: T; version: number }
  | { ok: false; reason: MigrationFailure };

/** 按存储键隔离注册表，避免 A 键的迁移误用于 B 键；测试用 clearMigrations 复位。 */
const registry = new Map<string, Migration[]>();

export function registerMigration(key: string, migration: Migration): void {
  const list = registry.get(key) ?? [];
  list.push(migration);
  registry.set(key, list);
}

export function clearMigrations(key?: string): void {
  if (key === undefined) registry.clear();
  else registry.delete(key);
}

export function isStorageEnvelope(value: unknown): value is StorageEnvelope<unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const envelope = value as Record<string, unknown>;
  return typeof envelope._v === 'number' && Number.isFinite(envelope._v) && '_d' in envelope;
}

/** 逐级查找可用迁移；同一起点优先跨度最大的合法版本，防止跨版本步数膨胀。 */
const findStep = (list: readonly Migration[], from: number, target: number): Migration | undefined =>
  list
    .filter((migration) => migration.from === from && migration.to > from && migration.to <= target)
    .sort((a, b) => b.to - a.to)[0];

/**
 * 把一条版本化记录升级到目标版本；任何一步失败都返回失败结果，调用方不得覆盖原始值。
 * transform 抛错视为失败；最多 32 步，避免错误注册造成死循环。
 */
export function migrateEnvelope<T>(
  key: string,
  envelope: StorageEnvelope<unknown>,
  targetVersion: number,
): MigrationResult<T> {
  if (!isStorageEnvelope(envelope)) return { ok: false, reason: 'invalid' };
  const list = registry.get(key) ?? [];
  let version = envelope._v;
  let data = envelope._d;
  if (version === targetVersion) return { ok: true, value: data as T, version };
  if (version > targetVersion) return { ok: false, reason: 'no-path' };

  for (let step = 0; step < 32; step += 1) {
    const migration = findStep(list, version, targetVersion);
    if (!migration) return { ok: false, reason: step === 0 ? 'no-path' : 'cycle' };
    try {
      data = migration.transform(data);
    } catch {
      return { ok: false, reason: 'transform-failed' };
    }
    version = migration.to;
    if (version === targetVersion) return { ok: true, value: data as T, version };
  }
  return { ok: false, reason: 'cycle' };
}
