import fs from 'node:fs';
import path from 'node:path';

/**
 * Piezas comunes de las imágenes para compartir (1200×630) que se generan en el
 * build con next/og: la de cada artículo (`/og/<locale>/<slug>.png`) y la del
 * blog (`/og/<locale>/blog.png`).
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CYAN = '#22d3ee';
export const OG_INK = '#020617';

const ROOT = process.cwd();

/** Rejilla del sitio como fondo. */
export const OG_GRID = {
  backgroundColor: OG_INK,
  backgroundImage:
    'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
  backgroundSize: '64px 64px',
};

function font(file: string): Buffer {
  return fs.readFileSync(path.join(ROOT, 'assets', 'og', file));
}

/** Fuentes del sitio para next/og (WOFF: Satori no lee WOFF2). */
export function ogFonts() {
  return [
    { name: 'Space Grotesk', data: font('space-grotesk-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
    { name: 'Space Grotesk', data: font('space-grotesk-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
    { name: 'JetBrains Mono', data: font('jetbrains-mono-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  ];
}

/** Un fichero de `public/` (`/blog/x.jpg`) como data URL; undefined si no existe o se sale de `public/`. */
export function publicDataUrl(src: string): string | undefined {
  const file = path.join(ROOT, 'public', src);
  if (!file.startsWith(path.join(ROOT, 'public')) || !fs.existsSync(file)) return undefined;
  const type = /\.png$/i.test(src) ? 'image/png' : 'image/jpeg';
  return `data:${type};base64,${fs.readFileSync(file).toString('base64')}`;
}

/** Corta en una palabra y añade «…» si pasa de `max` caracteres. */
export function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
}
