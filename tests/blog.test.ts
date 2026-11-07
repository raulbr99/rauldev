import { describe, it, expect } from 'vitest';
import { buildPost, headingId, localImages, parseFrontmatter, parseTags, pickRelated, readingMinutes, type PostMeta } from '@/lib/blog';

const valid = `---
title: "Mi artículo: con dos puntos"
description: Una descripción
date: 2026-10-08
tags: [ia, agentes]
---

Cuerpo del artículo.
`;

describe('parseFrontmatter', () => {
  it('separa cabecera y cuerpo y respeta los dos puntos dentro del valor', () => {
    const { data, body } = parseFrontmatter(valid);
    expect(data.title).toBe('Mi artículo: con dos puntos');
    expect(data.date).toBe('2026-10-08');
    expect(body.trim()).toBe('Cuerpo del artículo.');
  });

  it('sin cabecera devuelve el texto entero como cuerpo', () => {
    expect(parseFrontmatter('solo texto')).toEqual({ data: {}, body: 'solo texto' });
  });

  it('acepta saltos de línea de Windows', () => {
    expect(parseFrontmatter('---\r\ntitle: A\r\n---\r\nB').data.title).toBe('A');
  });
});

describe('parseTags', () => {
  it.each([
    ['[ia, agentes]', ['ia', 'agentes']],
    ['ia, agentes', ['ia', 'agentes']],
    ['["ia", \'agentes\']', ['ia', 'agentes']],
    ['', []],
    [undefined, []],
  ])('%j → %j', (raw, expected) => {
    expect(parseTags(raw)).toEqual(expected);
  });
});

describe('readingMinutes', () => {
  it('mínimo 1 minuto', () => {
    expect(readingMinutes('hola')).toBe(1);
  });
  it('redondea hacia arriba a 200 palabras por minuto', () => {
    expect(readingMinutes('palabra '.repeat(201))).toBe(2);
  });
});

describe('buildPost', () => {
  it('construye un artículo válido', () => {
    const post = buildPost('mi-articulo', valid);
    expect(post).toMatchObject({
      slug: 'mi-articulo',
      title: 'Mi artículo: con dos puntos',
      tags: ['ia', 'agentes'],
      draft: false,
    });
  });

  it('marca los borradores', () => {
    expect(buildPost('a', valid.replace('tags:', 'draft: true\ntags:')).draft).toBe(true);
  });

  it.each([
    ['slug con mayúsculas', 'Mi_Articulo', valid],
    ['sin title', 'a', valid.replace(/title:.*\n/, '')],
    ['sin description', 'a', valid.replace(/description:.*\n/, '')],
    ['fecha mal formada', 'a', valid.replace('2026-10-08', '8/10/2026')],
    ['updated mal formada', 'a', valid.replace('tags:', 'updated: ayer\ntags:')],
  ])('rechaza: %s', (_name, slug, source) => {
    expect(() => buildPost(slug, source)).toThrow(/Artículo/);
  });
});

const meta = (slug: string, date: string, tags: string[]): PostMeta => ({
  slug, title: slug, description: slug, date, tags, readingMinutes: 1,
});

describe('pickRelated', () => {
  const current = meta('callosa', '2026-11-06', ['3d', 'lidar', 'datos-abiertos']);
  const posts = [
    current,
    meta('alicante', '2026-11-05', ['3d', 'datos-abiertos']),
    meta('advisor', '2026-11-05', ['claude-code']),
    meta('machine', '2026-11-04', ['3d']),
    meta('stack', '2026-11-02', []),
  ];

  it('ordena por etiquetas en común y luego por fecha, sin el propio artículo', () => {
    expect(pickRelated(posts, current).map((p) => p.slug)).toEqual(['alicante', 'machine']);
  });

  it('sin etiquetas en común, los más recientes', () => {
    const lone = meta('nuevo', '2026-11-07', ['otra']);
    expect(pickRelated([lone, ...posts.slice(1)], lone, 3).map((p) => p.slug)).toEqual(['alicante', 'advisor', 'machine']);
  });
});

describe('headingId', () => {
  it('quita tildes y signos y une con guiones', () => {
    expect(headingId('Lo que cambia respecto a Alicante')).toBe('lo-que-cambia-respecto-a-alicante');
    expect(headingId('¿Qué se puede hacer en la web?')).toBe('que-se-puede-hacer-en-la-web');
    expect(headingId('De dónde sale cada cubo')).toBe('de-donde-sale-cada-cubo');
  });
});

describe('localImages', () => {
  it('devuelve las imágenes locales en orden, sin repetir y sin las externas', () => {
    const body = [
      '![Uno](/blog/a/uno.jpg)',
      'Texto con [un enlace](/blog/otro-articulo) que no es imagen.',
      '![Dos](/blog/a/dos.png "con título")',
      '![Externa](https://example.com/x.jpg)',
      '![Uno otra vez](/blog/a/uno.jpg)',
    ].join('\n\n');
    expect(localImages(body)).toEqual(['/blog/a/uno.jpg', '/blog/a/dos.png']);
  });

  it('da una lista vacía si no hay imágenes', () => {
    expect(localImages('Solo texto.')).toEqual([]);
  });
});
