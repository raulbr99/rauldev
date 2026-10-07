import { useTranslations } from 'next-intl';
import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs,
  SiPython, SiMongodb, SiPostgresql, SiTailwindcss,
  SiJavascript, SiNestjs, SiWordpress, SiGooglecloud,
  SiGithub, SiStrapi, SiSupabase,
  SiOpenaigym, SiGoogle, SiFastapi, SiLangchain,
  SiStripe, SiShopify, SiVercel, SiDocker, SiRedis
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import Reveal from '../anim/Reveal';
import SectionHeading from '../ui/SectionHeading';

export default function SkillsSection() {
  const t = useTranslations('skills');

  const skills = [
    { name: 'React', icon: <SiReact />, categoryKey: 'frontend' },
    { name: 'Next.js', icon: <SiNextdotjs />, categoryKey: 'frontend' },
    { name: 'TypeScript', icon: <SiTypescript />, categoryKey: 'frontend' },
    { name: 'Tailwind CSS', icon: <SiTailwindcss />, categoryKey: 'frontend' },
    { name: 'JavaScript', icon: <SiJavascript />, categoryKey: 'frontend' },
    { name: 'Node.js', icon: <SiNodedotjs />, categoryKey: 'backend' },
    { name: 'NestJS', icon: <SiNestjs />, categoryKey: 'backend' },
    { name: 'Python', icon: <SiPython />, categoryKey: 'backend' },
    { name: 'FastAPI', icon: <SiFastapi />, categoryKey: 'backend' },
    { name: 'Stripe', icon: <SiStripe />, categoryKey: 'backend' },
    { name: 'PostgreSQL', icon: <SiPostgresql />, categoryKey: 'database' },
    { name: 'Supabase', icon: <SiSupabase />, categoryKey: 'database' },
    { name: 'MongoDB', icon: <SiMongodb />, categoryKey: 'database' },
    { name: 'Redis', icon: <SiRedis />, categoryKey: 'database' },
    { name: 'Vercel', icon: <SiVercel />, categoryKey: 'cloud' },
    { name: 'Google Cloud', icon: <SiGooglecloud />, categoryKey: 'cloud' },
    { name: 'AWS', icon: <FaAws />, categoryKey: 'cloud' },
    { name: 'Docker', icon: <SiDocker />, categoryKey: 'cloud' },
    { name: 'GitHub', icon: <SiGithub />, categoryKey: 'cloud' },
    { name: 'Shopify', icon: <SiShopify />, categoryKey: 'cms' },
    { name: 'WordPress', icon: <SiWordpress />, categoryKey: 'cms' },
    { name: 'Strapi', icon: <SiStrapi />, categoryKey: 'cms' },
    { name: 'OpenAI', icon: <SiOpenaigym />, categoryKey: 'ai' },
    { name: 'LangChain', icon: <SiLangchain />, categoryKey: 'ai' },
    { name: 'Dialogflow', icon: <SiGoogle />, categoryKey: 'ai' },
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
                        <span className="text-xl text-gray-400">{skill.icon}</span>
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
