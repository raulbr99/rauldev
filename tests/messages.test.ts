import { describe, it, expect } from 'vitest';
import es from '@/messages/es.json';
import en from '@/messages/en.json';

/** Todas las hojas de texto con su ruta (`blog.title`, `faq.items.0.q`…), también dentro de listas. */
function leaves(tree: unknown, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  if (typeof tree === 'string') {
    out.set(prefix, tree);
  } else if (tree && typeof tree === 'object') {
    for (const [key, value] of Object.entries(tree)) {
      for (const [k, v] of leaves(value, prefix ? `${prefix}.${key}` : key)) out.set(k, v);
    }
  }
  return out;
}

describe('traducciones', () => {
  const esLeaves = leaves(es);
  const enLeaves = leaves(en);

  it('español e inglés tienen exactamente las mismas claves', () => {
    expect([...esLeaves.keys()].filter((k) => !enLeaves.has(k))).toEqual([]);
    expect([...enLeaves.keys()].filter((k) => !esLeaves.has(k))).toEqual([]);
  });

  it('ningún texto está vacío', () => {
    expect([...esLeaves].filter(([, v]) => !v.trim()).map(([k]) => `es:${k}`)).toEqual([]);
    expect([...enLeaves].filter(([, v]) => !v.trim()).map(([k]) => `en:${k}`)).toEqual([]);
  });

  it('las variables {x} de cada texto coinciden en los dos idiomas', () => {
    const vars = (s: string) => [...s.matchAll(/\{(\w+)/g)].map((m) => m[1]).sort().join(',');
    const distintos = [...esLeaves].filter(([k, v]) => enLeaves.has(k) && vars(v) !== vars(enLeaves.get(k)!)).map(([k]) => k);
    expect(distintos).toEqual([]);
  });
});
