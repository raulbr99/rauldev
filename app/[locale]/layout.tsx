import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import CommandPalette from '@/components/ui/CommandPalette';
import { getPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { locales, defaultLocale, type Locale } from '@/i18n/config';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL, SITE_OWNER, homeSeo, SOCIAL_URLS } from '@/lib/site';
import { notFoundMetadata } from '@/lib/not-found-metadata';
import type { Metadata } from 'next';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Metadatos comunes a todas las páginas del idioma. Lo que es solo de la
 * portada (canonical, hreflang, robots, Open Graph) vive en `page.tsx`: si
 * estuviera aquí, la 404 heredaría el canonical de la portada.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // `/algo.pdf` llega aquí como locale 'algo.pdf' y acaba en la 404.
  if (!locales.includes(locale as Locale)) {
    return { metadataBase: new URL(SITE_URL), ...(await notFoundMetadata(defaultLocale)) };
  }
  const { title, description } = homeSeo(locale);

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: `${SITE_OWNER} — Portfolio`,
    title: {
      default: title,
      template: `%s · ${SITE_OWNER}`,
    },
    description,
    authors: [{ name: SITE_OWNER, url: SITE_URL }],
    creator: SITE_OWNER,
    publisher: SITE_OWNER,
    // Sin autodetección de email/teléfono/dirección en iOS: evita que Safari
    // convierta texto suelto en enlaces y rompa el diseño.
    formatDetection: { email: false, address: false, telephone: false },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    category: 'technology',
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  // El provider serializa en el HTML todo lo que se le pase, así que solo
  // viajan al cliente los espacios que usan componentes 'use client'. El resto
  // (hero, about, experience, skills, footer, legal…) se resuelve en servidor.
  const clientMessages = Object.fromEntries(
    (['navigation', 'projects', 'contact', 'validation', 'chat', 'error', 'a11y', 'legal', 'footer', 'palette'] as const)
      .filter((ns) => ns in messages)
      .map((ns) => [ns, messages[ns]])
  );

  return (
    // data-scroll-behavior: desde Next 16 hay que declararlo para que el
    // router siga saltando al instante entre rutas pese al smooth global.
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22D3EE" />
        <meta name="msapplication-TileColor" content="#22D3EE" />
        {/* Sin browserconfig.xml: que Edge/IE antiguos no lo pidan (daba 404). */}
        <meta name="msapplication-config" content="none" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Raúl Berná" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
        {/* rel="me": estos perfiles son de la misma persona que esta web (IndieWeb;
            lo usan p. ej. Mastodon y Threads para verificar el enlace). */}
        {Object.values(SOCIAL_URLS).map((href) => (
          <link key={href} rel="me" href={href} />
        ))}
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={clientMessages}>
          {children}
          <CommandPalette
            posts={getPosts(locale as Locale).map(({ slug, title, tags }) => ({ slug, title, tags }))}
          />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
