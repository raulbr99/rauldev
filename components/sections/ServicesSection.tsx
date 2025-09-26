'use client';

import { Code, Palette, Smartphone } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Desarrollo Web",
      description: "Aplicaciones web modernas y escalables con React, Next.js y las últimas tecnologías"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Aplicaciones Móviles",
      description: "Apps nativas y multiplataforma con React Native para iOS y Android"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "UI/UX Design",
      description: "Diseño de interfaces intuitivas y experiencias de usuario excepcionales"
    }
  ];

  return (
    <section id="servicios" className="py-20 px-4" itemScope itemType="https://schema.org/Person">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" itemProp="name">Servicios</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto" itemProp="description">
            Soluciones tecnológicas completas para hacer crecer tu negocio
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
              <div className="text-blue-400 mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
              <p className="text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}