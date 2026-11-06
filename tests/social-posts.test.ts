import { describe, it, expect } from 'vitest';
import posts from '@/data/social-posts.json';

const HOSTS: Record<string, RegExp> = {
  x: /^https:\/\/x\.com\/sr_rauldev\/status\/\d+$/,
  linkedin: /^https:\/\/www\.linkedin\.com\/feed\/update\/urn:li:(share|ugcPost):\d+\/$/,
  instagram: /^https:\/\/www\.instagram\.com\/(reel|p)\/[\w-]+\/$/,
};

describe('data/social-posts.json (sección «En redes»)', () => {
  it('cada tema tiene fecha, texto y enlaces válidos a perfiles de Raúl', () => {
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const texts = Object.values(post.text as Record<string, string>);
      expect(texts.length).toBeGreaterThan(0);
      for (const text of texts) expect(text.length).toBeGreaterThan(10);
      expect(post.links.length).toBeGreaterThan(0);
      for (const link of post.links) expect(link.url).toMatch(HOSTS[link.network]);
    }
  });

  it('va de más reciente a más antiguo y sin historias de Instagram (caducan en 24 h)', () => {
    const dates = posts.map((p) => p.date);
    expect([...dates].sort().reverse()).toEqual(dates);
    expect(JSON.stringify(posts)).not.toContain('/stories/');
  });
});
