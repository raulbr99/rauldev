import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Navigation from '@/components/layout/Navigation';
import SkipLink from '@/components/layout/SkipLink';
import Footer from '@/components/layout/Footer';
import LazyChatWidget from '@/components/chat/LazyChatWidget';
import PostBody from '@/components/blog/PostBody';
import { getPost, getPosts } from '@/lib/blog';
import { locales, type Locale } from '@/i18n/config';
import { SITE_URL, SITE_OWNER, localeUrl } from '@/lib/site';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => getPosts(locale).map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale as Locale, slug);
  if (!post) return {};

  const isSpanish = locale === 'es';
  const url = localeUrl(locale, `/blog/${slug}`);

  return {
    metadataBase: new URL(SITE_URL),
    title: post.title,
    description: post.description,
    authors: [{ name: SITE_OWNER, url: SITE_URL }],
    keywords: post.tags,
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      locale: isSpanish ? 'es_ES' : 'en_US',
      url,
      siteName: `${SITE_OWNER} — Portfolio`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [SITE_OWNER],
      tags: post.tags,
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: post.title, type: 'image/jpeg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: '@raulbr99',
      images: [{ url: `${SITE_URL}/og-image.jpg`, alt: post.title }],
    },
    // Solo canonical: un artículo puede no existir en el otro idioma, así que
    // no se declaran hreflang que apunten a una página inexistente.
    alternates: { canonical: url },
  };
}

export default async function BlogPost({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPost(locale as Locale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: 'blog' });
  const ta = await getTranslations({ locale, namespace: 'a11y' });
  const url = localeUrl(locale, `/blog/${slug}`);
  const dateFormat = new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    inLanguage: locale,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    keywords: post.tags.join(', '),
    mainEntityOfPage: url,
    url,
    image: `${SITE_URL}/og-image.jpg`,
    author: { '@type': 'Person', name: SITE_OWNER, url: SITE_URL },
    publisher: { '@type': 'Person', name: SITE_OWNER, url: SITE_URL },
  };

  return (
    <div className="relative min-h-dvh bg-slate-950">
      <script
        type="application/ld+json"
        // `<` escapado para que un título no pueda cerrar el <script>.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <SkipLink label={ta('skipToContent')} />
      <Navigation />

      <main id="contenido" className="mx-auto max-w-3xl px-4 pb-24 pt-32">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-gray-400 transition-colors hover:text-cyan-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('backToBlog')}
        </Link>

        <article className="mt-8">
          <header>
            <p className="font-mono text-[11px] uppercase tracking-widest text-gray-500">
              <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
              {' · '}
              {t('readingTime', { minutes: post.readingMinutes })}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-6 border-l-2 border-cyan-400/50 pl-5 text-lg leading-relaxed text-gray-300">
              {post.description}
            </p>
            {post.updated && (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-gray-500">
                {t('updatedOn', { date: dateFormat.format(new Date(post.updated)) })}
              </p>
            )}
          </header>

          <div className="mt-12">
            <PostBody>{post.body}</PostBody>
          </div>
        </article>

        <aside className="mt-16 border border-white/10 bg-slate-900/60 p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">
            {t('ctaEyebrow')}
          </p>
          <p className="mt-3 text-gray-300">{t('ctaText')}</p>
          <Link
            href="/#contacto"
            className="mt-5 inline-flex items-center border border-cyan-400/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-cyan-300 transition-colors hover:bg-cyan-400/10"
          >
            {t('ctaButton')}
          </Link>
        </aside>
      </main>

      <Footer />
      <LazyChatWidget />
    </div>
  );
}
