import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import articleSocial from '@/data/article-social.json';

const URLS: Record<string, RegExp> = {
  x: /^https:\/\/x\.com\/sr_rauldev\/status\/\d+$/,
  linkedin: /^https:\/\/www\.linkedin\.com\/feed\/update\/urn:li:(share|ugcPost):\d+\/$/,
  instagram: /^https:\/\/www\.instagram\.com\/(reel|p)\/[\w-]+\/$/,
};

describe('data/article-social.json (posts que contaron cada artículo)', () => {
  it('solo artículos que existen, una entrada por red y enlaces a los perfiles de Raúl', () => {
    for (const [slug, links] of Object.entries(articleSocial as Record<string, { network: string; url: string }[]>)) {
      expect(fs.existsSync(path.join(process.cwd(), 'content', 'blog', 'es', `${slug}.md`))).toBe(true);
      const networks = links.map((l) => l.network);
      expect(new Set(networks).size).toBe(networks.length);
      for (const link of links) expect(link.url).toMatch(URLS[link.network]);
    }
  });
});
