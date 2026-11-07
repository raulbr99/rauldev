import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import CommandPalette from '@/components/ui/CommandPalette';
import { getPosts } from '@/lib/blog';
import { experienceKeyMap, experiences } from '@/data/experience';
import { notFound } from 'next/navigation';
import { locales, defaultLocale, type Locale } from '@/i18n/config';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL, SITE_OWNER, homeSeo, SOCIAL_URLS } from '@/lib/site';
import { notFoundMetadata } from '@/lib/not-found-metadata';
import type { Metadata, Viewport } from 'next';

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
/**
 * El sitio es solo oscuro: `colorScheme` pinta en oscuro lo que dibuja el
 * navegador (barras de scroll, controles de formulario, el fondo antes de que
 * llegue el CSS). `themeColor` es la barra del navegador en móvil.
 */
export const viewport: Viewport = {
  themeColor: '#22D3EE',
  colorScheme: 'dark',
};

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

  // Experiencia para el buscador: textos ya traducidos aquí, en el servidor, para no
  // mandar al navegador todo el namespace `experience`. Cada producto (Talkrev,
  // Turno, PartsNow.ai) y cada empresa llevan a su tarjeta (`/#exp-<id>`).
  const tExp = await getTranslations({ locale, namespace: 'experience' });
  const experienceIndex = experiences.flatMap((exp) => {
    const key = experienceKeyMap[exp.id];
    const period = key && tExp.has(`data.${key}.period`) ? tExp(`data.${key}.period`) : (exp.period ?? '');
    const role = key ? tExp(`data.${key}.role`) : exp.role;
    const description = key ? tExp(`data.${key}.description`) : exp.description;
    const hint = [role, description, exp.tech.join(' '), (exp.projects ?? []).map((p) => p.name).join(' ')].join(' ');
    return [
      // Cada producto solo por su nombre (la descripción nombra a los tres y «turno» los sacaría todos).
      ...(exp.projects ?? []).map((p) => ({ id: `${exp.id}-${p.name}`, target: exp.id, label: `${p.name} · ${exp.company}`, hint: role })),
      { id: exp.id, target: exp.id, label: period ? `${exp.company} · ${period}` : exp.company, hint },
    ];
  });

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
        <meta name="msapplication-TileColor" content="#22D3EE" />
        {/* Sin browserconfig.xml: que Edge/IE antiguos no lo pidan (daba 404). */}
        <meta name="msapplication-config" content="none" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Raúl Berná" />
        {/* ?v=2: iconos nuevos (nov 2026); el número obliga a pedirlos otra vez a quien guardó los antiguos. */}
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
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
            posts={getPosts(locale as Locale).map(({ slug, title, description, tags }) => ({ slug, title, description, tags }))}
            experience={experienceIndex}
          />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
