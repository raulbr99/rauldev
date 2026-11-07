import fs from 'node:fs';
import path from 'node:path';
import type { Locale } from '@/i18n/config';
import { CONTENT_UPDATED } from '@/lib/site';

/**
 * Los artículos son archivos Markdown en `content/blog/<locale>/<slug>.md`.
 * El nombre del archivo es el slug. Un artículo existe solo en los idiomas
 * cuya carpeta lo contiene: no hay traducción automática ni fallback.
 */
const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const WORDS_PER_MINUTE = 200;

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO YYYY-MM-DD. */
  date: string;
  /** ISO YYYY-MM-DD; solo si el artículo se revisó después de publicarse. */
  updated?: string;
  tags: string[];
  readingMinutes: number;
}

export interface Post extends PostMeta {
  body: string;
}

interface Frontmatter {
  data: Record<string, string>;
  body: string;
}

function unquote(value: string): string {
  const v = value.trim();
  if (v.length >= 2 && (v[0] === '"' || v[0] === "'") && v.endsWith(v[0])) {
    return v.slice(1, -1);
  }
  return v;
}

/** Separa el bloque `---` inicial (pares `clave: valor`) del cuerpo. */
export function parseFrontmatter(source: string): Frontmatter {
  const match = source.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: source };

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    data[line.slice(0, idx).trim()] = unquote(line.slice(idx + 1));
  }
  return { data, body: match[2] };
}

/** `[ia, agentes]` o `ia, agentes` → ['ia', 'agentes']. */
export function parseTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((tag) => unquote(tag))
    .filter(Boolean);
}

export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Construye un artículo o lanza si le falta algo: un error de build vale más que una página rota. */
export function buildPost(slug: string, source: string): Post & { draft: boolean } {
  const fail = (reason: string): never => {
    throw new Error(`Artículo "${slug}": ${reason}`);
  };

  if (!SLUG_RE.test(slug)) fail('el nombre del archivo debe ser minúsculas, números y guiones');

  const { data, body } = parseFrontmatter(source);
  if (!data.title) fail('falta `title`');
  if (!data.description) fail('falta `description`');
  if (!data.date || !DATE_RE.test(data.date)) fail('`date` debe ser YYYY-MM-DD');
  if (data.updated && !DATE_RE.test(data.updated)) fail('`updated` debe ser YYYY-MM-DD');

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    updated: data.updated || undefined,
    tags: parseTags(data.tags),
    readingMinutes: readingMinutes(body),
    body: body.trim(),
    draft: data.draft === 'true',
  };
}

function loadAll(locale: Locale): Post[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  const isProd = process.env.NODE_ENV === 'production';

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => buildPost(file.slice(0, -3), fs.readFileSync(path.join(dir, file), 'utf8')))
    // Los borradores se ven en `next dev` y nunca llegan a producción.
    .filter((post) => !(isProd && post.draft))
    .map(({ draft, ...post }) => {
      void draft;
      return post;
    });
}

/** Más recientes primero. */
export function getPosts(locale: Locale): PostMeta[] {
  return loadAll(locale)
    .map(({ body, ...meta }) => {
      void body;
      return meta;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(locale: Locale, slug: string): Post | undefined {
  return loadAll(locale).find((post) => post.slug === slug);
}

/**
 * Artículos para «Sigue leyendo»: primero los que comparten más etiquetas con
 * el actual y, a igualdad, los más recientes. Nunca el propio artículo.
 */
export function pickRelated(posts: PostMeta[], current: PostMeta, count = 2): PostMeta[] {
  const tags = new Set(current.tags);
  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({ post, shared: post.tags.filter((tag) => tags.has(tag)).length }))
    .sort((a, b) => b.shared - a.shared || b.post.date.localeCompare(a.post.date))
    .slice(0, count)
    .map(({ post }) => post);
}

const LOCAL_IMAGE_RE = /!\[[^\]]*\]\((\/blog\/[^)\s]+\.(?:jpe?g|png|webp|avif|gif))(?:\s+"[^"]*")?\)/gi;

/** Imágenes locales del cuerpo (`![…](/blog/…)`), en orden de aparición y sin repetir. */
export function localImages(body: string): string[] {
  return [...new Set(Array.from(body.matchAll(LOCAL_IMAGE_RE), (match) => match[1]))];
}

/**
 * Última vez que cambió lo que enseñan la portada y /blog en un idioma (ISO
 * YYYY-MM-DD): lo más reciente entre CONTENT_UPDATED y el último artículo
 * publicado o revisado. Así publicar un artículo actualiza la fecha sin tocar
 * CONTENT_UPDATED a mano.
 */
export function latestUpdate(locale: Locale): string {
  const dates = getPosts(locale).map((post) => post.updated ?? post.date);
  return [CONTENT_UPDATED, ...dates].sort().at(-1) as string;
}

/** Portada de un artículo en las listas: su primera imagen local, o null. */
export function postCover(locale: Locale, slug: string): string | null {
  return localImages(getPost(locale, slug)?.body ?? '')[0] ?? null;
}

/** `Lo que cambia respecto a Alicante` → `lo-que-cambia-respecto-a-alicante` (id de un apartado). */
export function headingId(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface PostHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Texto de un título de Markdown tal como lo pinta react-markdown: sin `**`, `_`, comillas de código ni enlaces. */
function headingText(markdown: string): string {
  // El código en línea va tal cual (un `mi_var` conserva su guion bajo); el resto pierde las marcas.
  return markdown
    .split(/(`[^`]*`)/)
    .map((part) =>
      part.startsWith('`') && part.endsWith('`') && part.length > 1
        ? part.slice(1, -1)
        : part
            .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/(\*\*|__)(.+?)\1/g, '$2')
            .replace(/\*(.+?)\*/g, '$1')
            .replace(/(^|[^\p{L}\p{N}])_(.+?)_(?=[^\p{L}\p{N}]|$)/gu, '$1$2'),
    )
    .join('')
    .trim();
}

/**
 * Apartados de un artículo (`#`/`##` → nivel 2, `###` → nivel 3) con el mismo
 * id que les pone PostBody al pintarlos, para el índice de arriba. Lo que va
 * dentro de un bloque de código no cuenta.
 */
export function postHeadings(body: string): PostHeading[] {
  const headings: PostHeading[] = [];
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s{0,3}(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = line.match(/^\s{0,3}(#{1,3})\s+(.+?)(?:\s+#+)?\s*$/);
    if (!match) continue;
    const text = headingText(match[2]);
    const id = headingId(text);
    if (id) headings.push({ id, text, level: match[1].length === 3 ? 3 : 2 });
  }
  return headings;
}
