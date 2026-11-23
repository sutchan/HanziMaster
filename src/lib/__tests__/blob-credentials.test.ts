// src/lib/__tests__/blob-credentials.test.ts v5.2.59
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  blobAuthOptions, blobConfigured, blobReadWriteToken, blobStoreId,
} from '../blob-credentials';

const stubAll = (values: Record<string, string>) => {
  vi.stubEnv('BLOB_HANZI_READ_WRITE_TOKEN', '');
  vi.stubEnv('BLOB_HANZI_STORE_ID', '');
  vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
  vi.stubEnv('BLOB_STORE_ID', '');
  vi.stubEnv('VERCEL_OIDC_TOKEN', '');
  vi.stubEnv('VERCEL', '');
  for (const [key, value] of Object.entries(values)) vi.stubEnv(key, value);
};

describe('blob-credentials', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefers the application-scoped names over the SDK defaults', () => {
    stubAll({
      BLOB_HANZI_READ_WRITE_TOKEN: ' app-token ',
      BLOB_READ_WRITE_TOKEN: 'global-token',
      BLOB_HANZI_STORE_ID: 'app-store',
      BLOB_STORE_ID: 'global-store',
    });
    expect(blobReadWriteToken()).toBe('app-token');
    expect(blobStoreId()).toBe('app-store');
  });

  it('falls back to the SDK default names when the app-scoped ones are blank', () => {
    stubAll({
      BLOB_HANZI_READ_WRITE_TOKEN: '   ',
      BLOB_READ_WRITE_TOKEN: 'global-token',
      BLOB_HANZI_STORE_ID: '',
      BLOB_STORE_ID: 'global-store',
    });
    expect(blobReadWriteToken()).toBe('global-token');
    expect(blobStoreId()).toBe('global-store');
  });

  it('omits blank credentials from the SDK options', () => {
    stubAll({});
    expect(blobAuthOptions()).toEqual({});
  });

  it('requires OIDC for the store-id-only mode outside Vercel', () => {
    stubAll({ BLOB_HANZI_STORE_ID: 'store_hanzi' });
    expect(blobConfigured()).toBe(false);
    vi.stubEnv('VERCEL_OIDC_TOKEN', 'oidc');
    expect(blobConfigured()).toBe(true);
    vi.stubEnv('VERCEL_OIDC_TOKEN', '');
    vi.stubEnv('VERCEL', '1');
    expect(blobConfigured()).toBe(true);
  });

  it('treats a read-write token as sufficient on its own', () => {
    stubAll({ BLOB_HANZI_READ_WRITE_TOKEN: 'token' });
    expect(blobConfigured()).toBe(true);
  });
});
