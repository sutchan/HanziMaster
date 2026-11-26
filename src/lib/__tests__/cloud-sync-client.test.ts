// src/lib/__tests__/cloud-sync-client.test.ts v5.2.61
import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyWithFallback, extractSyncErrorCode } from '../cloud-sync-client';

/** jsdom 未实现 execCommand，测试中显式提供可 spy 的桩。 */
const setExecCommand = (result: boolean) => {
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: vi.fn(() => result),
  });
};

const setClipboard = (writeText: (text: string) => Promise<void>) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText } satisfies Pick<Clipboard, 'writeText'>,
  });
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('copyWithFallback', () => {
  it('Clipboard 失败后回退到选中输入并调用 execCommand', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    setExecCommand(true);
    const exec = vi.spyOn(document, 'execCommand');
    const input = document.createElement('input');
    document.body.appendChild(input);
    const select = vi.spyOn(input, 'select');

    await expect(copyWithFallback('code', input)).resolves.toBe('selection');
    expect(select).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenCalledWith('copy');
    input.remove();
  });

  it('两种复制方式都失败时返回 failed', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    setExecCommand(false);
    await expect(copyWithFallback('code')).resolves.toBe('failed');
  });

  it('只接受已映射的服务端错误码', () => {
    expect(extractSyncErrorCode({ error: 'rate_limited' })).toBe('rate_limited');
    expect(extractSyncErrorCode({ error: '__proto__' })).toBeNull();
    expect(extractSyncErrorCode({ error: 'random_string' })).toBeNull();
    expect(extractSyncErrorCode(null)).toBeNull();
  });
});
