// src/lib/__tests__/cloud-sync-server.test.ts v5.3.0
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGet, mockPut } = vi.hoisted(() => ({ mockGet: vi.fn(), mockPut: vi.fn() }));
vi.mock('@vercel/blob', () => ({ get: mockGet, put: mockPut }));

import {
  rateLimit, readCloudBackup, writeCloudBackup, syncConfigured, syncErrorMessage,
  setRateLimiter, createDefaultRateLimiter,
} from '../cloud-sync-server';

const CODE = 'a'.repeat(32);
// 备份内容须符合当前 ProgressData schema（字符 id 为正整数、时间戳为毫秒数、日期键为 YYYY-MM-DD）
const backup = JSON.stringify({
  app: 'HanziMaster',
  version: 1,
  exportedAt: new Date().toISOString(),
  progress: {
    learnedCharIds: [1],
    quizResults: [{ charId: 1, correct: true, timestamp: Date.now() }],
    dailyActivity: { '2026-11-23': true },
  },
});

describe('cloud-sync-server', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPut.mockReset();
    setRateLimiter(createDefaultRateLimiter());
    // 应用自有变量名优先；SDK 默认的全局名同时清空，确保断言只反映新命名
    vi.stubEnv('BLOB_HANZI_READ_WRITE_TOKEN', 'token');
    vi.stubEnv('BLOB_HANZI_STORE_ID', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    vi.stubEnv('BLOB_STORE_ID', '');
    vi.stubEnv('VERCEL_OIDC_TOKEN', '');
    vi.stubEnv('VERCEL', '');
  });

  it('rate-limits per sync code within a 60s window', () => {
    const key = `test-${Date.now()}`;
    const now = Date.now();
    for (let i = 0; i < 30; i++) expect(rateLimit(key, now)).toBe(true);
    expect(rateLimit(key, now + 1000)).toBe(false);
    expect(rateLimit(key, now + 61_000)).toBe(true);
  });

  it('允许注入外部限流器实现（分布式注入点）', () => {
    const allow = vi.fn(() => false);
    setRateLimiter({ allow });
    expect(rateLimit('injected')).toBe(false);
    expect(allow).toHaveBeenCalledWith('injected', expect.any(Number));
    setRateLimiter(createDefaultRateLimiter());
  });

  it('reads a valid private backup and rejects missing/oversized ones', async () => {
    mockGet.mockResolvedValueOnce({
      headers: new Headers({ 'content-length': String(backup.length) }),
      stream: new Response(backup).body,
    });
    const ok = await readCloudBackup(CODE);
    expect(ok.ok).toBe(true);
    expect(ok.ok && ok.backup).toBe(backup);

    mockGet.mockResolvedValueOnce(null);
    expect((await readCloudBackup(CODE)).ok).toBe(false);

    mockGet.mockResolvedValueOnce({
      headers: new Headers({ 'content-length': String(5 * 1024 * 1024) }),
      stream: new Response(backup).body,
    });
    expect((await readCloudBackup(CODE)).ok).toBe(false);
  });

  it('validates before overwriting and never writes empty progress', async () => {
    const empty = JSON.stringify({
      app: 'HanziMaster', version: 1, exportedAt: new Date().toISOString(),
      progress: { learnedCharIds: [], quizResults: [], dailyActivity: {} },
    });
    expect((await writeCloudBackup(CODE, empty)).ok).toBe(false);
    expect(mockPut).not.toHaveBeenCalled();

    expect((await writeCloudBackup(CODE, backup)).ok).toBe(true);
    expect(mockPut).toHaveBeenCalledWith(
      `hanzi-master/progress/${CODE}.json`,
      expect.any(String),
      expect.objectContaining({ access: 'private', allowOverwrite: true }),
    );
  });

  it('reports config state and maps error codes to messages', () => {
    expect(syncConfigured()).toBe(true);
    vi.stubEnv('BLOB_HANZI_READ_WRITE_TOKEN', '');
    vi.stubEnv('BLOB_HANZI_STORE_ID', 'store-id');
    vi.stubEnv('VERCEL_OIDC_TOKEN', '');
    expect(syncConfigured()).toBe(false);
    vi.stubEnv('VERCEL_OIDC_TOKEN', 'oidc-token');
    expect(syncConfigured()).toBe(true);
    vi.stubEnv('BLOB_HANZI_STORE_ID', '');
    expect(syncErrorMessage('rate_limited')).toBe('Too many requests');
    expect(syncErrorMessage('unknown')).toContain('failed');
  });

  it('passes the application-scoped read-write token to the blob SDK', async () => {
    vi.stubEnv('BLOB_HANZI_READ_WRITE_TOKEN', 'hanzi-token');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'global-token');
    mockGet.mockResolvedValueOnce({
      headers: new Headers({ 'content-length': String(backup.length) }),
      stream: new Response(backup).body,
    });

    await readCloudBackup(CODE);
    expect(mockGet).toHaveBeenCalledWith(
      `hanzi-master/progress/${CODE}.json`,
      expect.objectContaining({ access: 'private', token: 'hanzi-token' }),
    );

    await writeCloudBackup(CODE, backup);
    expect(mockPut).toHaveBeenCalledWith(
      `hanzi-master/progress/${CODE}.json`,
      expect.any(String),
      expect.objectContaining({ access: 'private', token: 'hanzi-token' }),
    );
  });

  it('passes the store id for OIDC mode and treats it as configured on Vercel', async () => {
    vi.stubEnv('BLOB_HANZI_READ_WRITE_TOKEN', '');
    vi.stubEnv('BLOB_HANZI_STORE_ID', 'store_hanzi');
    vi.stubEnv('VERCEL', '1');
    expect(syncConfigured()).toBe(true);

    mockGet.mockResolvedValueOnce({
      headers: new Headers({ 'content-length': String(backup.length) }),
      stream: new Response(backup).body,
    });
    await readCloudBackup(CODE);
    const options = mockGet.mock.calls[0][1] as Record<string, unknown>;
    expect(options.storeId).toBe('store_hanzi');
    expect(options).not.toHaveProperty('token');
  });
});
