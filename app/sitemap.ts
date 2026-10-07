import { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { SITE_URL, localeUrl } from '@/lib/site'
import { getPosts } from '@/lib/blog'

/**
 * Solo URLs reales: los fragmentos (#seccion) no son URLs para un buscador y
 * Google los descarta. Cada entrada declara sus alternativas de idioma más
 * x-default, que apunta al español.
 */
const PATHS = ['', '/blog', '/aviso-legal', '/privacidad', '/cookies']
const CONTENT_UPDATED = new Date('2026-09-16T00:00:00.000Z')

export default function sitemap(): MetadataRoute.Sitemap {
  // Cada artículo solo existe en su idioma, así que no lleva alternativas hreflang.
  const posts = locales.flatMap((locale) =>
    getPosts(locale).map((post) => ({
      url: localeUrl(locale, `/blog/${post.slug}`),
      lastModified: new Date(`${post.updated ?? post.date}T00:00:00.000Z`),
    }))
  )

  const pages = PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified: CONTENT_UPDATED,
      alternates: {
        languages: {
          es: `${SITE_URL}${path}`,
          en: `${SITE_URL}/en${path}`,
          'x-default': `${SITE_URL}${path}`,
        },
      },
    }))
  )

  return [...pages, ...posts]
}
