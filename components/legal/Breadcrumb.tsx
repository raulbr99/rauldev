import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface BreadcrumbProps {
  section: 'notice' | 'privacy' | 'cookies';
}

export default function LegalBreadcrumb({ section }: BreadcrumbProps) {
  const t = useTranslations('legal');
  const tSection = useTranslations(`legal.${section}`);

  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-2"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
        <li className="flex items-center gap-2">
          <Link
            href="/"
            className="transition-colors hover:text-yellow-400"
            aria-label={t('breadcrumbHome')}
          >
            {t('breadcrumbHome')}
          </Link>
        </li>
        <li className="flex items-center gap-2">
          <ChevronRight
            className="h-3 w-3 flex-shrink-0 text-gray-600"
            aria-hidden="true"
          />
          <span className="text-gray-300" aria-current="page">
            {tSection('title')}
          </span>
        </li>
      </ol>
    </nav>
  );
}