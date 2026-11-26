// src/hooks/__tests__/useAsyncResource.test.tsx v5.2.61
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAsyncResource } from '../useAsyncResource';

describe('useAsyncResource', () => {
  it('加载中返回 loading，成功后返回 data', async () => {
    const loader = vi.fn().mockResolvedValue({ strokes: ['M0 0'] });
    const { result } = renderHook(() => useAsyncResource(loader, 'char-1'));
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    await waitFor(() => expect(result.current.data).toEqual({ strokes: ['M0 0'] }));
    expect(result.current.loading).toBe(false);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('失败时记录 Error 并保持 loading=false', async () => {
    const loader = vi.fn().mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useAsyncResource(loader, 'char-2'));
    await waitFor(() => expect(result.current.error?.message).toBe('network down'));
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('非 Error 抛出值被归一化为 Error', async () => {
    const loader = vi.fn().mockRejectedValue('oops');
    const { result } = renderHook(() => useAsyncResource(loader, 'char-3'));
    await waitFor(() => expect(result.current.error?.message).toBe('oops'));
  });

  it('失败后 retry 重新执行 loader 并清除错误', async () => {
    const loader = vi
      .fn()
      .mockRejectedValueOnce(new Error('temporary'))
      .mockResolvedValueOnce({ strokes: ['M1 1'] });
    const { result } = renderHook(() => useAsyncResource(loader, 'char-4'));
    await waitFor(() => expect(result.current.error?.message).toBe('temporary'));
    act(() => result.current.retry());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.data).toEqual({ strokes: ['M1 1'] }));
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('key 变化时重新加载并丢弃旧请求结果', async () => {
    let resolveFirst: ((value: string) => void) | undefined;
    const first = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });
    const loader = vi.fn().mockImplementationOnce(() => first).mockResolvedValue('second');
    const { result, rerender } = renderHook(
      ({ key }) => useAsyncResource(loader, key),
      { initialProps: { key: 'first' } }
    );
    rerender({ key: 'second' });
    await waitFor(() => expect(result.current.data).toBe('second'));
    act(() => resolveFirst?.('stale'));
    await act(async () => { await Promise.resolve(); });
    expect(result.current.data).toBe('second');
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('enabled=false 时不发起请求', async () => {
    const loader = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsyncResource(loader, 'char-5', false));
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(loader).not.toHaveBeenCalled();
  });
});
