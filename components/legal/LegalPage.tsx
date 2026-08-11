import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

interface LegalPageProps {
  /** Clave del bloque dentro de `legal` en los mensajes: notice | privacy | cookies */
  section: 'notice' | 'privacy' | 'cookies';
  /** Pares de claves título/cuerpo, en el orden en que se muestran. */
  blocks: { title: string; body: string }[];
  /** Fecha de última revisión del texto, en ISO (YYYY-MM-DD). */
  updatedAt: string;
}

/**
 * Plantilla común de las páginas legales: una columna de lectura sobria, sin
 * animaciones ni fondo aurora, para que el texto se lea sin ruido.
 */
export default function LegalPage({ section, blocks, updatedAt }: LegalPageProps) {
  const t = useTranslations(`legal.${section}`);
  const tl = useTranslations('legal');

  return (
    <div className="relative min-h-dvh bg-slate-950">
      <Navigation />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-gray-400 transition-colors hover:text-cyan-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {tl('backHome')}
        </Link>

        <h1 className="mt-6 text-4xl font-bold uppercase leading-[0.95] text-white sm:text-5xl">
          {t('title')}
        </h1>

        <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-gray-400">
          {tl('lastUpdated')}: {updatedAt}
        </p>

        <p className="mt-8 border-l-2 border-cyan-400/50 pl-5 text-lg leading-relaxed text-gray-300">
          {t('intro')}
        </p>

        <div className="mt-12 space-y-10">
          {blocks.map((block) => (
            <section key={block.title}>
              <h2 className="mb-3 text-xl font-bold text-white">{t(block.title)}</h2>
              <p className="leading-relaxed text-gray-400">{t(block.body)}</p>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
