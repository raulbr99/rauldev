import type { Metadata } from 'next';

/**
 * Canonical origin of the site. Single source of truth for every absolute URL
 * (metadata, sitemap, robots, JSON-LD) so canonicals never point at a redirect.
 */
export const SITE_URL = 'https://rauldev.dev';

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
