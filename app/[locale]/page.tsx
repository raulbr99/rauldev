import { getTranslations, setRequestLocale } from 'next-intl/server';
import Navigation from '@/components/layout/Navigation';
import SkipLink from '@/components/layout/SkipLink';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import Footer from '@/components/layout/Footer';
import AuroraBackground from '@/components/anim/AuroraBackground';
import ScrollProgress from '@/components/anim/ScrollProgress';
import Reveal from '@/components/anim/Reveal';
import LazyChatWidget from '@/components/chat/LazyChatWidget';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'a11y' });

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <SkipLink label={t('skipToContent')} />
      <AuroraBackground />
      <ScrollProgress />
      <Navigation />
      <main id="contenido">
        <HeroSection />
        <Reveal><AboutSection /></Reveal>
        <Reveal><ExperienceSection /></Reveal>
        <Reveal><SkillsSection /></Reveal>
        <Reveal><ProjectsSection /></Reveal>
        <Reveal><FAQSection /></Reveal>
        <Reveal><ContactSection /></Reveal>
      </main>
      <Footer />
      <LazyChatWidget />
    </div>
  );
}
