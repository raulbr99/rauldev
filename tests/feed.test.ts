import { describe, it, expect } from 'vitest';
import { buildFeed, escapeXml, rfc822 } from '@/lib/feed';
import type { PostMeta } from '@/lib/blog';

const post = (over: Partial<PostMeta> = {}): PostMeta => ({
  slug: 'callosa-voxels',
  title: 'Callosa de Segura en cubos de 1 metro',
  description: 'Con LiDAR & <datos> abiertos',
  date: '2026-11-06',
  tags: ['3d', 'lidar'],
  readingMinutes: 3,
  ...over,
});

describe('escapeXml', () => {
  it('escapa los cinco caracteres reservados', () => {
    expect(escapeXml(`a & b < c > "d" 'e'`)).toBe('a &amp; b &lt; c &gt; &quot;d&quot; &apos;e&apos;');
  });
});

describe('rfc822', () => {
  it('convierte la fecha ISO del artículo al formato de RSS', () => {
    expect(rfc822('2026-11-06')).toBe('Fri, 06 Nov 2026 00:00:00 GMT');
  });
});

describe('buildFeed', () => {
  it('español: enlaces sin prefijo, feed propio en atom:link y texto escapado', () => {
    const xml = buildFeed('es', [post()], 'Artículos');
    expect(xml).toContain('<link>https://rauldev.dev/blog</link>');
    expect(xml).toContain('<atom:link href="https://rauldev.dev/feed.xml" rel="self"');
    expect(xml).toContain('<guid isPermaLink="true">https://rauldev.dev/blog/callosa-voxels</guid>');
    expect(xml).toContain('Con LiDAR &amp; &lt;datos&gt; abiertos');
    expect(xml).toContain('<category>lidar</category>');
    expect(xml).toContain('<language>es-ES</language>');
  });

  it('inglés: todo bajo /en', () => {
    const xml = buildFeed('en', [post()], 'Articles');
    expect(xml).toContain('<link>https://rauldev.dev/en/blog/callosa-voxels</link>');
    expect(xml).toContain('href="https://rauldev.dev/en/feed.xml"');
  });

  it('la fecha del canal es la del artículo más reciente (o su revisión), no la del build', () => {
    const xml = buildFeed('es', [post({ updated: '2026-11-07' }), post({ slug: 'otro', date: '2026-10-01' })], 'x');
    expect(xml).toContain('<lastBuildDate>Sat, 07 Nov 2026 00:00:00 GMT</lastBuildDate>');
  });

  it('sin artículos sigue siendo un canal válido, sin lastBuildDate', () => {
    const xml = buildFeed('es', [], 'x');
    expect(xml).not.toContain('lastBuildDate');
    expect(xml).not.toContain('<item>');
    expect(xml.trim().endsWith('</rss>')).toBe(true);
  });
});
