import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { experiences } from '../../data/experience';
import Reveal from '../anim/Reveal';
import SectionHeading from '../ui/SectionHeading';

// Mapeo de IDs de experiencia a claves de traducción
const experienceKeyMap: Record<string, string> = {
    'nanonino-sl-2': 'nanoninoCurrent',
    'nanonino-sl': 'nanonino',
    'evvant-sl': 'evvant',
};

export default function ExperienceSection() {
    const t = useTranslations('experience');

    const getTypeLabel = (type: string) => {
        const typeMap: Record<string, string> = {
            'Remoto': t('types.remote'),
            'Presencial': t('types.onsite'),
            'Híbrido': t('types.hybrid'),
        };
        return typeMap[type] || type;
    };

    return (
        <section id="experiencia" className="bg-techgrid px-4 py-20">
            <div className="mx-auto max-w-5xl">
                <SectionHeading number="02" label="EXPERIENCE" title={t('title')} subtitle={t('subtitle')} />

                <div className="border-t border-white/10">
                    {experiences.map((exp, index) => {
                        const expKey = experienceKeyMap[exp.id];
                        const role = expKey ? t(`data.${expKey}.role`) : exp.role;
                        const description = expKey ? t(`data.${expKey}.description`) : exp.description;
                        const achievements = expKey
                            ? (t.raw(`data.${expKey}.achievements`) as string[])
                            : exp.achievements;

                        return (
                            <Reveal key={exp.id} delay={index * 0.05} amount={0.15}>
                                <article className="group grid gap-6 border-b border-white/10 py-10 transition-colors hover:bg-white/[0.02] md:grid-cols-[10rem_1fr] md:gap-10">
                                    {/* índice + periodo */}
                                    <div className="flex items-baseline gap-4 md:flex-col md:gap-2">
                                        <span className="font-mono text-5xl font-bold leading-none text-white/25 transition-colors group-hover:text-cyan-400/50">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        {exp.period && (
                                            <span className="font-mono text-xs text-gray-400">{exp.period}</span>
                                        )}
                                    </div>

                                    {/* contenido */}
                                    <div>
                                        <div className="mb-1.5 flex flex-wrap items-center gap-3">
                                            <h3 className="text-2xl font-bold text-white">{role}</h3>
                                            {exp.highlight && (
                                                <span className="border border-cyan-400/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                                                    {t('featured')}
                                                </span>
                                            )}
                                        </div>

                                        <p className="mb-3 font-mono text-sm text-cyan-400">{exp.company}</p>

                                        <div className="mb-4 flex flex-wrap gap-4 font-mono text-xs text-gray-400">
                                            {exp.location && (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {exp.location}
                                                </span>
                                            )}
                                            <span className="uppercase tracking-wider">{getTypeLabel(exp.type)}</span>
                                        </div>

                                        <p className="mb-5 max-w-2xl leading-relaxed text-gray-300">{description}</p>

                                        {exp.projects && exp.projects.length > 0 && (
                                            <div className="mb-6">
                                                <p className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-gray-400">
                                                    {t('builtProjects')}
                                                </p>
                                                <div className="flex flex-wrap gap-3">
                                                    {exp.projects.map((proj) => (
                                                        <a
                                                            key={proj.name}
                                                            href={proj.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label={proj.name}
                                                            className="flex items-center rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 transition-all hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-white/[0.06]"
                                                        >
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={proj.logo}
                                                                alt={proj.name}
                                                                className="h-7 w-auto opacity-80 brightness-0 invert transition-opacity group-hover:opacity-100"
                                                            />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <ul className="mb-5 space-y-1.5">
                                            {achievements.map((achievement, achIndex) => (
                                                <li key={achIndex} className="flex items-start gap-2.5 text-sm text-gray-400">
                                                    <span className="mt-0.5 text-cyan-400">▹</span>
                                                    {achievement}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="flex flex-wrap gap-2">
                                            {exp.tech.map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="border border-white/10 px-2.5 py-1 font-mono text-[11px] text-gray-400 transition-colors group-hover:border-white/20"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
