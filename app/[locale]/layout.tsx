import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import StructuredData from '@/components/StructuredData';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL, SITE_OWNER, localeUrl, alternatesFor } from '@/lib/site';
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSpanish = locale === 'es';

  // Título ≤ 60 caracteres con el nombre real primero: es lo que se busca
  // ("Raúl Berná"), y lo que un recruiter ve en la pestaña y en Google.
  const title = `${SITE_OWNER} — Full Stack Developer | React, Next.js, Node.js`;
  const description = isSpanish
    ? 'Full Stack Developer con más de 3 años de experiencia en React, Next.js, Node.js e IA conversacional. Actualmente en Nanonino SL (Talkrev, PartsNow.ai). Abierto a ofertas en Alicante o en remoto.'
    : 'Full Stack Developer with 3+ years of experience in React, Next.js, Node.js and conversational AI. Currently at Nanonino SL (Talkrev, PartsNow.ai). Open to roles in Alicante, Spain, or remote.';
  const ogImageAlt = isSpanish
    ? `${SITE_OWNER}, Full Stack Developer en Alicante`
    : `${SITE_OWNER}, Full Stack Developer in Alicante, Spain`;

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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'profile',
      firstName: 'Raúl',
      lastName: 'Berná',
      username: 'raulbr99',
      locale: isSpanish ? 'es_ES' : 'en_US',
      alternateLocale: isSpanish ? ['en_US'] : ['es_ES'],
      url: localeUrl(locale),
      siteName: `${SITE_OWNER} — Portfolio`,
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@raulbr99',
      images: [{ url: `${SITE_URL}/og-image.jpg`, alt: ogImageAlt }],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    alternates: alternatesFor(locale),
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
    (['navigation', 'projects', 'contact', 'validation', 'chat', 'error', 'a11y'] as const)
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Raúl Berná" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <StructuredData language={locale as 'es' | 'en'} />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={clientMessages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
