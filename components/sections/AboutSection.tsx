import { Download, Code2, Heart, MapPin, GraduationCap, Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Counter from '../anim/Counter';
import SectionHeading from '../ui/SectionHeading';

export default function AboutSection() {
  const t = useTranslations('about');

  return (
    <section
      id="sobre-mi"
      className="py-20 px-4 bg-black/20"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeading number="01" label="ABOUT" title={t('title')} subtitle={t('subtitle')} />

        {/* Stats con contadores animados */}
        <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10 mb-14">
          {[
            { to: 3, suffix: '+', label: t('stats.years') },
            { to: 4, suffix: '', label: t('stats.projects') },
            { to: 18, suffix: '+', label: t('stats.technologies') },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-slate-950/60 p-6 transition-colors hover:bg-cyan-950/20"
            >
              <Counter
                to={s.to}
                suffix={s.suffix}
                className="block text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300"
              />
              <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8 mb-10 border border-white/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-500/20 p-3 rounded-full">
                <Code2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">{t('history.title')}</h3>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p dangerouslySetInnerHTML={{ __html: t.raw('history.paragraph1') }} />
                  <p dangerouslySetInnerHTML={{ __html: t.raw('history.paragraph2') }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8 mb-10 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/20 p-3 rounded-full">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">{t('passion.title')}</h3>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p dangerouslySetInnerHTML={{ __html: t.raw('passion.paragraph1') }} />
                  <p dangerouslySetInnerHTML={{ __html: t.raw('passion.paragraph2') }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 hover:bg-white/10 transition-all">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🏃‍♂️ {t('hobbies.title')}
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span dangerouslySetInnerHTML={{ __html: t.raw('hobbies.item1') }} />
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span dangerouslySetInnerHTML={{ __html: t.raw('hobbies.item2') }} />
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{t('hobbies.item3')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 hover:bg-white/10 transition-all">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                {t('location.title')}
              </h4>
              <div className="text-gray-300 space-y-3">
                <p dangerouslySetInnerHTML={{ __html: t.raw('location.description') }} />
                <p className="text-sm text-gray-400">
                  {t('location.seeking')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 hover:bg-white/10 transition-all">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                {t('education.title')}
              </h4>
              <div className="text-gray-300">
                <p className="font-semibold">{t('education.degree')}</p>
                <p className="text-sm text-gray-400 mt-1">{t('education.institution')}</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 hover:bg-white/10 transition-all">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Languages className="w-5 h-5 text-blue-400" />
                {t('languages.title')}
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center justify-between gap-4">
                  <span>{t('languages.spanish.name')}</span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-gray-500">{t('languages.spanish.level')}</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span>{t('languages.english.name')}</span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-gray-500">{t('languages.english.level')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm p-6 mb-10 border border-blue-500/20">
            <h4 className="text-xl font-bold text-white mb-4 text-center">{t('teamwork.title')}</h4>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl mb-2">💬</div>
                <h5 className="text-white font-semibold mb-1">{t('teamwork.communication.title')}</h5>
                <p className="text-gray-400 text-sm">{t('teamwork.communication.description')}</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🎯</div>
                <h5 className="text-white font-semibold mb-1">{t('teamwork.quality.title')}</h5>
                <p className="text-gray-400 text-sm">{t('teamwork.quality.description')}</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🤝</div>
                <h5 className="text-white font-semibold mb-1">{t('teamwork.collaboration.title')}</h5>
                <p className="text-gray-400 text-sm">{t('teamwork.collaboration.description')}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/cv-raul.pdf"
              download
              className="inline-flex items-center gap-2 bg-cyan-400 text-slate-950 px-8 py-4 font-mono text-sm font-medium uppercase tracking-wider hover:bg-cyan-300 transition-colors"
            >
              <Download className="w-5 h-5" />
              {t('downloadCV')}
            </a>
            <p className="text-gray-400 text-sm mt-3">
              {t('downloadCVHint')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
