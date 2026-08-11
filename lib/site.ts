/**
 * Canonical origin of the site. Single source of truth for every absolute URL
 * (metadata, sitemap, robots, JSON-LD) so canonicals never point at a redirect.
 */
export const SITE_URL = 'https://rauldev.dev';

/** Absolute URL for a path in a given locale (`es` is the default, unprefixed). */
export function localeUrl(locale: string, path = ''): string {
  return `${SITE_URL}${locale === 'en' ? '/en' : ''}${path}`;
}
