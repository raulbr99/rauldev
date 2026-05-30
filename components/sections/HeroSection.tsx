import Image from 'next/image';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Reveal from '../anim/Reveal';
import WordReveal from '../anim/WordReveal';
import MagneticButton from '../anim/MagneticButton';

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section id="inicio" aria-label="Hero" className="pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          {/* Avatar con anillo giratorio + glow */}
          <Reveal direction="none" scale duration={0.9} className="mb-6">
            <div className="relative mx-auto h-36 w-36">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 animate-spin-slow blur-[3px]" />
              <div className="absolute -inset-3 rounded-full bg-cyan-500/25 blur-2xl animate-pulse" />
              <div className="relative h-full w-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 p-1">
                <div className="h-full w-full overflow-hidden rounded-full bg-slate-900">
                  <Image
                    src="/me.png"
                    alt={t('imageAlt')}
                    width={144}
                    height={144}
                    className="h-full w-full object-cover object-center"
                    priority
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <WordReveal text={t('name')} className="block" />
            <WordReveal
              text={t('role')}
              delay={0.45}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 animate-gradient-pan"
            />
          </h1>

          <div className="sr-only">{t('seo')}</div>

          <Reveal delay={0.9} className="mx-auto max-w-3xl">
            <p
              className="text-xl md:text-2xl text-gray-300 mb-8"
              dangerouslySetInnerHTML={{ __html: t.raw('description') }}
            />
          </Reveal>

          <Reveal delay={1.05}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <MagneticButton
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
              >
                {t('cta.contact')}
              </MagneticButton>
              <MagneticButton
                href="#proyectos"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white border-2 border-white/40 hover:border-white/60 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                {t('cta.projects')}
              </MagneticButton>
              <MagneticButton
                href="/cv-raul.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white border-2 border-white/40 hover:border-white/60 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <Download className="w-5 h-5" />
                {t('cta.downloadCV')}
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={1.2}>
            <div className="flex justify-center space-x-6">
              <a
                href="https://github.com/raulbr99"
                aria-label="GitHub"
                className="text-gray-400 transition-all hover:text-white hover:-translate-y-1"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/raul-berna-riera"
                aria-label="LinkedIn"
                className="text-gray-400 transition-all hover:text-white hover:-translate-y-1"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:raulbernariera99@gmail.com"
                aria-label="Email"
                className="text-gray-400 transition-all hover:text-white hover:-translate-y-1"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
