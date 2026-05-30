import { useTranslations } from 'next-intl';
import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs,
  SiPython, SiMongodb, SiPostgresql, SiTailwindcss,
  SiJavascript, SiNestjs, SiWordpress, SiGooglecloud,
  SiAmazon, SiGithub, SiStrapi, SiSupabase,
  SiOpenai, SiGoogle
} from 'react-icons/si';

export default function SkillsSection() {
  const t = useTranslations('skills');

  const skills = [
    { name: 'React', icon: <SiReact className="text-cyan-400" />, categoryKey: 'frontend' },
    { name: 'Next.js', icon: <SiNextdotjs className="text-white" />, categoryKey: 'frontend' },
    { name: 'TypeScript', icon: <SiTypescript className="text-blue-600" />, categoryKey: 'frontend' },
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
    <section id="habilidades" className="py-12 px-4 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('title')}</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryKeys.map((catKey, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4 text-center border-b border-white/20 pb-3">
                {t(`categories.${catKey}`)}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {skills.filter(s => s.categoryKey === catKey).map((skill, index) => (
                  <div
                    key={index}
                    className="rounded-lg p-1 hover:bg-white/10 transition-colors flex flex-col items-center text-center"
                  >
                    <div className="text-2xl mb-2">{skill.icon}</div>
                    <h4 className="text-white font-semibold text-xs">{skill.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
