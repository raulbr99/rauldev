import Image from 'next/image';
import { Github, Linkedin, Instagram, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { SiX } from 'react-icons/si';
import { useTranslations } from 'next-intl';
import Reveal from '../anim/Reveal';
import OpenChatButton from '../chat/OpenChatButton';
import { SOCIAL_URLS } from '@/lib/site';

const textLink =
  'inline-flex items-center gap-2 py-2 font-mono text-sm uppercase tracking-wider text-gray-300 transition-colors hover:text-cyan-300';

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section
      id="inicio"
      aria-label="Hero"
      className="relative flex min-h-[70dvh] items-start bg-techgrid px-4 pt-24 pb-12 lg:min-h-[94dvh] lg:items-center lg:pt-28 lg:pb-16"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        {/* LEFT — big type */}
        <div>
          <Reveal trigger="load">
            <h1 className="mb-3 text-6xl font-semibold leading-[0.95] text-white sm:text-7xl xl:text-8xl">
              {t('name')}
            </h1>
            <p className="mb-8 text-2xl font-medium tracking-tight text-cyan-300 sm:text-3xl">
              {t('role')}
            </p>
          </Reveal>

          <Reveal trigger="load" delay={0.1}>
            <p
              className="mb-8 max-w-xl text-lg leading-relaxed text-gray-300/90"
              dangerouslySetInnerHTML={{ __html: t.raw('description') }}
            />
          </Reveal>

          <Reveal trigger="load" delay={0.2}>
            {/* Una acción principal; el resto, enlaces de texto. */}
            <div className="mb-9 flex flex-wrap items-center gap-x-7 gap-y-2">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 bg-cyan-400 px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-wider text-slate-950 transition-colors hover:bg-cyan-300"
              >
                {t('cta.contact')}
              </a>
              <a href="#proyectos" className={textLink}>
                {t('cta.projects')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <OpenChatButton className={textLink}>
                <MessageSquare className="h-4 w-4" aria-hidden />
                {t('cta.askAssistant')}
              </OpenChatButton>
            </div>
          </Reveal>

          <Reveal trigger="load" delay={0.3}>
            <div className="flex items-center gap-5 font-mono text-xs tracking-widest text-gray-400">
              <a href={SOCIAL_URLS.github} aria-label="GitHub" className="-m-2.5 p-2.5 transition-colors hover:text-cyan-300">
                <Github className="h-5 w-5" />
              </a>
              <a href={SOCIAL_URLS.linkedin} aria-label="LinkedIn" className="-m-2.5 p-2.5 transition-colors hover:text-cyan-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={SOCIAL_URLS.x} aria-label="X" className="-m-2.5 p-2.5 transition-colors hover:text-cyan-300">
                <SiX className="h-5 w-5" />
              </a>
              <a href={SOCIAL_URLS.instagram} aria-label="Instagram" className="-m-2.5 p-2.5 transition-colors hover:text-cyan-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:raulbernariera99@gmail.com" aria-label="Email" className="-m-2.5 p-2.5 transition-colors hover:text-cyan-300">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* RIGHT — framed "spec card" */}
        <Reveal trigger="load" direction="left" delay={0.15} className="order-first lg:order-last">
          <div className="relative mx-auto max-w-[9.5rem] sm:max-w-[14rem] lg:max-w-sm">
            {/* accent corner brackets */}
            <span className="absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-cyan-400" />
            <span className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-cyan-400" />

            <div className="border border-white/15 bg-white/[0.03] p-2 backdrop-blur-sm">
              <div className="relative aspect-square overflow-hidden">
                <Image
                   src="/me.jpg"
                  alt={t('imageAlt')}
                  fill
                  sizes="(max-width: 1024px) 20rem, 24rem"
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>

              <dl className="mt-2 hidden border-t border-white/10 font-mono text-xs sm:block">
                <div className="flex items-center justify-between border-b border-white/10 px-1 py-2">
                  <dt className="text-gray-400">LOC</dt>
                  <dd className="text-gray-200">Alicante, ES</dd>
                </div>
                <div className="flex items-center justify-between px-1 py-2">
                  <dt className="text-gray-400">STACK</dt>
                  <dd className="text-cyan-300">React · Next · Node</dd>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
