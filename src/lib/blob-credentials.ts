// src/lib/blob-credentials.ts v5.2.59
// Vercel Blob 凭证单一来源：把应用自有变量名（BLOB_HANZI_*）显式映射成 @vercel/blob 的调用选项。
// SDK 默认只认 BLOB_READ_WRITE_TOKEN / BLOB_STORE_ID，不显式传入时自定义变量名不会生效。

/** 读取并 trim 环境变量；空串视为未配置（与 SDK 的 readEnv 语义一致）。 */
const readEnv = (name: string): string => {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
};

/** 读写令牌：应用自有变量名优先，兼容 SDK 约定的全局名。 */
export const blobReadWriteToken = (): string =>
  readEnv('BLOB_HANZI_READ_WRITE_TOKEN') || readEnv('BLOB_READ_WRITE_TOKEN');

/** Store ID：应用自有变量名优先，兼容 SDK 约定的全局名。 */
export const blobStoreId = (): string =>
  readEnv('BLOB_HANZI_STORE_ID') || readEnv('BLOB_STORE_ID');

/**
 * 传给 @vercel/blob 的鉴权选项。
 * 空值一律不传：SDK 把非空 token 视为 read-write 模式，空串会被当成「未配置」而静默回退到全局变量名。
 */
export const blobAuthOptions = (): { token?: string; storeId?: string } => {
  const token = blobReadWriteToken();
  const storeId = blobStoreId();
  return {
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
  };
};

/**
 * 云同步是否可用：
 * - 有读写令牌：直接可用；
 * - 只有 Store ID：走 Vercel OIDC（平台运行时自动注入 OIDC token）；
 *   本地 / CI 需显式提供 VERCEL_OIDC_TOKEN 才视为可用，否则 /api/progress 保持 503 降级。
 */
export const blobConfigured = (): boolean => {
  if (blobReadWriteToken()) return true;
  if (!blobStoreId()) return false;
  return Boolean(readEnv('VERCEL_OIDC_TOKEN')) || readEnv('VERCEL') === '1';
};
