import { Download, Code2, Heart, Globe2, GraduationCap, Languages, Activity, MessageSquare, Target, Handshake } from 'lucide-react';
import { useTranslations } from 'next-intl';
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

        {/* Cifras */}
        <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10 mb-14">
          {[
            { to: 3, suffix: '+', label: t('stats.years') },
            { to: 10, suffix: '', label: t('stats.projects') },
            { to: 18, suffix: '+', label: t('stats.technologies') },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-slate-950/60 p-6 transition-colors hover:bg-cyan-950/20"
            >
              <span className="block text-4xl font-semibold text-white md:text-5xl">
                {s.to}{s.suffix}
              </span>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/[0.03] p-8 mb-10 border border-white/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="border border-cyan-400/30 p-3">
                <Code2 className="w-6 h-6 text-cyan-300" />
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

          <div className="bg-white/[0.03] p-8 mb-10 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="border border-cyan-400/30 p-3">
                <Heart className="w-6 h-6 text-cyan-300" />
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
            <div className="bg-white/[0.03] p-6 border border-white/10 hover:border-white/20 transition-colors">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-300" />
                {t('hobbies.title')}
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-300 mt-1">•</span>
                  <span dangerouslySetInnerHTML={{ __html: t.raw('hobbies.item1') }} />
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-300 mt-1">•</span>
                  <span dangerouslySetInnerHTML={{ __html: t.raw('hobbies.item2') }} />
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-300 mt-1">•</span>
                  <span>{t('hobbies.item3')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] p-6 border border-white/10 hover:border-white/20 transition-colors">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-cyan-300" />
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
            <div className="bg-white/[0.03] p-6 border border-white/10 hover:border-white/20 transition-colors">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-300" />
                {t('education.title')}
              </h4>
              <div className="text-gray-300">
                <p className="font-semibold">{t('education.degree')}</p>
                <p className="text-sm text-gray-400 mt-1">{t('education.institution')}</p>
              </div>
            </div>

            <div className="bg-white/[0.03] p-6 border border-white/10 hover:border-white/20 transition-colors">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Languages className="w-5 h-5 text-cyan-300" />
                {t('languages.title')}
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center justify-between gap-4">
                  <span>{t('languages.spanish.name')}</span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400">{t('languages.spanish.level')}</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span>{t('languages.english.name')}</span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400">{t('languages.english.level')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/[0.03] p-6 mb-10 border border-white/10">
            <h4 className="text-xl font-bold text-white mb-4 text-center">{t('teamwork.title')}</h4>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <MessageSquare className="mx-auto mb-3 h-7 w-7 text-cyan-300" aria-hidden />
                <h5 className="text-white font-semibold mb-1">{t('teamwork.communication.title')}</h5>
                <p className="text-gray-400 text-sm">{t('teamwork.communication.description')}</p>
              </div>
              <div>
                <Target className="mx-auto mb-3 h-7 w-7 text-cyan-300" aria-hidden />
                <h5 className="text-white font-semibold mb-1">{t('teamwork.quality.title')}</h5>
                <p className="text-gray-400 text-sm">{t('teamwork.quality.description')}</p>
              </div>
              <div>
                <Handshake className="mx-auto mb-3 h-7 w-7 text-cyan-300" aria-hidden />
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
