'use client';

import { ExternalLink, Github } from 'lucide-react';

export default function ProjectsSection() {
  const projects = [
    {
      title: "Plataforma E-commerce",
      description: "Ejemplo de tienda online moderna con carrito de compras y pasarela de pago",
      image: "/project-placeholder.svg",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      github: "#",
      demo: "#",
      isExample: true
    },
    {
      title: "App de Gestión",
      description: "Sistema de gestión de tareas y proyectos con colaboración en tiempo real",
      image: "/project-placeholder.svg",
      tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      github: "#",
      demo: "#",
      isExample: true
    },
    {
      title: "Dashboard Analítico",
      description: "Panel de control con visualizaciones de datos y métricas en tiempo real",
      image: "/project-placeholder.svg",
      tech: ["React", "D3.js", "API REST", "Tailwind"],
      github: "#",
      demo: "#",
      isExample: true
    }
  ];

  return (
    <section id="proyectos" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Proyectos</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ejemplos de proyectos y tecnologías con las que trabajo
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.isExample ? (
                    <>
                      <span className="flex items-center gap-2 text-gray-500 text-sm">
                        <Github className="w-4 h-4" />
                        Proyecto de ejemplo
                      </span>
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                        Demo
                      </span>
                    </>
                  ) : (
                    <>
                      <a 
                        href={project.github}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4" />
                        Código
                      </a>
                      <a 
                        href={project.demo}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Demo
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}