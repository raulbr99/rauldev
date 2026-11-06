import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next 16 renombra middleware a proxy. El runtime es Node (no edge).
const proxy = createMiddleware(routing);

export default proxy;

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
