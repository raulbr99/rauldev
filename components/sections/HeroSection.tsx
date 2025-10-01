'use client';

import Image from 'next/image';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import Button from '../ui/Button';

export default function HeroSection() {
  return (
    <section id="inicio" aria-label="Hero" className="pt-20 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 p-1">
            <div className="w-full h-full rounded-full overflow-hidden">
              <Image
                src="/me.png"
                alt="Raúl BR - Full Stack Developer"
                width={128}
                height={128}
                className="w-full h-full object-cover object-center"
                priority={false} // Si no es LCP
                loading="eager" // Solo si es crítica
              />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Raúl Berna
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Full Stack Developer
            </span>
          </h1>
          {/* SEO Optimized hidden text */}
          <div className="sr-only">
            Desarrollador full stack con experiencia en React, Next.js, Node.js y TypeScript.
            Desarrollo de aplicaciones web en Alicante y Comunidad Valenciana. E-commerce,
            SaaS, paneles de administración y soluciones escalables para startups y pymes.
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Desarrollador especializado en <strong>React</strong>, <strong>Next.js</strong> y <strong>Node.js</strong>.
            He trabajado en <strong>e-commerce</strong>, <strong>SaaS multi-tenant</strong> y <strong>paneles de administración </strong>
            diseñados para rendimiento y escalabilidad. Ayudo a <strong>startups y empresas</strong> a convertir ideas en
            productos digitales sólidos, fáciles de mantener y listos para crecer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              as="a"
              href="#contacto"
              variant="primary"
              className="px-8 py-4 rounded-full font-semibold transform hover:scale-105 shadow-lg"
            >
              Hablemos
            </Button>
            <Button
              as="a"
              href="#proyectos"
              variant="secondary"
              className="px-8 py-4 rounded-full font-semibold transform hover:scale-105"
            >
              Ver Proyectos
            </Button>
            <Button
              as="a"
              href="/cv-raul.pdf"
              download
              variant="secondary"
              className="px-8 py-4 rounded-full font-semibold transform hover:scale-105 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Descargar CV
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
