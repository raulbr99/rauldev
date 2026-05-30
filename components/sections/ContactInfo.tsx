'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ContactInfo() {
  const t = useTranslations('contact.info');

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-6">{t('title')}</h3>
      <p className="text-gray-300 mb-6">
        {t('description')}
      </p>
      <div className="space-y-3">
        <a
          href="mailto:raulbernariera99@gmail.com"
          className="group flex items-center gap-4 border border-white/10 px-4 py-3 text-gray-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
        >
          <Mail className="w-5 h-5 text-cyan-400" />
          <span className="font-mono text-sm">raulbernariera99@gmail.com</span>
        </a>
        <a
          href="tel:+34680359990"
          className="group flex items-center gap-4 border border-white/10 px-4 py-3 text-gray-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
        >
          <Phone className="w-5 h-5 text-cyan-400" />
          <span className="font-mono text-sm">+34 680 359 990</span>
        </a>
        <div className="flex items-center gap-4 border border-white/10 px-4 py-3">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <span className="font-mono text-sm text-gray-300">{t('location')}</span>
        </div>
      </div>
    </div>
  );
}
