import { SITE_URL, SITE_OWNER, localeUrl } from '@/lib/site';

/**
 * Piezas comunes del JSON-LD. Cada página pinta un único bloque `@graph` con
 * estas entidades (Person, Organization, WebSite) más las suyas, y todas se
 * enlazan por `@id`: así cada página se entiende sola sin repetir en todas
 * las entidades de la portada (FAQ, lista de proyectos…).
 */

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const ORG_ID = `${SITE_URL}/#organization`;

const SKILLS = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'JavaScript', 'React Native',
  'Python', 'FastAPI', 'LangChain', 'Conversational AI', 'RAG', 'LLM agents',
  'PostgreSQL', 'Supabase', 'MongoDB', 'Tailwind CSS', 'Vercel', 'Git',
];

/**
 * URL de una página tal como la escribe el JSON-LD. La portada en español
 * lleva barra final (`https://rauldev.dev/`), igual que `/#person` y
 * `/#website`, para que todos los `#webpage` salgan iguales con o sin barra.
 */
export function pageUrl(locale: string, path = ''): string {
  return path === '' && locale !== 'en' ? `${SITE_URL}/` : localeUrl(locale, path);
}

/** `@id` del WebPage de una ruta. */
export function webPageId(locale: string, path = ''): string {
  return `${pageUrl(locale, path)}#webpage`;
}

export function personDescription(locale: string): string {
  return locale === 'en'
    ? 'Full Stack Developer with 4+ years of experience building real products: e-commerce, multi-tenant SaaS and conversational AI (RAG, LangChain, real-time voice). Currently at Nanonino SL (Alicante) building Talkrev and PartsNow.ai. Core stack: React, Next.js, Node.js, TypeScript, Python/FastAPI. Builds web apps, bots and AI tools, and tests new AI releases to show what worked and what didn\'t.'
    : 'Full Stack Developer con 4+ años de experiencia construyendo productos reales: e-commerce, SaaS multi-tenant e IA conversacional (RAG, LangChain, voz en tiempo real). Actualmente en Nanonino SL (Alicante) desarrollando Talkrev y PartsNow.ai. Stack principal: React, Next.js, Node.js, TypeScript, Python/FastAPI. Construye apps web, bots y herramientas de IA, y prueba lo nuevo que sale en IA para contar qué funcionó y qué no.';
}

/**
 * Person, Organization y WebSite. Sin email ni teléfono: en texto plano
 * dentro del HTML son cosecha directa para los scrapers de spam.
 */
export function baseNodes(locale: string): Record<string, unknown>[] {
  const isSpanish = locale !== 'en';

  const person = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE_OWNER,
    givenName: 'Raúl',
    familyName: 'Berná',
    alternateName: ['Raúl Berná Riera', 'Raúl BR', 'rauldev'],
    url: SITE_URL,
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/me.jpg`,
      caption: SITE_OWNER,
    },
    // sameAs vincula la entidad: los perfiles deben existir y coincidir
    // exactamente con los que enlaza la web.
    sameAs: [
      'https://github.com/raulbr99',
      'https://www.linkedin.com/in/raul-berna-riera',
      'https://x.com/sr_rauldev',
      'https://www.instagram.com/raulberna.dev/',
    ],
    jobTitle: 'Full Stack Developer',
    description: personDescription(locale),
    worksFor: { '@id': ORG_ID },
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

  const organization = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Nanonino SL',
    url: 'https://nanonino.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Alicante',
      addressCountry: 'ES',
    },
    sameAs: ['https://talkrev.ai', 'https://partsnow.ai'],
  };

  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: `${SITE_OWNER} — Portfolio`,
    alternateName: ['rauldev', 'rauldev.dev'],
    url: SITE_URL,
    description: isSpanish
      ? `Portfolio profesional de ${SITE_OWNER}, Full Stack Developer en Alicante: experiencia, proyectos, habilidades, blog y contacto.`
      : `Professional portfolio of ${SITE_OWNER}, Full Stack Developer in Alicante: experience, projects, skills, blog and contact.`,
    inLanguage: ['es', 'en'],
    publisher: { '@id': PERSON_ID },
    copyrightHolder: { '@id': PERSON_ID },
    copyrightYear: 2026,
  };

  return [person, organization, website];
}

/** Elemento de una miga de pan (BreadcrumbList). */
export function crumb(position: number, locale: string, path: string, name: string) {
  return {
    '@type': 'ListItem',
    position,
    item: {
      '@type': 'WebPage',
      '@id': webPageId(locale, path),
      url: pageUrl(locale, path),
      name,
    },
  };
}

/** Serializa el grafo para un `<script type="application/ld+json">`. */
export function jsonLdHtml(graph: Record<string, unknown>[]): string {
  // JSON.stringify escapa las comillas; se escapa además `<` para que ningún
  // texto pueda cerrar la etiqueta <script>.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}
