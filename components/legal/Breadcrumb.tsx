import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface BreadcrumbProps {
  section: 'notice' | 'privacy' | 'cookies';
}

const SECTION_KEYS: Record<'notice' | 'privacy' | 'cookies', string> = {
  notice: 'breadcrumbNotice',
  privacy: 'breadcrumbPrivacy',
  cookies: 'breadcrumbCookies',
};

export default function LegalBreadcrumb({ section }: BreadcrumbProps) {
  const t = useTranslations('legal');
  const label = t(SECTION_KEYS[section]);

  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-2"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#606060]">
        <li className="flex items-center gap-2">
          <Link
            href="/"
            className="transition-colors hover:text-[#D1FF26]"
            aria-label={t('breadcrumbHome')}
          >
            {t('breadcrumbHome')}
          </Link>
        </li>
        <li className="flex items-center gap-2">
          <ChevronRight
            className="h-3 w-3 flex-shrink-0 text-[#404040]"
            aria-hidden="true"
          />
          <span className="text-[#505050]" aria-current="page">
            LEGAL // {label}
          </span>
        </li>
      </ol>
    </nav>
  );
}