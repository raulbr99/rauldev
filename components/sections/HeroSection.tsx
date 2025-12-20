'use client';

import Image from 'next/image';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Button from '../ui/Button';

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section id="inicio" aria-label="Hero" className="pt-20 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 p-1">
            <div className="w-full h-full rounded-full overflow-hidden">
              <Image
                src="/me.png"
                alt={t('imageAlt')}
                width={128}
                height={128}
                className="w-full h-full object-cover object-center"
                priority
              />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {t('name')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {t('role')}
            </span>
          </h1>
          <div className="sr-only">
            {t('seo')}
          </div>
          <p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: t.raw('description') }}
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              as="a"
              href="#contacto"
              variant="primary"
              className="px-8 py-4 rounded-full font-semibold transform hover:scale-105 shadow-lg"
            >
              {t('cta.contact')}
            </Button>
            <Button
              as="a"
              href="#proyectos"
              variant="secondary"
              className="px-8 py-4 rounded-full font-semibold transform hover:scale-105"
            >
              {t('cta.projects')}
            </Button>
            <Button
              as="a"
              href="/cv-raul.pdf"
              download
              variant="secondary"
              className="px-8 py-4 rounded-full font-semibold transform hover:scale-105 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              {t('cta.downloadCV')}
            </Button>
          </div>
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/raulbr99"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/raul-berna-riera"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:raulbernariera99@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
