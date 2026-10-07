import fs from 'node:fs';
import path from 'node:path';
import type { Locale } from '@/i18n/config';

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
