import { describe, it, expect } from 'vitest';
import { buildPost, parseFrontmatter, parseTags, readingMinutes } from '@/lib/blog';

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
