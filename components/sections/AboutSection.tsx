import { Download, Code2, Heart, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            itemProp="jobTitle"
          >
            {t('title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 mb-10 border border-white/10">
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

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 mb-10 border border-white/10">
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
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
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

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
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

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-6 mb-10 border border-blue-500/20">
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

          <div className="sr-only">
            {t('seo')}
          </div>

          <div className="text-center">
            <a
              href="/cv-raul.pdf"
              download
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              <Download className="w-5 h-5 mr-2" />
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
