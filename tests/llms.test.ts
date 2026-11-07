import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { LLMS_MARKER, buildLlmsSections, fillLlms } from '@/lib/llms';
import type { PostMeta } from '@/lib/blog';

const post: PostMeta = {
  slug: 'callosa-voxels',
  title: 'Callosa de Segura en cubos de 1 metro',
  description: 'Con LiDAR.',
  date: '2026-11-06',
  tags: [],
  readingMinutes: 3,
};

describe('llms.txt generado', () => {
  it('el fichero base conserva la marca donde van Blog y En redes', () => {
    const base = fs.readFileSync(path.join(process.cwd(), 'content', 'llms.txt'), 'utf8');
    expect(base.split(LLMS_MARKER)).toHaveLength(2);
  });

  it('lista artículos de cada idioma, los feeds y los posts con sus enlaces', () => {
    const out = buildLlmsSections([post], [{ ...post, title: 'Callosa in 1 m cubes' }], [
      { date: '2026-11-06', text: { es: 'Ahora toca Callosa.' }, links: [{ network: 'x', url: 'https://x.com/sr_rauldev/status/1' }] },
    ]);
    expect(out).toContain('- [Callosa de Segura en cubos de 1 metro](https://rauldev.dev/blog/callosa-voxels) (2026-11-06): Con LiDAR.');
    expect(out).toContain('(https://rauldev.dev/en/blog/callosa-voxels)');
    expect(out).toContain('https://rauldev.dev/feed.xml (ES) · https://rauldev.dev/en/feed.xml (EN)');
    expect(out).toContain('- 2026-11-06: Ahora toca Callosa. [X](https://x.com/sr_rauldev/status/1)');
  });

  it('sin la marca, falla en vez de servir un llms.txt incompleto', () => {
    expect(() => fillLlms('sin marca', 'x')).toThrow();
  });
});
