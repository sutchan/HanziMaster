// src/lib/cloud-sync-server.ts v5.2.59
// 云同步服务端逻辑：仅服务端引入 @vercel/blob；限流 + 读写备份，与路由层分离便于单测。
import { get, put } from '@vercel/blob';
import { parseProgressBackup, createProgressBackup } from '@/lib/progress-transfer';
import { isEmptyProgress } from '@/lib/progress-utils';
import { blobPath, MAX_BACKUP_BYTES } from '@/lib/cloud-sync';

export type SyncResult =
  | { ok: true; backup?: string }
  | { ok: false; code: string; status: number };

/** BLOB_STORE_ID 需配合 OIDC 才可用；独立 token 或显式启用 OIDC 时才视为已配置（S7）。 */
export const syncConfigured = (): boolean =>
  Boolean(process.env.BLOB_READ_WRITE_TOKEN) ||
  Boolean(process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN);

const fail = (code: string, status: number): SyncResult => ({ ok: false, code, status });

/** 简化令牌桶：按同步码限制每窗口请求数。Serverless 多实例下为尽力而为，非强一致。 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;
const buckets = new Map<string, { start: number; count: number }>();

export function rateLimit(key: string, now = Date.now()): boolean {
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.start >= WINDOW_MS) {
    buckets.set(key, { start: now, count: 1 });
    return true;
  }
  if (bucket.count >= MAX_REQUESTS) return false;
  bucket.count += 1;
  return true;
}

export async function readCloudBackup(code: string): Promise<SyncResult> {
  try {
    const file = await get(blobPath(code), { access: 'private' });
    if (!file) return fail('not_found', 404);
    const length = Number(file.headers.get('content-length') ?? 0);
    if (length > MAX_BACKUP_BYTES) return fail('too_large', 413);
    const raw = await new Response(file.stream).text();
    if (new TextEncoder().encode(raw).length > MAX_BACKUP_BYTES) return fail('too_large', 413);
    const progress = parseProgressBackup(raw);
    if (isEmptyProgress(progress)) return fail('empty_backup', 502);
    return { ok: true, backup: raw };
  } catch {
    return fail('read_failed', 502);
  }
}

export async function writeCloudBackup(code: string, backup: string): Promise<SyncResult> {
  try {
    const progress = parseProgressBackup(backup);
    if (isEmptyProgress(progress)) return fail('empty_progress', 400);
    const serialized = createProgressBackup(progress);
    if (new TextEncoder().encode(serialized).length > MAX_BACKUP_BYTES) return fail('too_large', 413);
    await put(blobPath(code), serialized, {
      access: 'private',
      contentType: 'application/json',
      allowOverwrite: true,
      addRandomSuffix: false,
    });
    return { ok: true };
  } catch {
    return fail('write_failed', 502);
  }
}

const MESSAGES: Record<string, string> = {
  invalid_code: 'Invalid sync code',
  invalid_backup: 'Invalid backup payload',
  not_found: 'No cloud progress for this code',
  too_large: 'Backup exceeds size limit',
  empty_backup: 'Cloud backup contains no progress',
  empty_progress: 'Refusing to overwrite cloud progress with empty data',
  rate_limited: 'Too many requests',
  read_failed: 'Failed to read cloud progress',
  write_failed: 'Failed to write cloud progress',
};

export const syncErrorMessage = (code: string): string =>
  MESSAGES[code] ?? 'Cloud sync request failed';
