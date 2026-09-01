import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface BreadcrumbProps {
  /** Clave del bloque dentro de `legal` en los mensajes: notice | privacy | cookies */
  section: 'notice' | 'privacy' | 'cookies';
}

export default function LegalBreadcrumb({ section }: BreadcrumbProps) {
  const t = useTranslations('legal');
  const tSection = useTranslations(`legal.${section}`);

  const crumbs = [
    { href: '/', label: t('breadcrumbHome') },
    { href: '/legal', label: t('breadcrumbLegal') },
    { href: `/${section === 'notice' ? 'aviso-legal' : section === 'privacy' ? 'privacidad' : 'cookies'}`, label: tSection('title'), isCurrent: true },
  ];

  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2">
        {crumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight
                className="h-3.5 w-3.5 flex-shrink-0 text-gray-600"
                aria-hidden="true"
              />
            )}
            {crumb.isCurrent ? (
              <span
                className="font-medium text-white"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="transition-colors hover:text-cyan-300"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}