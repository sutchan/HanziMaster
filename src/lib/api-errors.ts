// src/lib/api-errors.ts v5.2.61
// API 错误码单一来源：code → HTTP 状态 / i18n key / 英文兜底文案。服务端与客户端共用，禁止另行硬编码。
import type { TranslationKey } from '@/lib/i18n';

export const SYNC_ERROR_CODES = [
  'not_configured',
  'invalid_json',
  'use_post',
  'invalid_code',
  'invalid_backup',
  'rate_limited',
  'not_found',
  'too_large',
  'empty_backup',
  'empty_progress',
  'read_failed',
  'write_failed',
] as const;

export type SyncErrorCode = (typeof SYNC_ERROR_CODES)[number];

export type SyncErrorDefinition = {
  status: number;
  messageKey: TranslationKey;
  /** 无 i18n 上下文的 API 调用方仍能读到稳定英文消息。 */
  fallbackMessage: string;
};

export const SYNC_ERRORS: Record<SyncErrorCode, SyncErrorDefinition> = {
  not_configured: { status: 503, messageKey: 'cloud.errors.notConfigured', fallbackMessage: 'Cloud sync is not configured' },
  invalid_json: { status: 400, messageKey: 'cloud.errors.invalidJson', fallbackMessage: 'Invalid JSON request body' },
  use_post: { status: 405, messageKey: 'cloud.errors.usePost', fallbackMessage: 'Use POST for cloud sync requests' },
  invalid_code: { status: 400, messageKey: 'cloud.errors.invalidCode', fallbackMessage: 'Invalid sync code' },
  invalid_backup: { status: 400, messageKey: 'cloud.errors.invalidBackup', fallbackMessage: 'Invalid backup payload' },
  rate_limited: { status: 429, messageKey: 'cloud.errors.rateLimited', fallbackMessage: 'Too many requests' },
  not_found: { status: 404, messageKey: 'cloud.errors.notFound', fallbackMessage: 'No cloud progress for this code' },
  too_large: { status: 413, messageKey: 'cloud.errors.tooLarge', fallbackMessage: 'Backup exceeds size limit' },
  empty_backup: { status: 502, messageKey: 'cloud.errors.emptyBackup', fallbackMessage: 'Cloud backup contains no progress' },
  empty_progress: { status: 400, messageKey: 'cloud.errors.emptyProgress', fallbackMessage: 'Refusing to overwrite cloud progress with empty data' },
  read_failed: { status: 502, messageKey: 'cloud.errors.readFailed', fallbackMessage: 'Failed to read cloud progress' },
  write_failed: { status: 502, messageKey: 'cloud.errors.writeFailed', fallbackMessage: 'Failed to write cloud progress' },
};

/** 仅接受本模块声明的服务端码，防止响应体中的任意字符串被当作 i18n key。 */
export const isSyncErrorCode = (value: unknown): value is SyncErrorCode =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(SYNC_ERRORS, value);

export const syncErrorFallbackMessage = (code: string): string =>
  isSyncErrorCode(code) ? SYNC_ERRORS[code].fallbackMessage : 'Cloud sync request failed';
