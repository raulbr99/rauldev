import Script from 'next/script';
import { getTranslations } from 'next-intl/server';
import { SITE_URL } from '@/lib/site';

interface StructuredDataProps {
  language: 'es' | 'en';
}

export default async function StructuredData({ language }: StructuredDataProps) {
  const isSpanish = language === 'es';
  const tFaq = await getTranslations({ locale: language, namespace: 'faq' });
  const faqItems = tFaq.raw('items') as { q: string; a: string }[];
  
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Raúl Berná",
    "alternateName": ["Raúl BR", "rauldev", "Raúl Berná Riera"],
    "url": SITE_URL,
    "image": `${SITE_URL}/me.png`,
    // sameAs vincula la entidad: los perfiles deben existir y coincidir
    // exactamente con los que enlaza la web.
    "sameAs": [
      "https://github.com/raulbr99",
      "https://www.linkedin.com/in/raul-berna-riera",
      "https://twitter.com/raulbr99"
    ],
    "jobTitle": isSpanish ? "Desarrollador Full Stack" : "Full Stack Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Nanonino SL",
      "url": "https://talkrev.ai"
    },
    "knowsAbout": [
      "React", "Next.js", "Node.js", "TypeScript", "JavaScript",
      "Python", "FastAPI", "LangChain", "Conversational AI", "RAG",
      "PostgreSQL", "Supabase", "Tailwind CSS", "Git"
    ],
    "description": isSpanish
      ? "Desarrollador Full Stack especializado en React, Next.js, Node.js e IA conversacional, creando aplicaciones web y plataformas SaaS modernas para empresas de España y la zona mediterránea."
      : "Full Stack Developer specialized in React, Next.js, Node.js and conversational AI, building modern web applications and SaaS platforms for companies in Spain and the Mediterranean area.",
    // Sin email ni teléfono en el JSON-LD: en texto plano dentro del HTML son
    // cosecha directa para los scrapers de spam. Los canales de contacto reales
    // son el formulario y los enlaces de la página.
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ES",
      "addressRegion": "Comunidad Valenciana"
    },
    "serviceArea": [
      {
        "@type": "AdministrativeArea",
        "name": "España"
      },
      {
        "@type": "AdministrativeArea", 
        "name": "Comunidad Valenciana"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Costa Blanca"
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Raúl BR - Desarrollador Full Stack",
    "alternateName": "rauldev",
    "url": SITE_URL,
    "description": isSpanish
      ? "Portfolio profesional de Raúl BR, desarrollador Full Stack especializado en React, Next.js, Node.js e IA conversacional."
      : "Professional portfolio of Raúl BR, Full Stack developer specialized in React, Next.js, Node.js and conversational AI.",
    "inLanguage": ["es-ES", "en-US"],
    "author": {
      "@type": "Person",
      "name": "Raúl Berná"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Nota: aquí hubo un schema "ProfessionalService" (servicios de desarrollo web
  // a la carta, área de cobertura, disponibilidad). Se quitó porque contradecía
  // el objetivo real del sitio: que le contraten como empleado, no captar
  // clientes freelance. Un Person con jobTitle/worksFor ya comunica lo correcto.

  // Mismo contenido que <FAQSection>, tomado de messages/*.json — una sola
  // fuente de verdad para lo visible y lo marcado como FAQPage.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a },
    })),
  };

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": isSpanish ? "Portfolio de Raúl BR" : "Raúl BR Portfolio",
    "description": isSpanish
      ? "Colección de proyectos web y plataformas SaaS desarrolladas por Raúl BR."
      : "Collection of web projects and SaaS platforms developed by Raúl BR.",
    "author": {
      "@type": "Person",
      "name": "Raúl Berná"
    },
    "dateCreated": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "genre": "Portfolio",
    "inLanguage": ["es-ES", "en-US"]
  };

  return (
    <>
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Script
        id="portfolio-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(portfolioSchema),
        }}
      />
    </>
  );
}