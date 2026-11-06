import { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { SITE_URL, CONTENT_UPDATED, localeUrl } from '@/lib/site'
import { getPosts } from '@/lib/blog'
import { blogAlternates } from '@/lib/blog-alternates'

/**
 * Solo URLs reales: los fragmentos (#seccion) no son URLs para un buscador y
 * Google los descarta. Cada entrada declara sus alternativas de idioma más
 * x-default, que apunta al español.
 */
const PATHS = ['', '/blog', '/aviso-legal', '/privacidad', '/cookies']
const LAST_MODIFIED = new Date(`${CONTENT_UPDATED}T00:00:00.000Z`)

export default function sitemap(): MetadataRoute.Sitemap {
  // Un artículo lleva alternativas hreflang solo si existe en los dos idiomas.
  const posts = locales.flatMap((locale) =>
    getPosts(locale).map((post) => {
      const languages = blogAlternates(post.slug)
      return {
        url: localeUrl(locale, `/blog/${post.slug}`),
        lastModified: new Date(`${post.updated ?? post.date}T00:00:00.000Z`),
        ...(languages ? { alternates: { languages } } : {}),
      }
    })
  )

  const pages = PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified: LAST_MODIFIED,
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
