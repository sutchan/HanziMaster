// src/lib/__tests__/cloud-sync-server.test.ts v5.2.59
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGet, mockPut } = vi.hoisted(() => ({ mockGet: vi.fn(), mockPut: vi.fn() }));
vi.mock('@vercel/blob', () => ({ get: mockGet, put: mockPut }));

import {
  rateLimit, readCloudBackup, writeCloudBackup, syncConfigured, syncErrorMessage,
} from '../cloud-sync-server';

const CODE = 'a'.repeat(32);
const backup = JSON.stringify({
  app: 'hanzi-master',
  version: 1,
  exportedAt: new Date().toISOString(),
  progress: {
    learnedCharIds: ['yong'],
    quizResults: [{ charId: 'yong', correct: true, at: '2026-11-23T00:00:00.000Z' }],
    dailyActivity: {},
    streak: 1,
    accuracy: 1,
  },
});

describe('cloud-sync-server', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPut.mockReset();
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'token');
  });

  it('rate-limits per sync code within a 60s window', () => {
    const key = `test-${Date.now()}`;
    const now = Date.now();
    for (let i = 0; i < 30; i++) expect(rateLimit(key, now)).toBe(true);
    expect(rateLimit(key, now + 1000)).toBe(false);
    expect(rateLimit(key, now + 61_000)).toBe(true);
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
      app: 'hanzi-master', version: 1, exportedAt: new Date().toISOString(),
      progress: { learnedCharIds: [], quizResults: [], dailyActivity: {}, streak: 0, accuracy: 0 },
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
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    vi.stubEnv('BLOB_STORE_ID', '');
    expect(syncConfigured()).toBe(false);
    expect(syncErrorMessage('rate_limited')).toBe('Too many requests');
    expect(syncErrorMessage('unknown')).toContain('failed');
  });
});
