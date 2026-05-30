import { setRequestLocale } from 'next-intl/server';
import Navigation from '@/components/layout/Navigation';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import AuroraBackground from '@/components/anim/AuroraBackground';
import ScrollProgress from '@/components/anim/ScrollProgress';
import Reveal from '@/components/anim/Reveal';
import ChatWidget from '@/components/chat/ChatWidget';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <AuroraBackground />
      <ScrollProgress />
      <Navigation />
      <HeroSection />
      <Reveal><AboutSection /></Reveal>
      <Reveal><ExperienceSection /></Reveal>
      <Reveal><SkillsSection /></Reveal>
      <Reveal><ProjectsSection /></Reveal>
      <Reveal><ContactSection /></Reveal>
      <ChatWidget />
    </div>
  );
}
