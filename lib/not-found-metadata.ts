import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

/**
 * Título y descripción de la 404, sin canonical ni hreflang (son de la
 * portada y aquí no aplican). El `noindex` lo añade Next solo en toda
 * respuesta 404.
 *
 * Lo usan la propia 404 y las páginas que la provocan (la ruta comodín y el
 * artículo inexistente): Next pinta en el HTML los metadatos de `not-found`,
 * pero los que manda al navegador salen de la página, y sin esto la pestaña
 * acababa con el título de la portada.
 */
export async function notFoundMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'notFound' });
  return {
    title: t('title'),
    description: t('description'),
  };
}
