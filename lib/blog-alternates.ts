import { getPost } from '@/lib/blog';
import { localeUrl } from '@/lib/site';

/**
 * hreflang de un artículo: solo cuando existe en español y en inglés con el
 * mismo slug (si falta uno, apuntaría a una 404). x-default va al español.
 */
export function blogAlternates(slug: string): Record<string, string> | undefined {
  if (!getPost('es', slug) || !getPost('en', slug)) return undefined;
  const path = `/blog/${slug}`;
  return {
    es: localeUrl('es', path),
    en: localeUrl('en', path),
    'x-default': localeUrl('es', path),
  };
}
