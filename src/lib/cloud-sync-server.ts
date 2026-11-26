// src/lib/cloud-sync-server.ts v5.2.61
// 云同步服务端逻辑：仅服务端引入 @vercel/blob；限流 + 读写备份，与路由层分离便于单测。
import { get, put } from '@vercel/blob';
import { parseProgressBackup, createProgressBackup } from '@/lib/progress-transfer';
import { isEmptyProgress } from '@/lib/progress-utils';
import { blobPath, MAX_BACKUP_BYTES } from '@/lib/cloud-sync';
import { blobAuthOptions, blobConfigured } from '@/lib/blob-credentials';
import { SYNC_ERRORS, syncErrorFallbackMessage, type SyncErrorCode } from '@/lib/api-errors';
import { InMemoryRateLimiter, type RateLimiter } from '@/lib/rate-limiter';

export type SyncResult =
  | { ok: true; backup?: string }
  | { ok: false; code: SyncErrorCode; status: number };

/** 云同步凭证是否就绪：读写令牌直接可用；仅 Store ID 时依赖 Vercel OIDC（S7）。 */
export const syncConfigured = (): boolean => blobConfigured();

const fail = (code: SyncErrorCode): SyncResult => ({
  ok: false,
  code,
  status: SYNC_ERRORS[code].status,
});

/**
 * 限流器注入点：默认内存实现只在单实例内有效。
 * 多实例部署须在应用启动处调用 setRateLimiter() 注入 Redis/Upstash 等共享实现（外部凭证，本任务不包含）。
 */
let limiter: RateLimiter = new InMemoryRateLimiter();
export const setRateLimiter = (next: RateLimiter): void => { limiter = next; };
export const createDefaultRateLimiter = (): RateLimiter => new InMemoryRateLimiter();
export type { RateLimiter };

export function rateLimit(key: string, now = Date.now()): boolean {
  return limiter.allow(key, now);
}

export async function readCloudBackup(code: string): Promise<SyncResult> {
  try {
    const file = await get(blobPath(code), { access: 'private', ...blobAuthOptions() });
    if (!file) return fail('not_found');
    const length = Number(file.headers.get('content-length') ?? 0);
    if (length > MAX_BACKUP_BYTES) return fail('too_large');
    const raw = await new Response(file.stream).text();
    if (new TextEncoder().encode(raw).length > MAX_BACKUP_BYTES) return fail('too_large');
    const progress = parseProgressBackup(raw);
    if (isEmptyProgress(progress)) return fail('empty_backup');
    return { ok: true, backup: raw };
  } catch {
    return fail('read_failed');
  }
}

export async function writeCloudBackup(code: string, backup: string): Promise<SyncResult> {
  try {
    const progress = parseProgressBackup(backup);
    if (isEmptyProgress(progress)) return fail('empty_progress');
    const serialized = createProgressBackup(progress);
    if (new TextEncoder().encode(serialized).length > MAX_BACKUP_BYTES) return fail('too_large');
    await put(blobPath(code), serialized, {
      access: 'private',
      contentType: 'application/json',
      allowOverwrite: true,
      addRandomSuffix: false,
      ...blobAuthOptions(),
    });
    return { ok: true };
  } catch {
    return fail('write_failed');
  }
}

/** 兼容旧调用方：英文兜底文案已从 api-errors 单一来源读取。 */
export { syncErrorFallbackMessage as syncErrorMessage };
