'use client';

import { useTranslations } from 'next-intl';
import ProjectCard from '@/components/ui/ProjectCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { projects } from '@/lib/projects';

/**
 * Proyectos de la portada. Los datos son un JSON fijo, así que no hay estado de
 * carga: las tarjetas salen hechas en el HTML.
 *
 * Sigue siendo de cliente a propósito. Probado el 07-11 como componente de
 * servidor (ProjectCard también): el HTML y las capturas salen iguales, pero
 * Turbopack (Next 16.4.5) mete next/image y Link en dos trozos de JS nuevos,
 * repetidos, y la portada pasa de 1.125.433 a 1.179.144 bytes de JS.
 */
export default function ProjectsSection() {
  const t = useTranslations('projects');

  return (
    <section id="proyectos" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeading number="04" label="WORK" title={t('title')} subtitle={t('subtitle')} />

        <div className="grid gap-6 auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-12">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 border border-white/25 px-8 py-4 font-mono text-sm font-medium uppercase tracking-wider text-white transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
          >
            {t('viewAll')} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
