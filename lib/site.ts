import type { Metadata } from 'next';

/**
 * Canonical origin of the site. Single source of truth for every absolute URL
 * (metadata, sitemap, robots, JSON-LD) so canonicals never point at a redirect.
 */
export const SITE_URL = 'https://rauldev.dev';

/**
 * Fecha de la última revisión del contenido (no cambia en cada build). La
 * usan el sitemap y el JSON-LD (`dateModified`).
 */
export const CONTENT_UPDATED = '2026-11-06';

/** Nombre real del titular: el mismo en <title>, JSON-LD, manifest y pie. */
export const SITE_OWNER = 'Raúl Berná';

/** Perfiles públicos de Raúl: los mismos en la portada, el blog y el pie. */
export const SOCIAL_URLS = {
  x: 'https://x.com/sr_rauldev',
  instagram: 'https://www.instagram.com/raulberna.dev/',
  linkedin: 'https://www.linkedin.com/in/raul-berna-riera',
  github: 'https://github.com/raulbr99',
} as const;

/** RSS del blog de cada idioma: `/feed.xml` (español) y `/en/feed.xml`. */
export function feedPath(locale: string): string {
  return locale === 'en' ? '/en/feed.xml' : '/feed.xml';
}

export function feedUrl(locale: string): string {
  return `${SITE_URL}${feedPath(locale)}`;
}

export const FEED_TITLE = `${SITE_OWNER}: blog`;

/**
 * `<link rel="alternate" type="application/rss+xml">` para que navegadores y
 * lectores de feeds encuentren el RSS desde cualquier página.
 */
export function feedTypes(locale: string): NonNullable<NonNullable<Metadata['alternates']>['types']> {
  return { 'application/rss+xml': [{ url: feedUrl(locale), title: FEED_TITLE }] };
}

/** Absolute URL for a path in a given locale (`es` is the default, unprefixed). */
export function localeUrl(locale: string, path = ''): string {
  return `${SITE_URL}${locale === 'en' ? '/en' : ''}${path}`;
}

/**
 * Canonical + hreflang de una ruta. Next no fusiona `alternates` entre layout
 * y página (lo sustituye entero), así que cada página lo declara con este
 * helper para que ninguna pierda las alternativas de idioma.
 */
export function alternatesFor(locale: string, path = ''): NonNullable<Metadata['alternates']> {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      es: localeUrl('es', path),
      en: localeUrl('en', path),
      'x-default': localeUrl('es', path),
    },
    types: feedTypes(locale),
  };
}

/**
 * Título, descripción y texto alternativo de la imagen social de la portada.
 * El layout los usa como valores por defecto y la portada para su Open Graph.
 */
export function homeSeo(locale: string): { title: string; description: string; ogImageAlt: string } {
  const isSpanish = locale !== 'en';
  return {
    title: isSpanish
      ? `${SITE_OWNER} — Full Stack Developer (React, Next.js, Node.js, IA) | Alicante`
      : `${SITE_OWNER} — Full Stack Developer (React, Next.js, Node.js, AI) | Alicante, Spain`,
    description: isSpanish
      ? 'Full Stack Developer 4+ años: React, Next.js, Node.js, IA conversacional. Talkrev y PartsNow.ai (50k+ piezas). Alicante.'
      : 'Full Stack Developer 4+ years: React, Next.js, Node.js, Conversational AI. Talkrev & PartsNow.ai (50k+ parts). Alicante, Spain.',
    ogImageAlt: isSpanish
      ? `${SITE_OWNER}, desarrollador full stack en Alicante: apps web, bots y herramientas de IA`
      : `${SITE_OWNER}, full-stack developer in Alicante, Spain: web apps, bots and AI tools`,
  };
}
