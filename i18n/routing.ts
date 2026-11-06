import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

/**
 * Configuración de rutas que comparten el proxy y la navegación.
 *
 * El idioma lo decide solo la URL: `/…` es español y `/en/…` inglés. Sin
 * detección, ni la cookie NEXT_LOCALE ni el idioma del navegador redirigen a
 * otra versión, así que un enlace a `/blog` abre siempre el blog en español.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
});
