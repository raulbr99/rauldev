'use client';

import { Download } from 'lucide-react';
import SkillsSection from './SkillsSection';

export default function AboutSection() {
  return (
    <section
      id="sobre-mi"
      className="py-20 px-4 bg-black/20"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              itemProp="jobTitle"
            >
              Sobre Mí
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Desarrollador full stack especializado en <strong>React</strong>,{" "}
              <strong>Next.js</strong> y <strong>Node.js</strong>. Ayudo a
              startups y empresas a crear productos digitales escalables,
              rápidos y fáciles de mantener.
            </p>

            {/* About description */}
            <div className="text-lg text-gray-300 mb-8 leading-relaxed">
              Soy <strong>Raúl</strong>, desarrollador con más de{" "}
              <strong>3 años de experiencia</strong> construyendo aplicaciones
              web. He trabajado en{" "}
              <strong>e-commerce, SaaS multi-tenant y paneles de
                administración</strong>, siempre con foco en rendimiento,
              usabilidad y buenas prácticas.
              <br />
              <br />
              • Proyectos reales con clientes y equipos ágiles
              • Experiencia en productos de alto rendimiento
              • Enfoque en experiencia de usuario y escalabilidad
              • Colaboraciones con startups y pymes en España
            </div>

            {/* Hidden SEO content for local search */}
            <div className="sr-only">
              Desarrollador web en Alicante y Comunidad Valenciana, especializado en React, Next.js y Node.js.
              Desarrollo de e-commerce, SaaS y aplicaciones para empresas y negocios locales.
              Soluciones digitales para startups y pymes en la Vega Baja y el área mediterránea.
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">💻</div>
                <div className="text-gray-300 text-sm">Aplicaciones Web</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">⚡</div>
                <div className="text-gray-300 text-sm">Rendimiento</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">🤝</div>
                <div className="text-gray-300 text-sm">Colaboración</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">🚀</div>
                <div className="text-gray-300 text-sm">Escalabilidad</div>
              </div>
            </div>
            <a
              href="/cv-raul-br.pdf"
              download
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105"
            >
              <Download className="w-5 h-5 mr-2" />
              Descargar CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
