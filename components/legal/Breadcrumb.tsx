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
      className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2">
        <li className="flex items-center gap-2">
          <Link href="/" className="transition-colors hover:text-cyan-300">
            {t('breadcrumbHome')}
          </Link>
        </li>
        <li className="flex items-center gap-2">
          <ChevronRight
            className="h-3.5 w-3.5 flex-shrink-0 text-gray-600"
            aria-hidden="true"
          />
          <span className="font-medium text-white" aria-current="page">
            {tSection('title')}
          </span>
        </li>
      </ol>
    </nav>
  );
}