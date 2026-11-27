// src/lib/cloud-sync-client.ts v5.3.0
// 客户端云同步工具：复制回退与错误码解析；不引入服务端依赖，不使用 any。
import { isSyncErrorCode, type SyncErrorCode } from '@/lib/api-errors';

export type CopyOutcome = 'clipboard' | 'selection' | 'failed';
export type SyncClientErrorCode = SyncErrorCode | 'request_failed' | 'storage_failed';

export class SyncRequestError extends Error {
  constructor(readonly code: SyncClientErrorCode) {
    super(code);
    this.name = 'SyncRequestError';
  }
}

/**
 * Clipboard API 不可用时回退到 input.select + execCommand；
 * 两者都失败时返回 failed，由调用方 toast 提示并高亮同步码文本。
 */
export async function copyWithFallback(text: string, input?: HTMLInputElement | null): Promise<CopyOutcome> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return 'clipboard';
    } catch {
      // Clipboard 权限被拒时继续走选择复制回退
    }
  }
  if (input) {
    try {
      input.focus();
      input.select();
      // execCommand 虽已弃用，但仍是浏览器阻止 Clipboard API 时最后的可编程回退
      if (document.execCommand('copy')) return 'selection';
    } catch {
      // 回退也失败，交由调用方提示用户手动复制
    }
  }
  return 'failed';
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : null;

/** 仅识别 api-errors 声明的码，未知码统一退化为通用请求失败。 */
export const extractSyncErrorCode = (payload: unknown): SyncErrorCode | null => {
  const error = asRecord(payload)?.error;
  return isSyncErrorCode(error) ? error : null;
};

/** 同步码只经 POST 请求体传递；错误以 code 而非 message 字符串供客户端分支。 */
export async function postSyncRequest(code: string, backup?: string): Promise<{ backup?: string }> {
  let response: Response;
  try {
    response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backup === undefined ? { code } : { code, backup }),
    });
  } catch {
    throw new SyncRequestError('request_failed');
  }

  if (!response.ok) {
    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      // 非 JSON 错误响应按通用失败处理
    }
    throw new SyncRequestError(extractSyncErrorCode(payload) ?? 'request_failed');
  }

  try {
    const payload: unknown = await response.json();
    const backupValue = asRecord(payload)?.backup;
    return typeof backupValue === 'string' ? { backup: backupValue } : {};
  } catch {
    throw new SyncRequestError('request_failed');
  }
}
