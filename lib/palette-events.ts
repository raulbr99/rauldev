/** Abre el buscador (⌘K) desde fuera de él, p. ej. el botón de la barra. */
export const OPEN_PALETTE_EVENT = 'rauldev:open-palette';

export function requestOpenPalette(): void {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}

/** Minúsculas y sin tildes: «Experiéncia» y «experiencia» casan igual. */
export function normalizeQuery(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** Todas las palabras de la búsqueda tienen que aparecer en el texto del elemento. */
export function matchesQuery(haystack: string, query: string): boolean {
  const words = normalizeQuery(query).split(/\s+/).filter(Boolean);
  const text = normalizeQuery(haystack);
  return words.every((word) => text.includes(word));
}

/**
 * Texto en el que se busca un artículo: título, etiquetas, dirección y entradilla.
 * Sin la dirección y la entradilla, «voxels» o «LiDAR» no encontraban los
 * artículos que tratan justo de eso.
 */
export function postSearchText(post: { slug: string; title: string; description: string; tags: string[] }): string {
  return [post.title, post.tags.join(' '), post.slug.replace(/-/g, ' '), post.description].join(' ');
}
