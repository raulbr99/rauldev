import { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rauldev.dev'
  const currentDate = new Date()

  const entries: MetadataRoute.Sitemap = []

  // Páginas principales por locale
  locales.forEach((locale) => {
    const url = locale === defaultLocale ? baseUrl : `${baseUrl}/${locale}`

    entries.push({
      url,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          es: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    })

    // Secciones con anchors
    const sections = ['#sobre-mi', '#experiencia', '#habilidades', '#proyectos', '#contacto']

    sections.forEach((section, index) => {
      entries.push({
        url: `${url}${section}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.8 - index * 0.05,
      })
    })
  })

  return entries
}
