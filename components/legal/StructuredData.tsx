import { localeUrl } from '@/lib/site';

type LegalSection = 'notice' | 'privacy' | 'cookies';

interface LegalStructuredDataProps {
  section: LegalSection;
  locale: 'es' | 'en';
}

const CONTENT_UPDATED = '2026-09-03';
const SITE_URL = 'https://rauldev.dev';

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
      description: 'Política de privacidad del portfolio de Raúl Berná. Qué datos personales se recogen, con qué finalidad, base jurídica, derechos del usuario y proveedores que tratan los datos (Vercel, Resend, Upstash). Cumple RGPD y LOPDGDD.',
    },
    en: {
      title: 'Privacy policy',
      description: 'Privacy policy for Raúl Berná portfolio. What personal data is collected, for what purpose, legal basis, user rights and processors (Vercel, Resend, Upstash). GDPR and LOPDGDD compliant.',
    },
  },
  cookies: {
    es: {
      title: 'Política de cookies',
      description: 'Política de cookies del portfolio de Raúl Berná. Solo se usa una cookie técnica (NEXT_LOCALE) para recordar el idioma, exenta de consentimiento. Sin cookies de seguimiento, publicidad ni analítica de terceros.',
    },
    en: {
      title: 'Cookie policy',
      description: 'Cookie policy for Raúl Berná portfolio. Only a single technical cookie (NEXT_LOCALE) is used to remember language preference, exempt from consent. No tracking, advertising or third-party analytics cookies.',
    },
  },
};

const BREADCRUMB_HOME: Record<'es' | 'en', string> = {
  es: 'Inicio',
  en: 'Home',
};

function buildBreadcrumbList(pageUrl: string, title: string, locale: 'es' | 'en') {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/#webpage`,
          url: localeUrl(locale),
          name: BREADCRUMB_HOME[locale],
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
        },
      },
    ],
  };
}

export default async function LegalStructuredData({ section, locale }: LegalStructuredDataProps) {
  const pageUrl = localeUrl(locale, `/${section === 'notice' ? 'aviso-legal' : section}`);
  const info = SECTION_INFO[section][locale];

  const webPage = {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: info.title,
    description: info.description,
    inLanguage: locale,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    datePublished: '2024-01-01',
    dateModified: CONTENT_UPDATED,
    publisher: { '@id': `${SITE_URL}/#person` },
    mainEntity: {
      '@type': 'CreativeWork',
      name: info.title,
      description: info.description,
      author: { '@id': `${SITE_URL}/#person` },
      inLanguage: locale,
    },
  };

  const breadcrumbList = buildBreadcrumbList(pageUrl, info.title, locale);

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [webPage, breadcrumbList],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
    />
  );
}