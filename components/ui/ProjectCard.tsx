'use client';

import Image from 'next/image';
import { ExternalLink, Github, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Project } from '../../hooks/useProjects';
import { projectKeyMap } from '@/lib/project-keys';
import TiltCard from '../anim/TiltCard';

interface ProjectCardProps {
    project: Project;
}

// Mapeo de categorías a claves de traducción
const categoryKeyMap: Record<string, string> = {
    'IA/ML': 'ai',
    'SaaS': 'saas',
    'Web App': 'webapp',
    'Portfolio': 'portfolio',
    'Web Design': 'webdesign',
};

export default function ProjectCard({ project }: ProjectCardProps) {
    const t = useTranslations('projects');

    const projectKey = projectKeyMap[project.id];
    const categoryKey = categoryKeyMap[project.category];

    // Usar traducciones si existen, sino fallback al JSON
    const title = projectKey ? t(`data.${projectKey}.title`) : project.title;
    const description = projectKey ? t(`data.${projectKey}.description`) : project.description;
    const category = categoryKey ? t(`categories.${categoryKey}`) : project.category;

    return (
        <TiltCard className="h-full">
            <div className="group flex h-full flex-col overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur-md transition-colors hover:border-cyan-400/30">
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={project.image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                    <span className="bg-cyan-400 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-950">
                        {category}
                    </span>
                </div>
                {project.logo && (
                    <div className="absolute top-4 left-4 h-10 w-10 overflow-hidden rounded-full border border-white/20 shadow-lg">
                        <Image
                            src={project.logo}
                            alt={`${title} logo`}
                            fill
                            sizes="40px"
                            className="object-cover"
                        />
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {title}
                </h3>

                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6 flex-grow">
                    {project.tech.map((tech: string, index: number) => (
                        <span
                            key={index}
                            className="h-fit border border-white/10 px-2 py-1 font-mono text-[11px] text-gray-400"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-3">
                        {project.github && (
                            <a
                                href={project.github}
                                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="w-4 h-4" />
                                {t('code')}
                            </a>
                        )}
                        {project.demo && (
                            <a
                                href={project.demo}
                                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="w-4 h-4" />
                                {t('demo')}
                            </a>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.createdAt).getFullYear()}
                    </div>
                </div>
            </div>
            </div>
        </TiltCard>
    );
}
