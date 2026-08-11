import { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { SITE_URL, localeUrl } from '@/lib/site'

/**
 * Solo URLs reales: los fragmentos (#seccion) no son URLs para un buscador y
 * Google los descarta. Cada entrada declara sus alternativas de idioma más
 * x-default, que apunta al español.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const languages = {
    es: SITE_URL,
    en: `${SITE_URL}/en`,
    'x-default': SITE_URL,
  }

  return locales.map((locale) => ({
    url: localeUrl(locale),
    lastModified,
    alternates: { languages },
  }))
}
