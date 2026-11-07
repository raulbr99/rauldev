import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import { getPosts } from '@/lib/blog';
import { CONTENT_UPDATED } from '@/lib/site';

const entries = sitemap();
const lastmod = (url: string) => {
  const entry = entries.find((e) => e.url === url);
  if (!entry) throw new Error(`sin entrada: ${url}`);
  return new Date(entry.lastModified as Date).toISOString().slice(0, 10);
};
const newest = (locale: 'es' | 'en') =>
  [CONTENT_UPDATED, ...getPosts(locale).map((p) => p.updated ?? p.date)].sort().at(-1);

describe('sitemap', () => {
  it('la portada y /blog llevan la fecha del artículo más reciente (o CONTENT_UPDATED si es posterior)', () => {
    expect(lastmod('https://rauldev.dev')).toBe(newest('es'));
    expect(lastmod('https://rauldev.dev/blog')).toBe(newest('es'));
    expect(lastmod('https://rauldev.dev/en')).toBe(newest('en'));
    expect(lastmod('https://rauldev.dev/en/blog')).toBe(newest('en'));
  });

  it('las páginas legales siguen con CONTENT_UPDATED', () => {
    expect(lastmod('https://rauldev.dev/privacidad')).toBe(CONTENT_UPDATED);
  });

  it('cada artículo lleva su propia fecha', () => {
    for (const post of getPosts('es')) {
      expect(lastmod(`https://rauldev.dev/blog/${post.slug}`)).toBe(post.updated ?? post.date);
    }
  });
});
