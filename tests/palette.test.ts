import { describe, it, expect } from 'vitest';
import { matchesQuery, normalizeQuery, postSearchText } from '@/lib/palette-events';

describe('buscador ⌘K', () => {
  it('normaliza tildes y mayúsculas', () => {
    expect(normalizeQuery('  Experiéncia ')).toBe('experiencia');
  });

  it('casa si están todas las palabras, en cualquier orden', () => {
    expect(matchesQuery('Callosa de Segura en cubos de 1 metro lidar', 'cubos callosa')).toBe(true);
    expect(matchesQuery('Callosa de Segura en cubos de 1 metro', 'callosa alicante')).toBe(false);
    expect(matchesQuery('Sobre mí', 'sobre mi')).toBe(true);
  });

  it('una búsqueda vacía lo enseña todo', () => {
    expect(matchesQuery('Lo que sea', '   ')).toBe(true);
  });
});

describe('postSearchText', () => {
  const post = {
    slug: 'callosa-voxels',
    title: 'Callosa de Segura en cubos de 1 metro',
    description: 'Después de Alicante, la ciudad donde nací. Esta vez con LiDAR.',
    tags: ['datos-abiertos', '3d', 'lidar'],
  };

  it('encuentra el artículo por palabras de la dirección y de la entradilla', () => {
    expect(matchesQuery(postSearchText(post), 'voxels')).toBe(true);
    expect(matchesQuery(postSearchText(post), 'lidar nací')).toBe(true);
    expect(matchesQuery(postSearchText(post), 'datos abiertos')).toBe(true);
  });

  it('no encuentra lo que no está', () => {
    expect(matchesQuery(postSearchText(post), 'kubernetes')).toBe(false);
  });
});
