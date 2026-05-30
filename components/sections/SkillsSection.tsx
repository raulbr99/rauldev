import { useTranslations } from 'next-intl';
import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs,
  SiPython, SiMongodb, SiPostgresql, SiTailwindcss,
  SiJavascript, SiNestjs, SiWordpress, SiGooglecloud,
  SiAmazon, SiGithub, SiStrapi, SiSupabase,
  SiOpenai, SiGoogle
} from 'react-icons/si';
import Reveal from '../anim/Reveal';
import SectionHeading from '../ui/SectionHeading';

export default function SkillsSection() {
  const t = useTranslations('skills');

  const skills = [
    { name: 'React', icon: <SiReact className="text-cyan-400" />, categoryKey: 'frontend' },
    { name: 'Next.js', icon: <SiNextdotjs className="text-white" />, categoryKey: 'frontend' },
    { name: 'TypeScript', icon: <SiTypescript className="text-blue-500" />, categoryKey: 'frontend' },
    { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-cyan-500" />, categoryKey: 'frontend' },
    { name: 'JavaScript', icon: <SiJavascript className="text-yellow-400" />, categoryKey: 'frontend' },
    { name: 'Node.js', icon: <SiNodedotjs className="text-green-500" />, categoryKey: 'backend' },
    { name: 'NestJS', icon: <SiNestjs className="text-red-500" />, categoryKey: 'backend' },
    { name: 'Python', icon: <SiPython className="text-yellow-400" />, categoryKey: 'backend' },
    { name: 'MongoDB', icon: <SiMongodb className="text-green-400" />, categoryKey: 'database' },
    { name: 'PostgreSQL', icon: <SiPostgresql className="text-sky-500" />, categoryKey: 'database' },
    { name: 'Supabase', icon: <SiSupabase className="text-green-500" />, categoryKey: 'database' },
    { name: 'Google Cloud', icon: <SiGooglecloud className="text-blue-500" />, categoryKey: 'cloud' },
    { name: 'AWS', icon: <SiAmazon className="text-orange-500" />, categoryKey: 'cloud' },
    { name: 'GitHub', icon: <SiGithub className="text-white" />, categoryKey: 'cloud' },
    { name: 'WordPress', icon: <SiWordpress className="text-blue-600" />, categoryKey: 'cms' },
    { name: 'Strapi', icon: <SiStrapi className="text-purple-500" />, categoryKey: 'cms' },
    { name: 'OpenAI', icon: <SiOpenai className="text-green-400" />, categoryKey: 'ai' },
    { name: 'Dialogflow', icon: <SiGoogle className="text-blue-500" />, categoryKey: 'ai' },
  ];

  const categoryKeys = ['frontend', 'backend', 'database', 'cloud', 'cms', 'ai'];

  return (
    <section id="habilidades" className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading number="03" label="STACK" title={t('title')} subtitle={t('subtitle')} />

        <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {categoryKeys.map((catKey, i) => (
            <Reveal key={catKey} delay={i * 0.06} className="h-full">
              <div className="group h-full bg-slate-950/60 p-6 transition-colors hover:bg-cyan-950/20">
                <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="font-mono text-[11px] text-cyan-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-white">
                    {t(`categories.${catKey}`)}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {skills
                    .filter((s) => s.categoryKey === catKey)
                    .map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center gap-2 border border-white/10 px-3 py-2 transition-all hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-white/5"
                      >
                        <span className="text-xl">{skill.icon}</span>
                        <span className="font-mono text-xs text-gray-300">{skill.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
