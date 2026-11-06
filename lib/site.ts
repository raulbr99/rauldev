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
export const CONTENT_UPDATED = '2026-09-16';

/** Nombre real del titular: el mismo en <title>, JSON-LD, manifest y pie. */
export const SITE_OWNER = 'Raúl Berná';

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
