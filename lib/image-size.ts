import fs from 'node:fs';
import path from 'node:path';

/**
 * Ancho y alto de un JPEG o PNG leyendo solo su cabecera, sin dependencias.
 * Sirve para dar a <Image> las medidas reales de las fotos de los artículos
 * (y que el navegador reserve su hueco antes de cargarlas).
 */
export function imageSize(buf: Buffer): { width: number; height: number } | undefined {
  // PNG: firma de 8 bytes y el bloque IHDR con ancho y alto en big-endian.
  if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: recorrer los marcadores hasta un SOF (inicio de imagen) con las medidas.
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return undefined;
      const marker = buf[i + 1];
      const length = buf.readUInt16BE(i + 2);
      const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isSof) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      i += 2 + length;
    }
  }
  return undefined;
}

/** Medidas de una imagen de `public/` a partir de su ruta pública (`/blog/…/foto.jpg`). */
export function publicImageSize(src: string): { width: number; height: number } | undefined {
  if (!src.startsWith('/') || src.includes('..')) return undefined;
  const file = path.join(process.cwd(), 'public', src);
  if (!fs.existsSync(file)) return undefined;
  return imageSize(fs.readFileSync(file));
}
