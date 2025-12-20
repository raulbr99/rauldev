import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    return {
      locale: 'es',
      messages: (await import('../messages/es.json')).default
    };
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
