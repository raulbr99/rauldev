import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BlogList, BlogListFromUrl, type BlogListPost } from '@/components/blog/BlogList';
import type { Metadata } from 'next';
import { ArrowLeft, Rss } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Navigation from '@/components/layout/Navigation';
import SkipLink from '@/components/layout/SkipLink';
import Footer from '@/components/layout/Footer';
import LazyChatWidget from '@/components/chat/LazyChatWidget';
import { getPosts, postCover } from '@/lib/blog';
import { SITE_URL, SITE_OWNER, SOCIAL_URLS, localeUrl, alternatesFor, feedPath } from '@/lib/site';
import type { Locale } from '@/i18n/config';
import { PERSON_ID, WEBSITE_ID, baseNodes, crumb, jsonLdHtml, pageUrl, webPageId } from '@/lib/structured-data';

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
      // Imagen propia del blog (últimos artículos), generada en el build: app/og/[locale]/blog.png.
      images: [{ url: `${SITE_URL}/og/${isSpanish ? 'es' : 'en'}/blog.png`, width: 1200, height: 630, alt: t('metaDescription'), type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('metaDescription'),
      creator: '@sr_rauldev',
      images: [{ url: `${SITE_URL}/og/${isSpanish ? 'es' : 'en'}/blog.png`, alt: t('metaDescription') }],
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

  const listPosts: BlogListPost[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    dateLabel: dateFormat.format(new Date(post.date)),
    readingLabel: t('readingTime', { minutes: post.readingMinutes }),
    cover: postCover(locale as Locale, post.slug),
    tags: post.tags,
  }));
  const listLabels = {
    all: t('filterAll'),
    filter: t('filterLabel'),
    // Plantilla: la rellena el componente de cliente.
    showing: t.raw('filterShowing') as string,
    clear: t('filterClear'),
  };
  const url = pageUrl(locale, '/blog');
  const collectionPage = {
    '@type': 'CollectionPage',
    '@id': webPageId(locale, '/blog'),
    url,
    name: t('title'),
    description: t('metaDescription'),
    inLanguage: locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    hasPart: posts.map((post) => ({
      '@type': 'BlogPosting',
      '@id': `${pageUrl(locale, `/blog/${post.slug}`)}#article`,
      headline: post.title,
      url: pageUrl(locale, `/blog/${post.slug}`),
      datePublished: post.date,
    })),
  };
  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      crumb(1, locale, '', locale === 'en' ? 'Home' : 'Inicio'),
      crumb(2, locale, '/blog', t('title')),
    ],
  };

  return (
    <div className="relative min-h-dvh bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml([...baseNodes(locale), collectionPage, breadcrumbList]),
        }}
      />
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
        <h1 className="mt-3 text-4xl font-semibold leading-[1.05] text-white sm:text-5xl">
          {t('heading')}
        </h1>
        <p className="mt-6 border-l-2 border-cyan-400/50 pl-5 text-lg leading-relaxed text-gray-300">
          {t('intro')}
        </p>
        <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-gray-400">
          <span>{t('follow')}</span>
          <a href={feedPath(locale)} className="inline-flex items-center gap-1.5 py-1 text-cyan-300 transition-colors hover:text-cyan-200">
            <Rss className="h-3.5 w-3.5" aria-hidden />
            RSS
          </a>
          <a href={SOCIAL_URLS.x} target="_blank" rel="noopener noreferrer" className="py-1 transition-colors hover:text-cyan-300">X</a>
          <a href={SOCIAL_URLS.instagram} target="_blank" rel="noopener noreferrer" className="py-1 transition-colors hover:text-cyan-300">Instagram</a>
          <a href={SOCIAL_URLS.linkedin} target="_blank" rel="noopener noreferrer" className="py-1 transition-colors hover:text-cyan-300">LinkedIn</a>
        </p>

        {posts.length === 0 ? (
          <p className="mt-16 font-mono text-sm uppercase tracking-widest text-gray-400">
            {t('empty')}
          </p>
        ) : (
          <Suspense fallback={<BlogList posts={listPosts} labels={listLabels} />}>
            <BlogListFromUrl posts={listPosts} labels={listLabels} />
          </Suspense>
        )}
      </main>

      <Footer />
      <LazyChatWidget />
    </div>
  );
}
