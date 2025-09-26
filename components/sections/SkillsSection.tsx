'use client';

import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs,
  SiPython, SiMongodb, SiPostgresql, SiTailwindcss,
  SiJavascript, SiNestjs
} from 'react-icons/si';

export default function SkillsSection() {
  const skills = [
    { name: 'JavaScript', icon: <SiJavascript className="text-yellow-500" />, level: 'Avanzado', category: 'Frontend' },
    { name: 'React', icon: <SiReact className="text-sky-400" />, level: 'Avanzado', category: 'Frontend' },
    { name: 'Next.js', icon: <SiNextdotjs className="text-white" />, level: 'Avanzado', category: 'Frontend' },
    { name: 'TypeScript', icon: <SiTypescript className="text-blue-500" />, level: 'Avanzado', category: 'Frontend' },
    { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-cyan-400" />, level: 'Avanzado', category: 'Frontend' },

    { name: 'Node.js', icon: <SiNodedotjs className="text-green-500" />, level: 'Avanzado', category: 'Backend' },
    { name: 'NestJS', icon: <SiNestjs className="text-red-500" />, level: 'Avanzado', category: 'Backend' },
    { name: 'Python', icon: <SiPython className="text-yellow-400" />, level: 'Intermedio', category: 'Backend' },

    { name: 'MongoDB', icon: <SiMongodb className="text-green-400" />, level: 'Avanzado', category: 'Base de datos' },
    { name: 'PostgreSQL', icon: <SiPostgresql className="text-sky-500" />, level: 'Intermedio', category: 'Base de datos' },
  ];

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <section id="habilidades" className="py-20 px-4 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Habilidades</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tecnologías y herramientas con las que trabajo
          </p>
        </div>

        {categories.map((cat, i) => (
          <div key={i} className="mb-12">
            <h3 className="text-2xl font-semibold text-white mb-6">{cat}</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {skills.filter(s => s.category === cat).map((skill, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 
                             hover:scale-105 transition-transform shadow-lg flex flex-col items-center text-center"
                >
                  <div className="text-5xl mb-4">{skill.icon}</div>
                  <h4 className="text-white font-bold text-lg">{skill.name}</h4>
                  <p className="text-gray-400 text-sm mt-2">{skill.level}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
