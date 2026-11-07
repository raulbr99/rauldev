import { describe, it, expect, vi } from 'vitest';

// Caso que se quiere evitar: se publica un artículo y nadie toca CONTENT_UPDATED.
vi.mock('@/lib/site', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/site')>()),
  CONTENT_UPDATED: '2026-01-01',
}));

const { default: sitemap } = await import('@/app/sitemap');
const { getPosts } = await import('@/lib/blog');

const lastmod = (url: string) =>
  new Date(sitemap().find((e) => e.url === url)!.lastModified as Date).toISOString().slice(0, 10);

describe('sitemap con CONTENT_UPDATED atrasado', () => {
  it('la portada y /blog siguen al último artículo; lo legal se queda en CONTENT_UPDATED', () => {
    const newest = getPosts('es').map((p) => p.updated ?? p.date).sort().at(-1);
    expect(newest! > '2026-01-01').toBe(true);
    expect(lastmod('https://rauldev.dev')).toBe(newest);
    expect(lastmod('https://rauldev.dev/blog')).toBe(newest);
    expect(lastmod('https://rauldev.dev/privacidad')).toBe('2026-01-01');
  });
});
