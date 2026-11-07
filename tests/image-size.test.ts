import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { imageSize, publicImageSize } from '@/lib/image-size';

describe('imageSize', () => {
  it('lee las medidas de un JPEG real del blog', () => {
    expect(publicImageSize('/blog/callosa-voxels/casco.jpg')).toEqual({ width: 1600, height: 1000 });
  });

  it('lee un PNG por su cabecera IHDR', () => {
    const png = fs.readFileSync(path.join(process.cwd(), 'public', 'icon-192.png'));
    expect(imageSize(png)).toEqual({ width: 192, height: 192 });
  });

  it('no inventa medidas: ruta fuera de public, inexistente o fichero que no es imagen', () => {
    expect(publicImageSize('/../package.json')).toBeUndefined();
    expect(publicImageSize('/no-existe.jpg')).toBeUndefined();
    expect(imageSize(Buffer.from('hola'))).toBeUndefined();
  });
});
