'use client';

import Image from 'next/image';
import { ExternalLink, Github, Calendar } from 'lucide-react';
import { Project } from '../../hooks/useProjects';

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105 group">
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-blue-500/80 text-white text-xs rounded-full">
                        {project.category}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {project.title}
                </h3>

                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.slice(0, 4).map((tech: string, index: number) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.tech.length > 4 && (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-md text-xs">
                            +{project.tech.length - 4} más
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                        <a
                            href={project.github}
                            className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="w-4 h-4" />
                            Código
                        </a>
                        <a
                            href={project.demo}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Demo
                        </a>
                    </div>

                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.createdAt).getFullYear()}
                    </div>
                </div>
            </div>
        </div>
    );
}