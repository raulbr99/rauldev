import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import StructuredData from '@/components/StructuredData';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL, localeUrl } from '@/lib/site';
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

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: isSpanish
        ? "Raul Dev - Desarrollador Full Stack | Portfolio Profesional"
        : "Raul Dev - Full Stack Developer | Professional Portfolio",
      template: isSpanish
        ? "%s | Raul Dev - Desarrollador Full Stack"
        : "%s | Raul Dev - Full Stack Developer"
    },
    description: isSpanish
      ? "Desarrollador Full Stack especializado en React, Next.js, Node.js y aplicaciones móviles."
      : "Full Stack Developer specialized in React, Next.js, Node.js and mobile applications.",
    keywords: isSpanish
      ? [
        "desarrollador web", "full stack developer", "React developer", "Next.js",
        "Node.js", "TypeScript", "JavaScript", "freelance developer",
        "portfolio desarrollador", "programador web", "aplicaciones móviles",
        "React Native", "frontend developer", "backend developer",
        "desarrollador freelance", "programador freelance", "web developer",
        "software developer", "Raúl BR", "rauldev", "desarrollo web",
        "páginas web", "aplicaciones web", "e-commerce", "dashboard",
        "UI/UX", "responsive design", "SEO", "performance", "PWA",
        "desarrollador Costa Blanca", "programador Comunidad Valenciana",
        "desarrollo web Valencia", "freelance España"
      ]
      : [
        "web developer", "full stack developer", "React developer", "Next.js",
        "Node.js", "TypeScript", "JavaScript", "freelance developer",
        "developer portfolio", "web programmer", "mobile applications",
        "React Native", "frontend developer", "backend developer",
        "freelance developer", "web developer", "software developer",
        "Raúl BR", "rauldev", "web development", "web apps", "e-commerce",
        "dashboard", "UI/UX", "responsive design", "SEO", "performance", "PWA"
      ],
    authors: [{ name: "Raúl Dev", url: SITE_URL }],
    creator: "Raúl Dev",
    publisher: "Raúl Dev",
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
      type: "website",
      locale: isSpanish ? "es_ES" : "en_US",
      alternateLocale: isSpanish ? ["en_US"] : ["es_ES"],
      url: localeUrl(locale),
      siteName: isSpanish ? "Raúl Dev - Desarrollador Full Stack" : "Raúl Dev - Full Stack Developer",
      title: isSpanish
        ? "Raúl Dev - Desarrollador Full Stack | Portfolio Profesional"
        : "Raúl Dev - Full Stack Developer | Professional Portfolio",
      description: isSpanish
        ? "Desarrollador Full Stack especializado en crear soluciones digitales modernas para empresas y emprendedores en España. Experto en React, Next.js, Node.js y aplicaciones móviles."
        : "Full Stack Developer specialized in creating modern digital solutions for businesses and entrepreneurs. Expert in React, Next.js, Node.js and mobile applications.",
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: isSpanish ? "Raúl Dev - Desarrollador Full Stack" : "Raúl Dev - Full Stack Developer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isSpanish
        ? "Raúl Dev - Desarrollador Full Stack | Portfolio Profesional"
        : "Raúl Dev - Full Stack Developer | Professional Portfolio",
      description: isSpanish
        ? "Desarrollador Full Stack especializado en React, Next.js, Node.js. Creando soluciones digitales modernas."
        : "Full Stack Developer specialized in React, Next.js, Node.js. Creating modern digital solutions.",
      creator: "@raulbr99",
      images: [`${SITE_URL}/og-image.jpg`],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    alternates: {
      canonical: localeUrl(locale),
      languages: {
        'es-ES': SITE_URL,
        'en-US': `${SITE_URL}/en`,
        'x-default': SITE_URL,
      },
    },
    category: "technology",
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RaulDev" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <StructuredData language={locale as 'es' | 'en'} />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
