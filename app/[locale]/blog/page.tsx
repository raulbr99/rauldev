import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Navigation from '@/components/layout/Navigation';
import SkipLink from '@/components/layout/SkipLink';
import Footer from '@/components/layout/Footer';
import LazyChatWidget from '@/components/chat/LazyChatWidget';
import { getPosts } from '@/lib/blog';
import { SITE_URL, SITE_OWNER, localeUrl, alternatesFor } from '@/lib/site';
import type { Locale } from '@/i18n/config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const isSpanish = locale === 'es';

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('metaDescription'),
    authors: [{ name: SITE_OWNER, url: SITE_URL }],
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: isSpanish ? 'es_ES' : 'en_US',
      alternateLocale: isSpanish ? ['en_US'] : ['es_ES'],
      url: localeUrl(locale, '/blog'),
      siteName: `${SITE_OWNER} — Portfolio`,
      title: t('title'),
      description: t('metaDescription'),
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: t('title'), type: 'image/jpeg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('metaDescription'),
      creator: '@raulbr99',
      images: [{ url: `${SITE_URL}/og-image.jpg`, alt: t('title') }],
    },
    alternates: alternatesFor(locale, '/blog'),
  };
}

export default async function BlogIndex({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  const ta = await getTranslations({ locale, namespace: 'a11y' });
  const tl = await getTranslations({ locale, namespace: 'legal' });
  const posts = getPosts(locale as Locale);
  const dateFormat = new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <div className="relative min-h-dvh bg-slate-950">
      <SkipLink label={ta('skipToContent')} />
      <Navigation />

      <main id="contenido" className="mx-auto max-w-3xl px-4 pb-24 pt-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-gray-400 transition-colors hover:text-cyan-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {tl('backHome')}
        </Link>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">
          {t('eyebrow')}
        </p>
        <h1 className="mt-3 text-4xl font-bold uppercase leading-[0.95] text-white sm:text-5xl">
          {t('heading')}
        </h1>
        <p className="mt-6 border-l-2 border-cyan-400/50 pl-5 text-lg leading-relaxed text-gray-300">
          {t('intro')}
        </p>

        {posts.length === 0 ? (
          <p className="mt-16 font-mono text-sm uppercase tracking-widest text-gray-500">
            {t('empty')}
          </p>
        ) : (
          <ul className="mt-14 divide-y divide-white/10 border-y border-white/10">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block py-8 transition-colors hover:bg-white/[0.03] sm:px-4"
                >
                  <p className="font-mono text-[11px] uppercase tracking-widest text-gray-500">
                    <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
                    {' · '}
                    {t('readingTime', { minutes: post.readingMinutes })}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-white transition-colors group-hover:text-cyan-300">
                    {post.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-gray-400">{post.description}</p>
                  {post.tags.length > 0 && (
                    <p className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
      <LazyChatWidget />
    </div>
  );
}
