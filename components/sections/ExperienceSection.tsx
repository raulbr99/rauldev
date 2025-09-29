// components/sections/ExperienceSection.tsx
'use client';

import { Calendar, MapPin, TrendingUp, Users, Code, Award } from 'lucide-react';
import Card from '../ui/Card';
import { experiences } from '../../data/experience';

export default function ExperienceSection() {
    const getIconComponent = (iconName: string) => {
        const iconMap = {
            Calendar: <Calendar className="w-5 h-5" />,
            Code: <Code className="w-5 h-5" />,
            TrendingUp: <TrendingUp className="w-5 h-5" />,
            Users: <Users className="w-5 h-5" />
        };
        return iconMap[iconName as keyof typeof iconMap] || <Calendar className="w-5 h-5" />;
    };

    return (
        <section id="experiencia" className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Experiencia Profesional
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        Desarrollador Full Stack con sólida experiencia en empresas tech de Alicante y Murcia.
                        Especializado en React, Node.js y tecnologías blockchain, con historial comprobado
                        trabajando en equipos internacionales.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Línea vertical */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-400 to-blue-500 transform md:-translate-x-0.5"></div>

                    {/* Experiencias */}
                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <div
                                key={exp.id}
                                className={`relative flex flex-col md:flex-row gap-8 animate-fade-in ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                                style={{
                                    animationDelay: `${400 + index * 200}ms`,
                                    animationFillMode: 'both'
                                }}
                            >
                                {/* Timeline dot */}
                                <div className={`absolute left-4 md:left-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-900 transform md:-translate-x-2 z-10 ${exp.highlight ? 'bg-yellow-400 animate-pulse' : ''
                                    }`}>
                                    {exp.highlight && (
                                        <div className="absolute -top-1 -left-1 w-6 h-6 bg-yellow-400/30 rounded-full animate-ping"></div>
                                    )}
                                </div>

                                {/* Espaciador para centrar */}
                                <div className="hidden md:block md:w-1/2"></div>

                                {/* Contenido */}
                                <div className={`w-full md:w-1/2 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                                    }`}>
                                    <Card
                                        variant={exp.highlight ? 'gradient' : 'default'}
                                        className={`hover:scale-105 transition-all duration-300 ${exp.highlight ? 'ring-2 ring-yellow-400/50' : ''
                                            }`}
                                    >
                                        {/* Header */}
                                        <div className="flex flex-wrap items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-1">
                                                    {exp.role}
                                                </h3>
                                                <p className="text-blue-400 font-semibold text-lg">
                                                    {exp.company}
                                                </p>
                                            </div>
                                            {exp.highlight && (
                                                <div className="flex items-center gap-1 bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                                                    <Award className="w-4 h-4" />
                                                    Destacado
                                                </div>
                                            )}
                                        </div>

                                        {/* Metadatos */}
                                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-300">
                                            {exp.period && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-blue-400" />
                                                    {exp.period}
                                                </div>
                                            )}
                                            {exp.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4 text-green-400" />
                                                    {exp.location}
                                                </div>
                                            )}
                                            <span className={`px-2 py-1 rounded-full text-xs ${exp.type === 'Remoto' ? 'bg-green-500/20 text-green-300' :
                                                exp.type === 'Híbrido' ? 'bg-blue-500/20 text-blue-300' :
                                                    'bg-gray-500/20 text-gray-300'
                                                }`}>
                                                {exp.type}
                                            </span>
                                        </div>

                                        {/* Descripción */}
                                        <p className="text-gray-300 mb-4 leading-relaxed">
                                            {exp.description}
                                        </p>

                                        {/* Logros */}
                                        <div className="mb-4">
                                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-green-400" />
                                                Logros Clave
                                            </h4>
                                            <ul className="space-y-2">
                                                {exp.achievements.map((achievement, achIndex) => (
                                                    <li key={achIndex} className="text-gray-300 text-sm flex items-start gap-2">
                                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                                        {achievement}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Tecnologías */}
                                        <div>
                                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                                <Code className="w-4 h-4 text-purple-400" />
                                                Stack Técnico
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {exp.tech.map((tech, techIndex) => (
                                                    <span
                                                        key={techIndex}
                                                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs font-medium"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}