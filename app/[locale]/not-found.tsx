import type { Metadata } from 'next';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Instagram, Linkedin, Search } from 'lucide-react';
import { SiX } from 'react-icons/si';
import { Link } from '@/i18n/navigation';
import OpenPaletteButton from '@/components/ui/OpenPaletteButton';
import { notFoundMetadata } from '@/lib/not-found-metadata';
import { getPosts } from '@/lib/blog';
import { SOCIAL_URLS } from '@/lib/site';
import { locales, defaultLocale, type Locale } from '@/i18n/config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return notFoundMetadata(locale);
}

const profiles = [
  { href: SOCIAL_URLS.x, label: 'X', Icon: SiX },
  { href: SOCIAL_URLS.instagram, label: 'Instagram', Icon: Instagram },
  { href: SOCIAL_URLS.linkedin, label: 'LinkedIn', Icon: Linkedin },
] as const;

/**
 * 404 que no es un callejón sin salida: además de volver al inicio, deja
 * buscar (abre el buscador ⌘K), enseña los últimos artículos y los perfiles.
 */
export default function NotFound() {
  const t = useTranslations('notFound');
  const raw = useLocale();
  const locale: Locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const posts = getPosts(locale).slice(0, 3);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-slate-950 px-4 py-20 text-center">
      <p aria-hidden className="font-mono text-7xl font-bold text-cyan-400/60 sm:text-8xl">{t('code')}</p>
      <h1 className="mt-4 text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">{t('title')}</h1>
      <p className="mt-4 max-w-md leading-relaxed text-gray-400">{t('description')}</p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-cyan-400 px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-wider text-slate-950 transition-colors hover:bg-cyan-300"
        >
          {t('cta')}
        </Link>
        <OpenPaletteButton className="inline-flex items-center gap-2 border border-white/25 px-6 py-3.5 font-mono text-sm uppercase tracking-wider text-white transition-colors hover:border-cyan-400/60 hover:text-cyan-300">
          <Search className="h-4 w-4" aria-hidden />
          {t('search')}
          <kbd className="ml-1 hidden font-mono text-xs text-gray-400 sm:inline">⌘K</kbd>
        </OpenPaletteButton>
      </div>

      {posts.length > 0 && (
        <section aria-labelledby="ultimos" className="mt-14 w-full max-w-xl text-left">
          <h2 id="ultimos" className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">
            {t('latest')}
          </h2>
          <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-center justify-between gap-4 py-3.5 text-gray-200 transition-colors hover:text-cyan-300"
                >
                  <span>{post.title}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-gray-500 transition-colors group-hover:text-cyan-300" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label={t('follow')} className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">{t('follow')}</span>
        {profiles.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-1 text-sm text-gray-300 transition-colors hover:text-cyan-300"
          >
            <Icon className="h-4 w-4 text-cyan-400" aria-hidden />
            {label}
          </a>
        ))}
      </nav>
    </main>
  );
}
