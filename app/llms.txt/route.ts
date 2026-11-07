import fs from 'node:fs';
import path from 'node:path';
import { getPosts } from '@/lib/blog';
import { buildLlmsSections, fillLlms, type SocialPostEntry } from '@/lib/llms';
import socialPosts from '@/data/social-posts.json';

// llms.txt = content/llms.txt (escrito a mano) + Blog y En redes generados.
// Estático: se rehace en cada build, así que siempre lleva los últimos artículos.
export const dynamic = 'force-static';

export function GET() {
  const base = fs.readFileSync(path.join(process.cwd(), 'content', 'llms.txt'), 'utf8');
  const body = fillLlms(base, buildLlmsSections(getPosts('es'), getPosts('en'), socialPosts as SocialPostEntry[]));
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
