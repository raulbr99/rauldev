'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(es|en)/, '') || '/';
    const newPath = newLocale === 'es' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className="flex gap-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            locale === loc
              ? 'bg-blue-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
