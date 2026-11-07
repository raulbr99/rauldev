import fs from 'node:fs';
import path from 'node:path';
import { createElement, type ComponentProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PostBody from '@/components/blog/PostBody';
import TableOfContents from '@/components/blog/TableOfContents';
import { parseFrontmatter, postHeadings } from '@/lib/blog';

/** Ids de los apartados tal como salen en el HTML del artículo. */
function renderedIds(body: string): string[] {
  const props: ComponentProps<typeof PostBody> = {
    anchorLabel: 'Enlace',
    codeLabels: { copy: 'Copiar', copied: 'Copiado' },
    imageLabels: { zoom: 'Ampliar', close: 'Cerrar' },
    children: body,
  };
  const html = renderToStaticMarkup(createElement(PostBody, props));
  return [...html.matchAll(/<h[23] id="([^"]+)"/g)].map((m) => m[1]);
}

const tricky = [
  '# Título de nivel 1',
  '',
  '## Cómo **funciona** `mi_var` y [el enlace](https://example.com)',
  '',
  '```bash',
  '## esto es un comentario, no un apartado',
  '```',
  '',
  '### Un _detalle_ con *énfasis* y snake_case',
  '',
  '## Último apartado ##',
].join('\n');

describe('postHeadings', () => {
  it('saca los apartados con su nivel y sin las marcas de Markdown', () => {
    expect(postHeadings(tricky)).toEqual([
      { id: 'titulo-de-nivel-1', text: 'Título de nivel 1', level: 2 },
      { id: 'como-funciona-mi-var-y-el-enlace', text: 'Cómo funciona mi_var y el enlace', level: 2 },
      { id: 'un-detalle-con-enfasis-y-snake-case', text: 'Un detalle con énfasis y snake_case', level: 3 },
      { id: 'ultimo-apartado', text: 'Último apartado', level: 2 },
    ]);
  });

  it('da los mismos ids que pinta PostBody (si no, el índice apuntaría a anclas que no existen)', () => {
    expect(postHeadings(tricky).map((h) => h.id)).toEqual(renderedIds(tricky));
  });

  it('coincide con PostBody en todos los artículos publicados', () => {
    for (const locale of ['es', 'en']) {
      const dir = path.join(process.cwd(), 'content', 'blog', locale);
      for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
        const { body } = parseFrontmatter(fs.readFileSync(path.join(dir, file), 'utf8'));
        expect(postHeadings(body).map((h) => h.id), `${locale}/${file}`).toEqual(renderedIds(body));
      }
    }
  });
});

describe('TableOfContents', () => {
  const html = (body: string) =>
    renderToStaticMarkup(createElement(TableOfContents, { headings: postHeadings(body), title: 'En este artículo' }));

  it('con 3 apartados o más pinta un enlace numerado por apartado', () => {
    const out = html('## Uno\n\n## Dos\n\n### Dos y medio\n\n## Tres');
    expect([...out.matchAll(/href="#([^"]+)"/g)].map((m) => m[1])).toEqual(['uno', 'dos', 'dos-y-medio', 'tres']);
    expect(out).toContain('>01<');
    expect(out).toContain('>03<');
    expect(out).toContain('aria-labelledby="post-toc"');
  });

  it('con menos de 3 apartados no pinta nada', () => {
    expect(html('## Uno\n\n### Sub\n\n## Dos')).toBe('');
  });
});
