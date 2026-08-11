import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

// Next 16 renombra middleware a proxy. El runtime es Node (no edge).
const proxy = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default proxy;

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
