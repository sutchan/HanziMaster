// src/lib/rate-limiter.ts v5.2.61
// 限流抽象与内存实现：默认用于本地/单实例；分布式实现由外部注入，不在此模块伪造完成。

/** 限流器契约。allow 必须同步且判定过程中不得 await，保证并发调用串行原子化。 */
export interface RateLimiter {
  allow(key: string, now?: number): boolean;
}

export interface MemoryRateLimiterOptions {
  windowMs?: number;
  maxRequests?: number;
  /** 桶数量硬上限，防止随机同步码无限灌入 Map。 */
  maxKeys?: number;
  /** 定时 sweep 间隔；每次 allow 也会按该间隔惰性触发，覆盖 Serverless 定时器不运行的场景。 */
  sweepIntervalMs?: number;
  autoSweep?: boolean;
}

interface Bucket {
  start: number;
  count: number;
}

const DEFAULTS = {
  windowMs: 60_000,
  maxRequests: 30,
  maxKeys: 10_000,
  sweepIntervalMs: 5 * 60_000,
  autoSweep: true,
} as const;

export class InMemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>();
  private readonly options: Required<MemoryRateLimiterOptions>;
  private lastSweep = 0;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(options: MemoryRateLimiterOptions = {}) {
    this.options = { ...DEFAULTS, ...options };
    if (this.options.autoSweep) {
      const handle = setInterval(() => this.sweep(Date.now()), this.options.sweepIntervalMs);
      // Node 下 unref 防止定时器阻止进程退出；浏览器无该方法时安全跳过。
      (handle as unknown as { unref?: () => void }).unref?.();
      this.timer = handle;
    }
  }

  allow(key: string, now = Date.now()): boolean {
    if (now - this.lastSweep >= this.options.sweepIntervalMs) this.sweep(now);
    const bucket = this.buckets.get(key);
    if (!bucket || now - bucket.start >= this.options.windowMs) {
      // 先清理再插入，避免先增后删把当前桶淘汰；同步代码无 await，故并发调用天然互斥。
      this.enforceKeyLimit(now);
      this.buckets.set(key, { start: now, count: 1 });
      return true;
    }
    if (bucket.count >= this.options.maxRequests) return false;
    bucket.count += 1;
    return true;
  }

  /** 删除过期桶并返回清理数量；手动调用与定时器共用同一逻辑。 */
  sweep(now = Date.now()): number {
    this.lastSweep = now;
    let removed = 0;
    for (const [key, bucket] of this.buckets) {
      if (now - bucket.start < this.options.windowMs) continue;
      this.buckets.delete(key);
      removed += 1;
    }
    return removed;
  }

  has(key: string): boolean {
    return this.buckets.has(key);
  }

  get size(): number {
    return this.buckets.size;
  }

  dispose(): void {
    if (this.timer === null) return;
    clearInterval(this.timer);
    this.timer = null;
  }

  private enforceKeyLimit(now: number): void {
    if (this.buckets.size < this.options.maxKeys) return;
    this.sweep(now);
    let excess = this.buckets.size - this.options.maxKeys;
    if (excess <= 0) return;
    // Map 迭代顺序即插入顺序：超限时淘汰最早写入的桶。
    for (const key of this.buckets.keys()) {
      if (excess <= 0) break;
      this.buckets.delete(key);
      excess -= 1;
    }
  }
}
