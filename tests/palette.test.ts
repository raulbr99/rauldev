import { describe, it, expect } from 'vitest';
import { matchesQuery, normalizeQuery } from '@/lib/palette-events';

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
