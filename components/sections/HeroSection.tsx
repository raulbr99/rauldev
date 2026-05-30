import Image from 'next/image';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Reveal from '../anim/Reveal';
import WordReveal from '../anim/WordReveal';
import MagneticButton from '../anim/MagneticButton';

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section
      id="inicio"
      aria-label="Hero"
      className="relative flex min-h-[82vh] items-center bg-techgrid px-4 pt-28 pb-16 lg:min-h-[94vh]"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.35fr_1fr]">
        {/* LEFT — big type */}
        <div>
          <div className="mb-6 flex items-center gap-2.5 font-mono text-xs font-medium tracking-[0.25em] text-cyan-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            OPEN TO WORK
          </div>

          <h1 className="mb-3 text-6xl font-bold uppercase leading-[0.88] text-white sm:text-7xl xl:text-8xl">
            <WordReveal text={t('name')} className="block" />
          </h1>

          <div className="mb-8 text-2xl font-bold uppercase tracking-tight sm:text-4xl">
            <WordReveal
              text={t('role')}
              delay={0.4}
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 animate-gradient-pan"
            />
          </div>

          <div className="sr-only">{t('seo')}</div>

          <Reveal delay={0.9}>
            <p
              className="mb-8 max-w-xl text-lg leading-relaxed text-gray-300/90"
              dangerouslySetInnerHTML={{ __html: t.raw('description') }}
            />
          </Reveal>

          <Reveal delay={1.05}>
            <div className="mb-9 flex flex-wrap gap-3">
              <MagneticButton
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 bg-cyan-400 px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-wider text-slate-950 transition-colors hover:bg-cyan-300"
              >
                {t('cta.contact')}
              </MagneticButton>
              <MagneticButton
                href="#proyectos"
                className="inline-flex items-center justify-center gap-2 border border-white/25 px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-wider text-white transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
              >
                {t('cta.projects')}
              </MagneticButton>
              <MagneticButton
                href="/cv-raul.pdf"
                download
                className="inline-flex items-center justify-center gap-2 border border-white/25 px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-wider text-white transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
              >
                <Download className="h-4 w-4" />
                {t('cta.downloadCV')}
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={1.2}>
            <div className="flex items-center gap-5 font-mono text-xs tracking-widest text-gray-500">
              <span className="hidden sm:inline">FOLLOW</span>
              <span className="hidden h-px w-8 bg-white/15 sm:inline-block" />
              <a href="https://github.com/raulbr99" aria-label="GitHub" className="transition-colors hover:text-cyan-300">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/in/raul-berna-riera" aria-label="LinkedIn" className="transition-colors hover:text-cyan-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:raulbernariera99@gmail.com" aria-label="Email" className="transition-colors hover:text-cyan-300">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* RIGHT — framed "spec card" */}
        <Reveal direction="left" delay={0.6} className="order-first lg:order-last">
          <div className="relative mx-auto max-w-[12rem] sm:max-w-[15rem] lg:max-w-sm">
            {/* accent corner brackets */}
            <span className="absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-cyan-400" />
            <span className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-cyan-400" />
            <span className="absolute -inset-3 -z-10 bg-cyan-500/15 blur-2xl" />

            <div className="border border-white/15 bg-white/[0.03] p-2 backdrop-blur-sm">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src="/me.png"
                  alt={t('imageAlt')}
                  fill
                  sizes="(max-width: 1024px) 20rem, 24rem"
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>

              <dl className="mt-2 border-t border-white/10 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 px-1 py-2">
                  <dt className="text-gray-500">LOC</dt>
                  <dd className="text-gray-200">Alicante, ES</dd>
                </div>
                <div className="flex items-center justify-between px-1 py-2">
                  <dt className="text-gray-500">STACK</dt>
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
