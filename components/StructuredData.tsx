import Script from 'next/script';
import { SITE_URL } from '@/lib/site';

interface StructuredDataProps {
  language: 'es' | 'en';
}

export default function StructuredData({ language }: StructuredDataProps) {
  const isSpanish = language === 'es';
  
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Raúl BR",
    "alternateName": "rauldev",
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
    "email": "raulbernariera99@gmail.com",
    "telephone": "+34-680-359-990",
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
      "name": "Raúl BR"
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

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": isSpanish ? "Servicios de Desarrollo Web" : "Web Development Services",
    "description": isSpanish
      ? "Servicios profesionales de desarrollo web, plataformas SaaS, IA conversacional y consultoría técnica para empresas de España, especialmente en la Comunidad Valenciana y Costa Blanca."
      : "Professional web development, SaaS platforms, conversational AI and technical consulting services for companies in Spain, especially in the Valencian Community and Costa Blanca.",
    "provider": {
      "@type": "Person",
      "name": "Raúl BR"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "España"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Comunidad Valenciana"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Costa Blanca"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Vega Baja"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Comarca Bajo Segura"
      }
    ],
    "serviceType": [
      isSpanish ? "Desarrollo Web" : "Web Development",
      isSpanish ? "Plataformas SaaS" : "SaaS Platforms",
      isSpanish ? "IA Conversacional" : "Conversational AI",
      isSpanish ? "Consultoría Técnica" : "Technical Consulting"
    ],
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    }
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
      "name": "Raúl BR"
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
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
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