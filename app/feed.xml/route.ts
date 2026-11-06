import { getPosts } from '@/lib/blog';
import { buildFeed } from '@/lib/feed';
import es from '@/messages/es.json';

// RSS del blog en español. Se genera en el build: solo cambia con el contenido.
export const dynamic = 'force-static';

export function GET() {
  return new Response(buildFeed('es', getPosts('es'), es.blog.metaDescription), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
