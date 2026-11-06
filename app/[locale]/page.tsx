import { getTranslations, setRequestLocale } from 'next-intl/server';
import Navigation from '@/components/layout/Navigation';
import SkipLink from '@/components/layout/SkipLink';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import BlogSection from '@/components/sections/BlogSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/anim/ScrollProgress';
import Reveal from '@/components/anim/Reveal';
import LazyChatWidget from '@/components/chat/LazyChatWidget';
import StructuredData from '@/components/StructuredData';
import { locales, type Locale } from '@/i18n/config';
import { SITE_URL, SITE_OWNER, localeUrl, alternatesFor, homeSeo } from '@/lib/site';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

/** Lo propio de la portada; título y descripción llegan del layout. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // `/algo.pdf` no pasa por el proxy y llega aquí con locale 'algo.pdf': el
  // layout lo manda a la 404 y no debe llevarse el canonical de la portada.
  if (!locales.includes(locale as Locale)) return {};
  const isSpanish = locale === 'es';
  const { title, description, ogImageAlt } = homeSeo(locale);

  return {
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
      creator: '@sr_rauldev',
      images: [{ url: `${SITE_URL}/og-image.jpg`, alt: ogImageAlt }],
    },
    alternates: alternatesFor(locale),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const legalLocale = locale as 'es' | 'en';
  const t = await getTranslations({ locale, namespace: 'a11y' });

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <StructuredData language={legalLocale} />
      <SkipLink label={t('skipToContent')} />
      <ScrollProgress />
      <Navigation />
      <main id="contenido">
        <HeroSection />
        <Reveal><AboutSection /></Reveal>
        <Reveal><ExperienceSection /></Reveal>
        <Reveal><SkillsSection /></Reveal>
        <Reveal><ProjectsSection /></Reveal>
        <Reveal><BlogSection locale={locale as Locale} /></Reveal>
        <Reveal><FAQSection locale={locale as 'es' | 'en'} /></Reveal>
        <Reveal><ContactSection /></Reveal>
      </main>
      <Footer />
      <LazyChatWidget />
    </div>
  );
}
