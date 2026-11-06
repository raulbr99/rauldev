import { getPosts } from '@/lib/blog';
import { buildFeed } from '@/lib/feed';
import en from '@/messages/en.json';

// RSS del blog en inglés (`/en/feed.xml`). El español vive en `/feed.xml`, así
// que aquí solo se genera `en` y `/es/feed.xml` da 404 en vez de duplicarlo.
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: 'en' }];
}

export function GET() {
  return new Response(buildFeed('en', getPosts('en'), en.blog.metaDescription), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
