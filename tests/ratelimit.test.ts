import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Regresión del incidente del 11/08/2026: la base Redis de Upstash desapareció,
 * las variables KV_REST_API_* seguían presentes, y cada llamada a upstash.limit()
 * lanzaba. Como el error se propagaba, /api/contact y /api/chat devolvían 500 a
 * todo el mundo: el rate limiter tumbó justo lo que debía proteger.
 */

const limitMock = vi.fn();

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: Object.assign(
    class {
      limit = limitMock;
    },
    { slidingWindow: () => ({}) }
  ),
}));

vi.mock('@upstash/redis', () => ({
  Redis: class {},
}));

const importFresh = async () => {
  vi.resetModules();
  return (await import('@/lib/ratelimit')).createRateLimiter;
};

describe('createRateLimiter sin Upstash configurado', () => {
  beforeEach(() => {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it('cuenta en memoria y corta al superar el límite', async () => {
    const createRateLimiter = await importFresh();
    const isLimited = createRateLimiter({ prefix: 't', limit: 3, window: '1 m' });

    expect(await isLimited('ip')).toBe(false);
    expect(await isLimited('ip')).toBe(false);
    expect(await isLimited('ip')).toBe(false);
    expect(await isLimited('ip')).toBe(true);
  });

  it('lleva cuentas separadas por identificador', async () => {
    const createRateLimiter = await importFresh();
    const isLimited = createRateLimiter({ prefix: 't', limit: 1, window: '1 m' });

    expect(await isLimited('ip-a')).toBe(false);
    expect(await isLimited('ip-a')).toBe(true);
    expect(await isLimited('ip-b')).toBe(false);
  });
});

describe('createRateLimiter cuando Redis falla', () => {
  beforeEach(() => {
    process.env.KV_REST_API_URL = 'https://ya-no-existe.upstash.io';
    process.env.KV_REST_API_TOKEN = 'token';
    limitMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('NO propaga el error: degrada al contador en memoria', async () => {
    limitMock.mockRejectedValue(new Error('getaddrinfo ENOTFOUND'));
    const createRateLimiter = await importFresh();
    const isLimited = createRateLimiter({ prefix: 't', limit: 2, window: '1 m' });

    // Antes del arreglo esto lanzaba y salía como 500 al usuario.
    await expect(isLimited('ip')).resolves.toBe(false);
    await expect(isLimited('ip')).resolves.toBe(false);
    await expect(isLimited('ip')).resolves.toBe(true); // el fallback sigue limitando
  });

  it('avisa una sola vez por instancia para no inundar los logs', async () => {
    limitMock.mockRejectedValue(new Error('boom'));
    const createRateLimiter = await importFresh();
    const isLimited = createRateLimiter({ prefix: 't', limit: 10, window: '1 m' });

    await isLimited('ip');
    await isLimited('ip');
    await isLimited('ip');

    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('usa Upstash mientras responde', async () => {
    limitMock.mockResolvedValue({ success: true });
    const createRateLimiter = await importFresh();
    const isLimited = createRateLimiter({ prefix: 't', limit: 5, window: '1 m' });

    expect(await isLimited('ip')).toBe(false);
    expect(limitMock).toHaveBeenCalledWith('ip');
  });
});
