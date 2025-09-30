'use client';

import { Download, Code2, Heart, MapPin } from 'lucide-react';

export default function AboutSection() {
  return (
    <section
      id="sobre-mi"
      className="py-20 px-4 bg-black/20"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header centrado */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            itemProp="jobTitle"
          >
            Sobre Mí
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Más que código, creo soluciones que facilitan la vida de las personas
          </p>
        </div>

        {/* Contenido principal */}
        <div className="max-w-4xl mx-auto">
          {/* Historia personal */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 mb-10 border border-white/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-500/20 p-3 rounded-full">
                <Code2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Mi Historia</h3>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>
                    Mi pasión por la programación comenzó en el instituto cuando descubrí <strong>Scratch</strong>.
                    Ver cómo unas simples instrucciones cobraban vida y creaban algo funcional me fascinó desde el primer momento.
                  </p>
                  <p>
                    Con más de <strong>3 años de experiencia profesional</strong>, he trabajado en proyectos de
                    <strong> e-commerce, SaaS multi-tenant y aplicaciones blockchain</strong>. Pero lo que realmente
                    me motiva cada día no son las tecnologías en sí, sino el <strong>impacto real</strong> que tienen
                    en las personas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lo que me apasiona */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 mb-10 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/20 p-3 rounded-full">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Lo Que Me Mueve</h3>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>
                    Lo que más me apasiona es <strong>crear proyectos que la gente realmente use</strong>.
                    No me conformo con que algo "funcione" técnicamente; quiero que haga la vida de las
                    personas más fácil, más eficiente, más agradable.
                  </p>
                  <p>
                    Cada vez que veo a usuarios finales interactuar con una aplicación que desarrollé y
                    recibo feedback positivo del equipo, sé que estoy haciendo lo que me gusta.
                    <strong>Ese es mi objetivo: resolver problemas reales con tecnología</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de vida personal y profesional */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Vida fuera del código */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🏃‍♂️ Fuera del Código
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Apasionado del <strong>pádel</strong> - nada mejor que desconectar en la pista</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Runner amateur - actualmente preparándome para <strong>varias carreras</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>La disciplina del running me ayuda a mantener la mente clara para resolver problemas complejos</span>
                </li>
              </ul>
            </div>

            {/* Por qué Alicante */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Por Qué Alicante
              </h4>
              <div className="text-gray-300 space-y-3">
                <p>
                  Vivo en Alicante porque aquí está todo lo que importa: <strong>mi familia, mis amigos
                    y un clima increíble</strong> que me permite entrenar al aire libre todo el año.
                </p>
                <p className="text-sm text-gray-400">
                  Busco oportunidades en empresas tech donde pueda aportar valor, trabajar en equipo
                  y seguir creciendo profesionalmente en un entorno desafiante.
                </p>
              </div>
            </div>
          </div>

          {/* Filosofía de trabajo */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-6 mb-10 border border-blue-500/20">
            <h4 className="text-xl font-bold text-white mb-4 text-center">Cómo Trabajo en Equipo</h4>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl mb-2">💬</div>
                <h5 className="text-white font-semibold mb-1">Comunicación Clara</h5>
                <p className="text-gray-400 text-sm">Feedback constante y transparencia en el proceso</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🎯</div>
                <h5 className="text-white font-semibold mb-1">Enfoque en Calidad</h5>
                <p className="text-gray-400 text-sm">Código limpio, testeado y bien documentado</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🤝</div>
                <h5 className="text-white font-semibold mb-1">Trabajo Colaborativo</h5>
                <p className="text-gray-400 text-sm">Me adapto bien a metodologías ágiles y equipos diversos</p>
              </div>
            </div>
          </div>

          {/* Hidden SEO content */}
          <div className="sr-only">
            Desarrollador web en Alicante y Comunidad Valenciana, especializado en React, Next.js y Node.js.
            Desarrollo de e-commerce, SaaS y aplicaciones para empresas y negocios locales.
            Soluciones digitales para startups y pymes en la Vega Baja y el área mediterránea.
          </div>

          {/* Botón de descarga centrado */}
          <div className="text-center">
            <a
              href="/cv-raul.pdf"
              download
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              <Download className="w-5 h-5 mr-2" />
              Descargar CV Completo
            </a>
            <p className="text-gray-400 text-sm mt-3">
              ¿Quieres saber más? Descarga mi CV o hablemos directamente
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}