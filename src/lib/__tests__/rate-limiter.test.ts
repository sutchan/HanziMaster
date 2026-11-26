// src/lib/__tests__/rate-limiter.test.ts v5.2.61
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InMemoryRateLimiter } from '../rate-limiter';

afterEach(() => {
  vi.useRealTimers();
});

describe('InMemoryRateLimiter', () => {
  it('并发调用同 key 时只放行上限内的请求', async () => {
    const limiter = new InMemoryRateLimiter({ autoSweep: false });
    const now = Date.now();
    const results = await Promise.all(
      Array.from({ length: 60 }, () => Promise.resolve().then(() => limiter.allow('sync-code', now))),
    );
    expect(results.filter(Boolean)).toHaveLength(30);
    expect(limiter.allow('sync-code', now + 1_000)).toBe(false);
    limiter.dispose();
  });

  it('过期桶不再计数，sweep 可主动清理', () => {
    const limiter = new InMemoryRateLimiter({ autoSweep: false });
    const now = Date.now();
    for (let i = 0; i < 30; i += 1) expect(limiter.allow('expired', now)).toBe(true);
    expect(limiter.allow('expired', now + 1)).toBe(false);
    // 窗口过期后计数重置，但旧桶仍在，直到 sweep 清理
    expect(limiter.allow('expired', now + 60_000)).toBe(true);
    expect(limiter.size).toBe(1);
    expect(limiter.sweep(now + 120_000)).toBe(1);
    expect(limiter.size).toBe(0);
    limiter.dispose();
  });

  it('定时 sweep 自动移除过期桶', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-26T00:00:00Z'));
    const limiter = new InMemoryRateLimiter({ sweepIntervalMs: 1_000 });
    limiter.allow('auto');
    expect(limiter.size).toBe(1);
    vi.advanceTimersByTime(61_000);
    expect(limiter.size).toBe(0);
    limiter.dispose();
  });

  it('桶数量达到上限时淘汰最早插入的桶', () => {
    const limiter = new InMemoryRateLimiter({ maxKeys: 2, autoSweep: false });
    const now = Date.now();
    limiter.allow('a', now);
    limiter.allow('b', now);
    limiter.allow('c', now);
    expect(limiter.size).toBe(2);
    expect(limiter.has('a')).toBe(false);
    expect(limiter.has('b')).toBe(true);
    expect(limiter.has('c')).toBe(true);
    limiter.dispose();
  });
});
