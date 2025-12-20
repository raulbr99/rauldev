'use client';

import { useTranslations } from 'next-intl';
import { useProjects } from '../../hooks/useProjects';
import LoadingSpinner from '../ui/LoadingSpinner';
import ProjectCard from '../ui/ProjectCard';

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
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#contacto"
            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105"
          >
            {t('viewAll')}
          </a>
        </div>
      </div>
    </section>
  );
}
