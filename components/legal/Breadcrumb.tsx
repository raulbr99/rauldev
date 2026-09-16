'use client';

import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface BreadcrumbProps {
  section: 'notice' | 'privacy' | 'cookies';
  locale: 'es' | 'en';
}

const PAGE_HREF: Record<'notice' | 'privacy' | 'cookies', string> = {
  notice: 'aviso-legal',
  privacy: 'privacidad',
  cookies: 'cookies',
};

const PAGE_TITLE_KEY: Record<'notice' | 'privacy' | 'cookies', string> = {
  notice: 'notice.title',
  privacy: 'privacy.title',
  cookies: 'cookies.title',
};

export default function LegalBreadcrumb({ section, locale }: BreadcrumbProps) {
  const t = useTranslations('legal');
  const homeLabel = t('breadcrumbHome');
  const pageLabel = t(PAGE_TITLE_KEY[section]);
  const homeHref = locale === 'es' ? '/' : `/${locale}/`;
  const pageHref = locale === 'es' ? `/${PAGE_HREF[section]}` : `/${locale}/${PAGE_HREF[section]}`;

  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-2"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
        <li className="flex items-center gap-2">
          <Link
            href={homeHref}
            className="transition-colors hover:text-cyan-300"
            aria-label={homeLabel}
          >
            {homeLabel}
          </Link>
        </li>
        <li className="flex items-center gap-2">
          <ChevronRight
            className="h-3 w-3 flex-shrink-0 text-gray-700"
            aria-hidden="true"
          />
          <Link
            href={pageHref}
            className="text-gray-400 hover:text-cyan-300 transition-colors"
            aria-current="page"
          >
            {pageLabel}
          </Link>
        </li>
      </ol>
    </nav>
  );
}