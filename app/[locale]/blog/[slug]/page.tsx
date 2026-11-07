import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, Instagram, Linkedin, Rss } from 'lucide-react';
import { SiX } from 'react-icons/si';
import { Link } from '@/i18n/navigation';
import Navigation from '@/components/layout/Navigation';
import ScrollProgress from '@/components/anim/ScrollProgress';
import SkipLink from '@/components/layout/SkipLink';
import Footer from '@/components/layout/Footer';
import LazyChatWidget from '@/components/chat/LazyChatWidget';
import PostBody from '@/components/blog/PostBody';
import PostCover from '@/components/blog/PostCover';
import PostTitleTransition from '@/components/blog/PostTitleTransition';
import ShareButtons from '@/components/blog/ShareButtons';
import TableOfContents from '@/components/blog/TableOfContents';
import { getPost, getPosts, pickRelated, postCover, postHeadings } from '@/lib/blog';
import articleSocial from '@/data/article-social.json';
import { locales, type Locale } from '@/i18n/config';
import { SITE_URL, SITE_OWNER, SOCIAL_URLS, localeUrl, feedPath, feedTypes, postImageUrl } from '@/lib/site';
import { notFoundMetadata } from '@/lib/not-found-metadata';
import { blogAlternates } from '@/lib/blog-alternates';
import { PERSON_ID, WEBSITE_ID, baseNodes, crumb, jsonLdHtml, webPageId } from '@/lib/structured-data';

type Props = { params: Promise<{ locale: string; slug: string }> };

type SocialLink = { network: 'x' | 'linkedin' | 'instagram'; url: string };
const SOCIAL_LABEL = { x: 'X', linkedin: 'LinkedIn', instagram: 'Instagram' } as const;

/** Posts en redes que contaron este artículo (data/article-social.json, generado desde la lista de publicados). */
function socialFor(slug: string): SocialLink[] {
  return ((articleSocial as Record<string, SocialLink[]>)[slug] ?? []).filter((l) => l.network in SOCIAL_LABEL);
}

export function generateStaticParams() {
  return locales.flatMap((locale) => getPosts(locale).map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale as Locale, slug);
  if (!post) return notFoundMetadata(locale);

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
      images: [{ url: postImageUrl(locale, slug), width: 1200, height: 630, alt: post.title, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: '@sr_rauldev',
      images: [{ url: postImageUrl(locale, slug), alt: post.title }],
    },
    // hreflang solo si el artículo existe en los dos idiomas: si no, apuntaría
    // a una página inexistente.
    alternates: { canonical: url, languages: blogAlternates(slug), types: feedTypes(locale) },
  };
}

export default async function BlogPost({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPost(locale as Locale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: 'blog' });
  const ta = await getTranslations({ locale, namespace: 'a11y' });
  const related = pickRelated(getPosts(locale as Locale), post);
  const social = socialFor(slug);
  const url = localeUrl(locale, `/blog/${slug}`);
  const dateFormat = new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const path = `/blog/${slug}`;
  const blogPosting = {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.description,
    inLanguage: locale,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    keywords: post.tags.join(', '),
    mainEntityOfPage: { '@id': webPageId(locale, path) },
    url,
    image: postImageUrl(locale, slug),
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    // Donde se comenta: el post de X (o el primero que haya) que lo contó.
    ...(social[0] ? { discussionUrl: social[0].url } : {}),
    isPartOf: { '@id': WEBSITE_ID },
  };
  const webPage = {
    '@type': 'WebPage',
    '@id': webPageId(locale, path),
    url,
    name: post.title,
    inLanguage: locale,
    isPartOf: { '@id': WEBSITE_ID },
    breadcrumb: { '@id': `${url}#breadcrumb` },
  };
  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      crumb(1, locale, '', locale === 'en' ? 'Home' : 'Inicio'),
      crumb(2, locale, '/blog', t('title')),
      crumb(3, locale, path, post.title),
    ],
  };

  return (
    <div className="relative min-h-dvh bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml([...baseNodes(locale), webPage, blogPosting, breadcrumbList]),
        }}
      />
      <SkipLink label={ta('skipToContent')} />
      {/* Cuánto queda del artículo: la misma barra fina de la portada (CSS puro). */}
      <ScrollProgress />
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
            {/* Firma: quién lo escribe, con foto y enlace a «Sobre mí» (rel="author").
                En móvil, la fecha y el tiempo de lectura bajan a su propia línea (sin un «·» colgando). */}
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-gray-400">
              <Image
                src="/me.jpg"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 border border-cyan-400/60 object-cover"
              />
              <Link href="/#sobre-mi" rel="author" className="py-1 text-gray-200 transition-colors hover:text-cyan-300">
                {SITE_OWNER}
              </Link>
              <span aria-hidden className="hidden sm:inline">·</span>
              <span className="w-full sm:w-auto">
                <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
                {' · '}
                {t('readingTime', { minutes: post.readingMinutes })}
              </span>
            </p>
            <PostTitleTransition slug={slug}>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] text-white sm:text-5xl">
                {post.title}
              </h1>
            </PostTitleTransition>
            <p className="mt-6 border-l-2 border-cyan-400/50 pl-5 text-lg leading-relaxed text-gray-300">
              {post.description}
            </p>
            {post.updated && (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-gray-400">
                {t('updatedOn', { date: dateFormat.format(new Date(post.updated)) })}
              </p>
            )}
            {/* Cada etiqueta lleva a /blog filtrado por ella (?tag=…, el filtro de BlogList). */}
            {post.tags.length > 0 && (
              <ul aria-label={t('tagsLabel')} className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={{ pathname: '/blog', query: { tag } }}
                      className="inline-flex items-center gap-1 border border-white/15 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-gray-300 transition-colors hover:border-cyan-400/60 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                    >
                      <span aria-hidden className="text-cyan-400/80">#</span>
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </header>

          <TableOfContents headings={postHeadings(post.body)} title={t('tocTitle')} />

          <div className="mt-12">
            <PostBody anchorLabel={t('anchorLabel')} codeLabels={{ copy: t('copyCode'), copied: t('copied') }}
              imageLabels={{ zoom: t('zoomImage'), close: t('closeImage') }}
            >
              {post.body}
            </PostBody>
          </div>

          {social.length > 0 && (
            <p className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-white/10 py-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">{t('onSocial')}</span>
              {social.map(({ network, url }) => {
                const Icon = network === 'x' ? SiX : network === 'linkedin' ? Linkedin : Instagram;
                return (
                  <a
                    key={network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-1 text-sm text-gray-200 transition-colors hover:text-cyan-300"
                  >
                    <Icon className="h-4 w-4 text-cyan-400" aria-hidden />
                    {t('seeOn', { network: SOCIAL_LABEL[network] })}
                    <ArrowUpRight className="h-3.5 w-3.5 text-gray-400" aria-hidden />
                  </a>
                );
              })}
            </p>
          )}
        </article>

        <aside aria-label={t('shareEyebrow')} className="mt-16 border border-white/10 bg-slate-900/60">
          <div className="grid gap-8 p-6 sm:grid-cols-2">
            <section>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">{t('shareEyebrow')}</h2>
              <p className="mt-3 text-gray-300">{t('shareText')}</p>
              <div className="mt-5">
                <ShareButtons
                  url={url}
                  title={post.title}
                  labels={{
                    x: t('shareX'),
                    linkedin: t('shareLinkedin'),
                    copy: t('copyLink'),
                    copied: t('copied'),
                    native: t('shareNative'),
                  }}
                />
              </div>
            </section>
            <section>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">{t('followEyebrow')}</h2>
              <p className="mt-3 text-gray-300">{t('followText')}</p>
              <ul className="mt-4">
                {[
                  { href: SOCIAL_URLS.x, label: 'X', handle: '@sr_rauldev', Icon: SiX },
                  { href: SOCIAL_URLS.instagram, label: 'Instagram', handle: '@raulberna.dev', Icon: Instagram },
                  { href: SOCIAL_URLS.linkedin, label: 'LinkedIn', handle: SITE_OWNER, Icon: Linkedin },
                ].map(({ href, label, handle, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 py-1.5 text-gray-200 transition-colors hover:text-cyan-300"
                    >
                      <Icon className="h-4 w-4 text-cyan-400" aria-hidden />
                      {label}
                      <span className="font-mono text-xs text-gray-400 group-hover:text-cyan-300/80">{handle}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={feedPath(locale)}
                    className="group flex items-center gap-3 py-1.5 text-gray-200 transition-colors hover:text-cyan-300"
                  >
                    <Rss className="h-4 w-4 text-cyan-400" aria-hidden />
                    RSS
                    <span className="font-mono text-xs text-gray-400 group-hover:text-cyan-300/80">{t('rssHint')}</span>
                  </a>
                </li>
              </ul>
            </section>
          </div>
          <p className="border-t border-white/10 px-6 py-4 text-sm text-gray-400">
            {t('ctaText')}{' '}
            <Link href="/#contacto" className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200">
              {t('ctaButton')}
            </Link>
          </p>
        </aside>

        {related.length > 0 && (
          <section aria-labelledby="sigue-leyendo" className="mt-16">
            <h2 id="sigue-leyendo" className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">
              {t('keepReading')}
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="group flex h-full flex-col border border-white/10 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.03]"
                  >
                    <PostCover
                      src={postCover(locale as Locale, item.slug)}
                      tag={item.tags[0]}
                      sizes="(min-width: 640px) 380px, 100vw"
                      className="aspect-[16/9] border-b border-white/10"
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
                        <time dateTime={item.date}>{dateFormat.format(new Date(item.date))}</time>
                      </p>
                      <PostTitleTransition slug={item.slug}>
                        <h3 className="mt-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-cyan-300">
                          {item.title}
                        </h3>
                      </PostTitleTransition>
                      <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Footer />
      <LazyChatWidget />
    </div>
  );
}
