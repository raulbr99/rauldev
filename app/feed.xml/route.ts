import { getPost, getPosts } from '@/lib/blog';
import { buildFeed } from '@/lib/feed';
import es from '@/messages/es.json';

// RSS del blog en español. Se genera en el build: solo cambia con el contenido.
export const dynamic = 'force-static';

export function GET() {
  // Con el cuerpo: el feed lleva cada artículo entero.
  const posts = getPosts('es').map((post) => ({ ...post, body: getPost('es', post.slug)?.body }));
  return new Response(buildFeed('es', posts, es.blog.metaDescription), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
