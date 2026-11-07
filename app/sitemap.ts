import { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { SITE_URL, CONTENT_UPDATED, localeUrl } from '@/lib/site'
import { getPost, getPosts, latestUpdate, localImages } from '@/lib/blog'
import projectsData from '@/data/projects.json'
import { blogAlternates } from '@/lib/blog-alternates'

/**
 * Solo URLs reales: los fragmentos (#seccion) no son URLs para un buscador y
 * Google los descarta. Cada entrada declara sus alternativas de idioma más
 * x-default, que apunta al español. Las páginas con fotos (la portada y los
 * artículos) las listan como `<image:image>` para que salgan en Google Imágenes.
 */
const PATHS = ['', '/blog', '/aviso-legal', '/privacidad', '/cookies']
const LAST_MODIFIED = new Date(`${CONTENT_UPDATED}T00:00:00.000Z`)

const absolute = (src: string) => `${SITE_URL}${src}`

/** La foto de la portada y las capturas de los proyectos. */
const HOME_IMAGES = ['/me.jpg', ...projectsData.projects.map((project) => project.image)].map(absolute)

export default function sitemap(): MetadataRoute.Sitemap {
  // Un artículo lleva alternativas hreflang solo si existe en los dos idiomas.
  const posts = locales.flatMap((locale) =>
    getPosts(locale).map((post) => {
      const languages = blogAlternates(post.slug)
      const images = localImages(getPost(locale, post.slug)?.body ?? '').map(absolute)
      return {
        url: localeUrl(locale, `/blog/${post.slug}`),
        lastModified: new Date(`${post.updated ?? post.date}T00:00:00.000Z`),
        ...(languages ? { alternates: { languages } } : {}),
        ...(images.length ? { images } : {}),
      }
    })
  )

  const pages = PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: localeUrl(locale, path),
      // La portada y /blog enseñan los últimos artículos: cambian cada vez que
      // se publica uno, aunque nadie toque CONTENT_UPDATED.
      lastModified: path === '' || path === '/blog' ? new Date(`${latestUpdate(locale)}T00:00:00.000Z`) : LAST_MODIFIED,
      alternates: {
        languages: {
          es: `${SITE_URL}${path}`,
          en: `${SITE_URL}/en${path}`,
          'x-default': `${SITE_URL}${path}`,
        },
      },
      ...(path === '' ? { images: HOME_IMAGES } : {}),
    }))
  )

  return [...pages, ...posts]
}
