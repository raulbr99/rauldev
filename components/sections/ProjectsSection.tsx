'use client';

import { useTranslations } from 'next-intl';
import { useProjects } from '../../hooks/useProjects';
import LoadingSpinner from '../ui/LoadingSpinner';
import ProjectCard from '../ui/ProjectCard';
import SectionHeading from '../ui/SectionHeading';

export default function ProjectsSection() {
  const { projects, loading } = useProjects();
  const t = useTranslations('projects');

  if (loading) {
    return (
      <section id="proyectos" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <LoadingSpinner />
          <p className="text-gray-300 mt-4">{t('loading')}</p>
        </div>
      </section>
    );
  }

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
