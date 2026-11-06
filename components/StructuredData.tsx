import { getTranslations } from 'next-intl/server';
import projectsData from '@/data/projects.json';
import { projectKeyMap } from '@/lib/project-keys';
import { SITE_URL, SITE_OWNER, CONTENT_UPDATED } from '@/lib/site';
import {
  PERSON_ID,
  WEBSITE_ID,
  baseNodes,
  crumb,
  jsonLdHtml,
  pageUrl as jsonLdPageUrl,
  personDescription,
  webPageId,
} from '@/lib/structured-data';

interface StructuredDataProps {
  language: 'es' | 'en';
}

/**
 * JSON-LD de la portada, en un único bloque `@graph`: la entidad Person es el
 * nodo central y el resto (WebSite, ProfilePage, FAQPage, lista de proyectos)
 * la referencia por `@id`. Así Google y los motores de respuesta (ChatGPT,
 * Perplexity, Claude) reciben una sola entidad coherente en vez de varias
 * sueltas. El FAQ y la lista de proyectos solo van aquí, en la portada.
 */
export default async function StructuredData({ language }: StructuredDataProps) {
  const isSpanish = language === 'es';
  const tFaq = await getTranslations({ locale: language, namespace: 'faq' });
  const tProjects = await getTranslations({ locale: language, namespace: 'projects' });
  const faqItems = tFaq.raw('items') as { q: string; a: string }[];
  const pageUrl = jsonLdPageUrl(language);
  const description = personDescription(language);

  // ProfilePage es el tipo que Google reconoce para páginas "sobre una
  // persona" (perfiles, portfolios) y el que mejor enlaza el WebPage con la
  // entidad Person.
  const profilePage = {
    '@type': 'ProfilePage',
    '@id': webPageId(language),
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
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#inicio .max-w-xl', '#faq'],
    },
    // El formulario de contacto es el siguiente paso.
    potentialAction: {
      '@type': 'CommunicateAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${pageUrl}#contacto`,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      name: isSpanish ? 'Contactar' : 'Contact',
      description: isSpanish
        ? 'Formulario de contacto para escribir a Raúl Berná.'
        : 'Contact form to write to Raúl Berná.',
    },
  };

  // Mismo contenido que <FAQSection>, tomado de messages/*.json — una sola
  // fuente de verdad para lo visible y lo marcado como FAQPage.
  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    isPartOf: { '@id': webPageId(language) },
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

  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [crumb(1, language, '', isSpanish ? 'Inicio' : 'Home')],
  };

  const chatAssistant = {
    '@type': 'SoftwareApplication',
    '@id': `${pageUrl}#chat-assistant`,
    name: isSpanish ? 'Asistente IA de Raúl Berná' : "Raúl Berná's AI Assistant",
    applicationCategory: 'ConversationalAIApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    description: isSpanish
      ? 'Asistente conversacional integrado en el portfolio para responder consultas sobre la experiencia, stack y proyectos de Raúl Berná. Fundamentado en llms.txt y datos estructurados (Person, FAQPage, ItemList). Responde en español e inglés. No almacena datos personales. Modelo: OpenAI gpt-4.1-mini con fallback a Vercel AI Gateway.'
      : 'Conversational assistant embedded in the portfolio to answer queries about Raúl Berná\'s experience, stack and projects. Grounded in llms.txt and structured data (Person, FAQPage, ItemList). Replies in Spanish and English. No personal data stored. Model: OpenAI gpt-4.1-mini with Vercel AI Gateway fallback.',
    featureList: [
      isSpanish ? 'Respuestas basadas en fuente única de verdad (llms.txt)' : 'Answers grounded in single source of truth (llms.txt)',
      isSpanish
        ? `Métricas concretas: 50k+ piezas, 4+ años, 180 páginas, ${projectsData.projects.length} proyectos`
        : `Concrete metrics: 50k+ parts, 4+ years, 180 pages, ${projectsData.projects.length} projects`,
      isSpanish ? 'Idiomas: español nativo, inglés profesional' : 'Languages: native Spanish, professional English',
      isSpanish ? 'Privacidad: sin almacenamiento permanente, sin cookies de seguimiento' : 'Privacy: no permanent storage, no tracking cookies',
      isSpanish ? 'Accesibilidad: panel de razonamiento visible, copia de respuestas' : 'Accessibility: visible reasoning panel, copy answers',
      isSpanish ? 'Scope estricto: solo perfil profesional, nada de código/traducciones/ejercicios' : 'Strict scope: professional profile only, no code/translations/exercises',
    ],
    publisher: { '@id': PERSON_ID },
    author: { '@id': PERSON_ID },
    dateCreated: '2025-10-01',
    dateModified: CONTENT_UPDATED,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': PERSON_ID },
    potentialAction: {
      '@type': 'InteractAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: pageUrl,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      name: isSpanish ? 'Chatear con el asistente' : 'Chat with assistant',
      description: isSpanish
        ? 'Abre el chat flotante en la esquina inferior derecha para consultar experiencia, stack o proyectos.'
        : 'Open the floating chat in the bottom-right corner to ask about experience, stack or projects.',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: jsonLdHtml([...baseNodes(language), profilePage, faqPage, projectList, breadcrumbList, chatAssistant]),
      }}
    />
  );
}
