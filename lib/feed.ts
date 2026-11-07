import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import type { Locale } from '@/i18n/config';
import type { PostMeta } from '@/lib/blog';
import { FEED_TITLE, SITE_OWNER, SITE_URL, feedUrl, localeUrl, postImageUrl } from '@/lib/site';

/** Un artículo del feed; con `body`, el feed lleva el artículo entero. */
export type FeedPost = PostMeta & { body?: string };

interface HastNode {
  type: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/** `/blog/x.jpg` → `https://rauldev.dev/blog/x.jpg`: un lector de RSS no sabe de qué web viene el HTML. */
function absolutize(node: HastNode): void {
  if (node.type === 'element' && node.properties) {
    for (const key of ['href', 'src']) {
      const value = node.properties[key];
      if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
        node.properties[key] = `${SITE_URL}${value}`;
      }
    }
  }
  node.children?.forEach(absolutize);
}

const toHtml = unified()
  .use(remarkParse)
  .use(remarkGfm)
  // Sin allowDangerousHtml: el HTML escrito dentro del Markdown se descarta, igual que en la web.
  .use(remarkRehype)
  .use(() => (tree: HastNode) => absolutize(tree))
  .use(rehypeStringify);

/** Markdown del artículo → HTML con URLs absolutas, para `content:encoded`. */
export function markdownToHtml(markdown: string): string {
  return String(toHtml.processSync(markdown));
}

/** Mete texto en un CDATA aunque contenga `]]>` (lo parte en dos bloques). */
export function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

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
 * RSS 2.0 del blog en un idioma, con cada artículo entero (`content:encoded`)
 * para leerlo sin salir del lector. La fecha del canal sale del artículo más
 * reciente, no del reloj del build: así el feed solo cambia cuando cambia el
 * contenido y los lectores no ven «actualizado» en cada despliegue.
 */
export function buildFeed(locale: Locale, posts: FeedPost[], description: string): string {
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
        post.body ? `      <content:encoded>${cdata(markdownToHtml(post.body))}</content:encoded>` : '',
        // Miniatura para el lector (la misma imagen que al compartir el artículo).
        `      <media:content url="${postImageUrl(locale, post.slug)}" medium="image" type="image/png" width="1200" height="630"/>`,
        categories,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">',
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
