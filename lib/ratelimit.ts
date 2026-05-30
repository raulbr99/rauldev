import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type Duration = `${number} s` | `${number} m` | `${number} h`;

interface Options {
  /** Namespace prefix in Redis, e.g. "ratelimit:chat". */
  prefix: string;
  /** Allowed requests per window. */
  limit: number;
  /** Sliding window, e.g. "1 m". */
  window: Duration;
}

const WINDOW_MS: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000 };

/**
 * Returns an `isLimited(id)` checker. Uses Upstash Redis when configured
 * (required for serverless: memory isn't shared between instances), and falls
 * back to an in-memory limiter (with eviction) for local development.
 */
export function createRateLimiter({ prefix, limit, window }: Options) {
  const upstash =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
      ? new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(limit, window),
          prefix,
          analytics: true,
        })
      : null;

  const [count, unit] = window.split(' ');
  const windowMs = Number(count) * (WINDOW_MS[unit] ?? 60_000);
  const store = new Map<string, { count: number; reset: number }>();

  return async function isLimited(id: string): Promise<boolean> {
    if (upstash) {
      const { success } = await upstash.limit(id);
      return !success;
    }
    const now = Date.now();
    for (const [key, rec] of store) {
      if (now > rec.reset) store.delete(key);
    }
    const rec = store.get(id);
    if (!rec || now > rec.reset) {
      store.set(id, { count: 1, reset: now + windowMs });
      return false;
    }
    if (rec.count >= limit) return true;
    rec.count++;
    return false;
  };
}
