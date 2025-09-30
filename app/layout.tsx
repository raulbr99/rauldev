import type { Metadata } from "next";
import "./globals.css";
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = {
  title: {
    default: "Raul Dev - Desarrollador Full Stack | Portfolio Profesional",
    template: "%s | Raul Dev - Desarrollador Full Stack"
  },
  description: "🚀 Desarrollador Full Stack especializado en React, Next.js, Node.js y aplicaciones móviles.",
  keywords: [
    "desarrollador web", "full stack developer", "React developer", "Next.js",
    "Node.js", "TypeScript", "JavaScript", "freelance developer",
    "portfolio desarrollador", "programador web", "aplicaciones móviles",
    "React Native", "frontend developer", "backend developer",
    "desarrollador freelance", "programador freelance", "web developer",
    "software developer", "Raúl BR", "rauldev", "desarrollo web",
    "páginas web", "aplicaciones web", "e-commerce", "dashboard",
    "UI/UX", "responsive design", "SEO", "performance", "PWA",
    // Palabras clave geográficas sutiles
    "desarrollador Costa Blanca", "programador Comunidad Valenciana",
    "desarrollo web Valencia", "freelance España", "programador Levante",
    "desarrollo software Mediterráneo", "aplicaciones web Vega Baja",
    "programador comarca Bajo Segura", "desarrollador sureste España",
    "freelance Comunitat Valenciana", "desarrollo digital Valencia",
    "programador zona levantina", "software developer Spain",
    // Términos de búsqueda locales implícitos
    "desarrollo web empresas locales", "programador pymes regionales",
    "aplicaciones móviles negocios locales", "e-commerce empresas valencianas",
    "desarrollo software startups mediterráneas", "freelance proyectos regionales"
  ],
  authors: [{ name: "Raúl Dev", url: "https://rauldev.dev" }],
  creator: "Raúl Dev",
  publisher: "Raúl Dev",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_US"],
    url: "https://rauldev.dev",
    siteName: "Raúl Dev - Desarrollador Full Stack",
    title: "Raúl Dev - Desarrollador Full Stack | Portfolio Profesional",
    description: "🚀 Desarrollador Full Stack especializado en crear soluciones digitales modernas para empresas y emprendedores en España. Experto en React, Next.js, Node.js y aplicaciones móviles. Portfolio con proyectos reales y enfoque en calidad.",
    images: [
      {
        url: "https://rauldev.dev/me.webp",
        width: 800,
        height: 800,
        alt: "Raúl Dev - Desarrollador Full Stack",
      },
      {
        url: "https://rauldev.dev/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Raúl Dev - Desarrollador Full Stack Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raúl Dev - Desarrollador Full Stack | Portfolio Profesional",
    description: "🚀 Desarrollador Full Stack especializado en React, Next.js, Node.js. Creando soluciones digitales modernas para empresas y emprendedores en España.",
    creator: "@raulbr99",
    images: ["https://rauldev.dev/me.webp"],
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://rauldev.dev",
    languages: {
      'es-ES': 'https://rauldev.dev',
      'en-US': 'https://rauldev.dev/en',
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme Colors */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RaulDev" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Structured Data */}
        <StructuredData language="es" />
      </head>
      <body
        className={` antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
