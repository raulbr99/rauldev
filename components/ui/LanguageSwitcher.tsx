'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales } from '@/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          lang={loc}
          aria-current={locale === loc ? 'true' : undefined}
          // min-h/w-11 = 44px: mínimo de área táctil en móvil
          className={`flex min-h-11 min-w-11 items-center justify-center px-2 font-mono text-xs uppercase tracking-widest transition-colors ${
            locale === loc
              ? 'bg-cyan-400 text-slate-950'
              : 'text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
