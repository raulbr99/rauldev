'use client';

import { useLocale } from 'next-intl';
import NextLink from 'next/link';
import { getPathname, usePathname } from '@/i18n/navigation';
import { locales } from '@/i18n/config';

// min-h/w-11 = 44px: mínimo de área táctil en móvil
const base = 'flex min-h-11 min-w-11 items-center justify-center px-2 font-mono text-xs uppercase tracking-widest';

/**
 * ES/EN. El otro idioma es un enlace de verdad a esta misma página en ese
 * idioma (`/blog/x` ↔ `/en/blog/x`, con `hreflang`): sale en el HTML del
 * servidor, así que funciona sin JS, se puede abrir en otra pestaña y los
 * buscadores lo siguen. El idioma actual no es un enlace (no lleva a ningún
 * sitio nuevo).
 *
 * Va con el Link de Next y la URL de `getPathname`, no con el de next-intl:
 * ese fuerza el prefijo al cambiar de idioma (`/es/blog/x`), que el proxy
 * redirige con un 307 a `/blog/x`. La cookie NEXT_LOCALE la sigue poniendo el
 * proxy en cada respuesta, como hasta ahora. Sin prefetch: no hace falta
 * descargar la otra versión de cada página que alguien abre.
 */
export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex gap-1">
      {locales.map((loc) =>
        loc === locale ? (
          <span key={loc} lang={loc} aria-current="true" className={`${base} bg-cyan-400 text-slate-950`}>
            {loc.toUpperCase()}
          </span>
        ) : (
          <NextLink
            key={loc}
            href={getPathname({ href: pathname, locale: loc })}
            hrefLang={loc}
            lang={loc}
            prefetch={false}
            className={`${base} text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400`}
          >
            {loc.toUpperCase()}
          </NextLink>
        ),
      )}
    </div>
  );
}
