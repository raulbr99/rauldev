import { CONTENT_UPDATED } from '@/lib/site';
import { PERSON_ID, WEBSITE_ID, baseNodes, crumb, jsonLdHtml, pageUrl, webPageId } from '@/lib/structured-data';

type LegalSection = 'notice' | 'privacy' | 'cookies';

interface LegalStructuredDataProps {
  section: LegalSection;
  locale: 'es' | 'en';
}

/** Ruta real de cada página legal (la de privacidad es /privacidad, no /privacy). */
const SECTION_PATH: Record<LegalSection, string> = {
  notice: '/aviso-legal',
  privacy: '/privacidad',
  cookies: '/cookies',
};

const SECTION_INFO: Record<LegalSection, { es: { title: string; description: string }; en: { title: string; description: string } }> = {
  notice: {
    es: {
      title: 'Aviso legal',
      description: 'Información legal del sitio web de Raúl Berná, Full Stack Developer en Alicante. Datos del titular, condiciones de uso, propiedad intelectual y legislación aplicable.',
    },
    en: {
      title: 'Legal notice',
      description: 'Legal information for the website of Raúl Berná, Full Stack Developer in Alicante. Site owner details, terms of use, intellectual property and applicable law.',
    },
  },
  privacy: {
    es: {
      title: 'Política de privacidad',
      description: 'Política de privacidad del portfolio de Raúl Berná. Qué datos personales se recogen, con qué finalidad, base jurídica, derechos del usuario y proveedores que tratan los datos (Vercel, Resend, Upstash, OpenAI). Cumple RGPD y LOPDGDD.',
    },
    en: {
      title: 'Privacy policy',
      description: 'Privacy policy for Raúl Berná portfolio. What personal data is collected, for what purpose, legal basis, user rights and processors (Vercel, Resend, Upstash, OpenAI). GDPR and LOPDGDD compliant.',
    },
  },
  cookies: {
    es: {
      title: 'Política de cookies',
      description: 'Política de cookies: solo uso la cookie técnica NEXT_LOCALE para recordar el idioma, exenta de consentimiento. Sin cookies de seguimiento ni analítica de terceros.',
    },
    en: {
      title: 'Cookie policy',
      description: 'Cookie policy: only a technical NEXT_LOCALE cookie remembers language preference, exempt from consent. No tracking or third-party analytics cookies.',
    },
  },
};

const BREADCRUMB_HOME: Record<'es' | 'en', string> = {
  es: 'Inicio',
  en: 'Home',
};

export default async function LegalStructuredData({ section, locale }: LegalStructuredDataProps) {
  const path = SECTION_PATH[section];
  const url = pageUrl(locale, path);
  const info = SECTION_INFO[section][locale];

  const webPage = {
    '@type': 'WebPage',
    '@id': webPageId(locale, path),
    url,
    name: info.title,
    description: info.description,
    inLanguage: locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    datePublished: '2024-01-01',
    dateModified: CONTENT_UPDATED,
    publisher: { '@id': PERSON_ID },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    mainEntity: {
      '@type': 'CreativeWork',
      name: info.title,
      description: info.description,
      author: { '@id': PERSON_ID },
      inLanguage: locale,
    },
  };

  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      crumb(1, locale, '', BREADCRUMB_HOME[locale]),
      crumb(2, locale, path, info.title),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdHtml([...baseNodes(locale), webPage, breadcrumbList]) }}
    />
  );
}
