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
  // Vercel's Upstash marketplace integration injects KV_REST_API_*; keep
  // UPSTASH_REDIS_REST_* as a fallback for portability.
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  const upstash =
    url && token
      ? new Ratelimit({
          redis: new Redis({ url, token }),
          limiter: Ratelimit.slidingWindow(limit, window),
          prefix,
          analytics: true,
        })
      : null;

  const [count, unit] = window.split(' ');
  const windowMs = Number(count) * (WINDOW_MS[unit] ?? 60_000);
  const store = new Map<string, { count: number; reset: number }>();

  // Se avisa una sola vez por instancia para no inundar los logs.
  let warned = false;

  return async function isLimited(id: string): Promise<boolean> {
    if (upstash) {
      try {
        const { success } = await upstash.limit(id);
        return !success;
      } catch (error) {
        // Si Redis no responde (borrado, caído, credenciales caducadas) NO se
        // puede tumbar la ruta que este limitador debía proteger: se degrada al
        // contador en memoria. Es más débil en serverless, pero mantiene vivo
        // el formulario de contacto y el chat.
        if (!warned) {
          warned = true;
          console.error(`[ratelimit:${prefix}] Upstash no disponible, usando fallback en memoria`, error);
        }
      }
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
