import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <p className="font-mono text-7xl font-bold text-cyan-400/30 sm:text-8xl">{t('code')}</p>
      <h1 className="mt-4 text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
        {t('title')}
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-gray-400">{t('description')}</p>
      <Link
        href="/"
        className="mt-9 inline-flex items-center gap-2 bg-cyan-400 px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-wider text-slate-950 transition-colors hover:bg-cyan-300"
      >
        {t('cta')}
      </Link>
    </div>
  );
}
