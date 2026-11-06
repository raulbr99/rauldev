import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Nunca bloquear /_next/: Google necesita el JS y el CSS para renderizar.
        disallow: ['/private/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1,
      },
      // Crawlers de motores de IA: el wildcard '*' ya los deja pasar, pero se
      // permiten explícitamente por si alguno cambia su comportamiento por
      // defecto a "denegado" cuando no aparece nombrado.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      { userAgent: 'Claude-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    // Solo el sitemap: llms.txt no es un sitemap (los buscadores esperan XML
    // o una lista de URLs) y ya se anuncia con <link rel="alternate"> en el <head>.
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}