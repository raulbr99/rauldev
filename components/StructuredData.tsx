import { getTranslations } from 'next-intl/server';
import projectsData from '@/data/projects.json';
import { projectKeyMap } from '@/lib/project-keys';
import { SITE_URL, SITE_OWNER, localeUrl } from '@/lib/site';

interface StructuredDataProps {
  language: 'es' | 'en';
}

/** Fecha de la última revisión de contenido (no cambia en cada build). */
const CONTENT_UPDATED = '2026-09-01';

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const SKILLS = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'JavaScript', 'React Native',
  'Python', 'FastAPI', 'LangChain', 'Conversational AI', 'RAG', 'LLM agents',
  'PostgreSQL', 'Supabase', 'MongoDB', 'Tailwind CSS', 'Vercel', 'Git',
];

/**
 * Un único bloque JSON-LD con `@graph`: la entidad Person es el nodo central
 * y el resto (WebSite, ProfilePage, FAQPage, lista de proyectos) la referencia
 * por `@id`. Así Google y los motores de respuesta (ChatGPT, Perplexity,
 * Claude) reciben una sola entidad coherente en vez de cuatro sueltas.
 *
 * Sin email ni teléfono: en texto plano dentro del HTML son cosecha directa
 * para los scrapers de spam. Los canales reales son el formulario y los
 * enlaces de la página.
 */
export default async function StructuredData({ language }: StructuredDataProps) {
  const isSpanish = language === 'es';
  const tFaq = await getTranslations({ locale: language, namespace: 'faq' });
  const tProjects = await getTranslations({ locale: language, namespace: 'projects' });
  const faqItems = tFaq.raw('items') as { q: string; a: string }[];
  const pageUrl = localeUrl(language);

  const jobTitle = isSpanish ? 'Desarrollador Full Stack' : 'Full Stack Developer';
  const description = isSpanish
    ? 'Full Stack Developer con más de 3 años de experiencia en React, Next.js, Node.js e IA conversacional. Actualmente en Nanonino SL (Alicante) desarrollando Talkrev y PartsNow.ai. Abierto a ofertas como empleado, presencial en Alicante o en remoto.'
    : 'Full Stack Developer with 3+ years of experience in React, Next.js, Node.js and conversational AI. Currently at Nanonino SL (Alicante, Spain) building Talkrev and PartsNow.ai. Open to employment offers, on-site in Alicante or remote.';

  const person = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE_OWNER,
    givenName: 'Raúl',
    familyName: 'Berná',
    // sameAs vincula la entidad: los perfiles deben existir y coincidir
    // exactamente con los que enlaza la web.
    alternateName: ['Raúl Berná Riera', 'Raúl BR', 'rauldev'],
    url: SITE_URL,
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/me.png`,
      caption: SITE_OWNER,
    },
    sameAs: [
      'https://github.com/raulbr99',
      'https://www.linkedin.com/in/raul-berna-riera',
      'https://twitter.com/raulbr99',
    ],
    jobTitle,
    description,
    worksFor: {
      '@type': 'Organization',
      name: 'Nanonino SL',
      url: 'https://talkrev.ai',
      address: { '@type': 'PostalAddress', addressLocality: 'Alicante', addressCountry: 'ES' },
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Full Stack Developer',
      occupationLocation: { '@type': 'City', name: 'Alicante' },
      skills: SKILLS.join(', '),
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Universidad de Alicante',
      sameAs: 'https://www.ua.es',
    },
    knowsLanguage: [
      { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
    knowsAbout: SKILLS,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Alicante',
      addressRegion: 'Comunidad Valenciana',
      addressCountry: 'ES',
    },
    homeLocation: { '@type': 'City', name: 'Alicante' },
    nationality: { '@type': 'Country', name: 'ES' },
  };

  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: `${SITE_OWNER} — Portfolio`,
    alternateName: ['rauldev', 'rauldev.dev'],
    url: SITE_URL,
    description: isSpanish
      ? `Portfolio profesional de ${SITE_OWNER}, Full Stack Developer en Alicante: experiencia, proyectos, habilidades y contacto.`
      : `Professional portfolio of ${SITE_OWNER}, Full Stack Developer in Alicante, Spain: experience, projects, skills and contact.`,
    inLanguage: ['es', 'en'],
    publisher: { '@id': PERSON_ID },
    copyrightHolder: { '@id': PERSON_ID },
    copyrightYear: 2024,
  };

  // ProfilePage es el tipo que Google reconoce para páginas "sobre una
  // persona" (perfiles, portfolios) y el que mejor enlaza el WebPage con la
  // entidad Person.
  const profilePage = {
    '@type': 'ProfilePage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: isSpanish
      ? `${SITE_OWNER} — Full Stack Developer | React, Next.js, Node.js`
      : `${SITE_OWNER} — Full Stack Developer | React, Next.js, Node.js`,
    description,
    inLanguage: language,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    mainEntity: { '@id': PERSON_ID },
    dateCreated: '2024-01-01',
    dateModified: CONTENT_UPDATED,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/og-image.jpg`,
      width: 1200,
      height: 630,
    },
  };

  // Mismo contenido que <FAQSection>, tomado de messages/*.json — una sola
  // fuente de verdad para lo visible y lo marcado como FAQPage.
  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    isPartOf: { '@id': `${pageUrl}#webpage` },
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  // Los proyectos, con el título/descripción traducidos que ve la persona.
  const projectList = {
    '@type': 'ItemList',
    '@id': `${pageUrl}#projects`,
    name: isSpanish ? `Proyectos de ${SITE_OWNER}` : `Projects by ${SITE_OWNER}`,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: projectsData.projects.length,
    itemListElement: projectsData.projects.map((p, i) => {
      const key = projectKeyMap[p.id];
      const item: Record<string, unknown> = {
        '@type': 'CreativeWork',
        name: key && tProjects.has(`data.${key}.title`) ? tProjects(`data.${key}.title`) : p.title,
        description:
          key && tProjects.has(`data.${key}.description`)
            ? tProjects(`data.${key}.description`)
            : p.description,
        author: { '@id': PERSON_ID },
        keywords: p.tech.join(', '),
        dateCreated: p.createdAt,
        image: `${SITE_URL}${p.image}`,
      };
      if (p.demo) item.url = p.demo;
      if (p.github) item.codeRepository = p.github;
      return { '@type': 'ListItem', position: i + 1, item };
    }),
  };

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [person, website, profilePage, faqPage, projectList],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapa las comillas del contenido; se protege además
      // el cierre de etiqueta por si algún texto lo incluyera.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
    />
  );
}
