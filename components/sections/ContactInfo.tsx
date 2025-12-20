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
      <div className="space-y-4">
        <a
          href="mailto:raulbernariera99@gmail.com"
          className="flex items-center gap-4 text-gray-300 hover:text-blue-400 transition-colors group"
        >
          <Mail className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
          <span>raulbernariera99@gmail.com</span>
        </a>
        <a
          href="tel:+34680359990"
          className="flex items-center gap-4 text-gray-300 hover:text-blue-400 transition-colors group"
        >
          <Phone className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
          <span>+34 680 359 990</span>
        </a>
        <div className="flex items-center gap-4">
          <MapPin className="w-6 h-6 text-blue-400" />
          <span className="text-gray-300">{t('location')}</span>
        </div>
      </div>
    </div>
  );
}
