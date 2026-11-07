import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PostCover from '@/components/blog/PostCover';
import PostTitleTransition from '@/components/blog/PostTitleTransition';
import SectionHeading from '@/components/ui/SectionHeading';
import { getPosts, postCover } from '@/lib/blog';
import type { Locale } from '@/i18n/config';

/** Cuántos artículos enseña la portada; el resto está en /blog. */
const HOME_POSTS = 3;

interface BlogSectionProps {
  locale: Locale;
}

/**
 * Últimos artículos del blog en la portada. Es un componente de servidor: lee
 * `content/blog` en el build, igual que la página /blog. Sin artículos no pinta nada.
 */
export default async function BlogSection({ locale }: BlogSectionProps) {
  const posts = getPosts(locale).slice(0, HOME_POSTS);
  if (posts.length === 0) return null;

  const t = await getTranslations({ locale, namespace: 'blog' });
  const dateFormat = new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <section id="blog" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeading number="05" label="BLOG" title={t('homeTitle')} subtitle={t('homeSubtitle')} />

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col border border-white/10 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.03]"
              >
                <PostCover
                  src={postCover(locale, post.slug)}
                  tag={post.tags[0]}
                  sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="aspect-[16/9] border-b border-white/10"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
                    <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
                    {' · '}
                    {t('readingTime', { minutes: post.readingMinutes })}
                  </p>
                  <PostTitleTransition slug={post.slug}>
                    <h3 className="mt-3 text-xl font-bold leading-snug text-white transition-colors group-hover:text-cyan-300">
                      {post.title}
                    </h3>
                  </PostTitleTransition>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">{post.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border border-white/25 px-8 py-4 font-mono text-sm font-medium uppercase tracking-wider text-white transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
          >
            {t('homeViewAll')} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
