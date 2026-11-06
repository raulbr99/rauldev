import type { Locale } from '@/i18n/config';
import type { PostMeta } from '@/lib/blog';
import { FEED_TITLE, SITE_OWNER, SITE_URL, feedUrl, localeUrl } from '@/lib/site';

/** Escapa lo que no puede ir tal cual dentro de un nodo o atributo XML. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** `2026-11-06` → `Fri, 06 Nov 2026 00:00:00 GMT` (RFC 822, el formato que pide RSS 2.0). */
export function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00.000Z`).toUTCString();
}

/**
 * RSS 2.0 del blog en un idioma. La fecha del canal sale del artículo más
 * reciente, no del reloj del build: así el feed solo cambia cuando cambia el
 * contenido y los lectores no ven «actualizado» en cada despliegue.
 */
export function buildFeed(locale: Locale, posts: PostMeta[], description: string): string {
  const isSpanish = locale === 'es';
  const blogUrl = localeUrl(locale, '/blog');
  const latest = posts[0];
  const lastBuild = latest ? rfc822(latest.updated ?? latest.date) : undefined;

  const items = posts
    .map((post) => {
      const url = localeUrl(locale, `/blog/${post.slug}`);
      const categories = post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n');
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rfc822(post.date)}</pubDate>`,
        `      <dc:creator>${escapeXml(SITE_OWNER)}</dc:creator>`,
        `      <description>${escapeXml(post.description)}</description>`,
        categories,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${escapeXml(FEED_TITLE)}</title>`,
    `    <link>${blogUrl}</link>`,
    `    <atom:link href="${feedUrl(locale)}" rel="self" type="application/rss+xml"/>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>${isSpanish ? 'es-ES' : 'en'}</language>`,
    lastBuild ? `    <lastBuildDate>${lastBuild}</lastBuildDate>` : '',
    `    <image>`,
    `      <url>${SITE_URL}/icon-192.png</url>`,
    `      <title>${escapeXml(FEED_TITLE)}</title>`,
    `      <link>${blogUrl}</link>`,
    `    </image>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ]
    .filter((line) => line !== '')
    .join('\n')
    .concat('\n');
}
