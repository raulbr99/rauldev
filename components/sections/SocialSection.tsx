import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, Instagram, Linkedin } from 'lucide-react';
import { SiX } from 'react-icons/si';
import SectionHeading from '@/components/ui/SectionHeading';
import { SOCIAL_URLS } from '@/lib/site';
import type { Locale } from '@/i18n/config';
import socialPosts from '@/data/social-posts.json';

type Network = 'x' | 'linkedin' | 'instagram';

interface SocialPost {
  id: string;
  /** ISO YYYY-MM-DD de la última red en la que salió. */
  date: string;
  /** Primer párrafo del post, en el idioma en que se publicó. */
  text: Partial<Record<Locale, string>>;
  links: { network: Network; url: string }[];
}

const NETWORKS: Record<Network, { label: string; Icon: typeof Linkedin | typeof SiX }> = {
  x: { label: 'X', Icon: SiX },
  linkedin: { label: 'LinkedIn', Icon: Linkedin },
  instagram: { label: 'Instagram', Icon: Instagram },
};

const PROFILES = [
  { network: 'x', href: SOCIAL_URLS.x, handle: '@sr_rauldev' },
  { network: 'instagram', href: SOCIAL_URLS.instagram, handle: '@raulberna.dev' },
  { network: 'linkedin', href: SOCIAL_URLS.linkedin, handle: 'Raúl Berná' },
] as const;

/**
 * Últimos posts en redes, uno por tema con un enlace por red. Los datos son
 * estáticos (`data/social-posts.json`, generado desde la lista de publicados):
 * nada de embeds ni APIs de terceros, que cargarían scripts y cookies ajenos.
 * Cada texto va en el idioma en que se publicó; si hay versión en el idioma de
 * la página, sale esa.
 */
export default async function SocialSection({ locale }: { locale: Locale }) {
  const posts = socialPosts as SocialPost[];
  if (posts.length === 0) return null;

  const t = await getTranslations({ locale, namespace: 'social' });
  const dateFormat = new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });

  return (
    <section id="redes" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeading number="06" label="SOCIAL" title={t('title')} subtitle={t('subtitle')} />

        <ul className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => {
            const lang: Locale = post.text[locale] ? locale : locale === 'es' ? 'en' : 'es';
            const text = post.text[lang];
            if (!text) return null;
            return (
              // En móvil bastan 3: la lista entera está en los perfiles.
              <li key={post.id} className={`flex-col bg-slate-950 p-6 ${i >= 3 ? 'hidden md:flex' : 'flex'}`}>
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-gray-400">
                  <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
                  <span aria-hidden>·</span>
                  {post.links.map(({ network }) => {
                    const { Icon } = NETWORKS[network];
                    return <Icon key={network} className="h-3.5 w-3.5 text-cyan-400" aria-hidden />;
                  })}
                  <span className="sr-only">{post.links.map(({ network }) => NETWORKS[network].label).join(', ')}</span>
                </p>
                <p lang={lang} className="mt-4 flex-1 text-lg leading-snug text-gray-100">
                  {text}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1">
                  {post.links.map(({ network, url }) => (
                    <a
                      key={network}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 py-1 font-mono text-[11px] uppercase tracking-widest text-cyan-300 transition-colors hover:text-cyan-200"
                    >
                      {t('seeOn', { network: NETWORKS[network].label })}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex flex-wrap gap-3">
          {PROFILES.map(({ network, href, handle }) => {
            const { Icon, label } = NETWORKS[network];
            return (
              <a
                key={network}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-3 border border-white/25 px-4 py-3.5 font-mono text-sm uppercase tracking-wider text-white transition-colors hover:border-cyan-400/60 hover:text-cyan-300 sm:w-auto sm:px-6"
              >
                <Icon className="h-4 w-4 text-cyan-400" aria-hidden />
                <span className="flex flex-1 items-baseline justify-between gap-3">
                  {t('follow', { network: label })}
                  <span className="text-xs normal-case tracking-normal text-gray-400">{handle}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
