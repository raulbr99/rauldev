// data/experience.ts

export interface ExperienceItem {
    id: string;
    company: string;
    role: string;
    period?: string;
    location?: string;
    type: 'Remoto' | 'Presencial' | 'Híbrido';
    description: string;
    achievements: string[];
    tech: string[];
    highlight?: boolean;
}

export const experiences: ExperienceItem[] = [
    {
        id: 'talkrev',
        company: 'Talkrev',
        role: 'Full Stack Developer',
        period: 'Oct 2025 - Actualidad',
        location: 'Remoto',
        type: 'Remoto',
        description: 'Desarrollo de la plataforma de IA conversacional de Talkrev (chat, voz y reservas) y de PartsNow.ai, su plataforma de agentic commerce para piezas de camión y tráiler.',
        achievements: [
            'Construí PartsNow.ai: comercio con IA para piezas de camión con búsqueda por chat, voz, foto o VIN sobre un catálogo de +50.000 piezas y checkout unificado',
            'Desarrollé el dashboard del agente de chat con IA y la suite de reservas "Turno" en Next.js, con servidor MCP para integración con agentes de IA',
            'Implementé generación programática de vídeos de marketing con Remotion y renderizado en la nube (AWS Lambda)',
            'Integré analítica de producto con PostHog y backend en Supabase, con despliegue continuo en Vercel',
            'Desarrollé scrapers para alimentar catálogos e inventario en tiempo real'
        ],
        tech: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Supabase', 'MCP', 'OpenAI API', 'Remotion', 'PostHog', 'Vercel'],
        highlight: true
    },
    {
        id: 'nanonino-sl-2',
        company: 'Nanonino SL',
        role: 'Fullstack Developer',
        period: 'Oct 2025 - Actualidad',
        location: 'Alicante, España',
        type: 'Presencial',
        description: 'Segunda etapa en la empresa, continuando el desarrollo de aplicaciones web y soluciones digitales.',
        achievements: [
            'Reincorporación al equipo de desarrollo tras experiencia internacional',
            'Continuando con el desarrollo de aplicaciones web modernas'
        ],
        tech: ['JavaScript', 'TypeScript', 'React', 'NextJS', 'Node.js', 'MongoDB'],
        highlight: false
    },
    {
        id: 'nanonino-sl',
        company: 'Nanonino SL',
        role: 'Fullstack Developer',
        period: 'Sep 2022 - Jun 2024',
        location: 'Alicante, España',
        type: 'Presencial',
        description: 'Desarrollo de aplicaciones web y blockchain, trabajando con equipos internacionales en India y España.',
        achievements: [
            'Desarrollé aplicaciones web progresivas con buen rendimiento gestionando grandes volúmenes de datos',
            'Implementé contratos inteligentes optimizando interacciones y transacciones digitales en blockchain',
            'Creé sistema de reservas con IA para campos de golf con interacciones por voz y chat',
            'Desarrollé e-commerce de productos CBD con landing page, catálogo y buscador avanzado con Algolia',
            'Colaboré efectivamente con equipos multiculturales en India y España'
        ],
        tech: ['JavaScript', 'TypeScript', 'React', 'NextJS', 'Node.js', 'MongoDB', 'OpenAI API', 'Algolia', 'Blockchain'],
        highlight: false
    },
    {
        id: 'evvant-sl',
        company: 'Evvant SL',
        role: 'Fullstack Developer',
        period: 'Jan 2022 - May 2022',
        location: 'Murcia, España',
        type: 'Remoto',
        description: 'Desarrollo de sistema de reservas completo, garantizando escalabilidad y seguridad con mejoras continuas de rendimiento.',
        achievements: [
            'Creé sistema de reservas completo con ReactJS y NodeJS optimizado para escalabilidad y seguridad',
            'Implementé mapa interactivo dinámico que facilitaba la elección y reserva de unidades',
            'Desarrollé funcionalidades clave para comprar, cancelar y modificar reservas de forma sencilla',
            'Apliqué optimizaciones de rendimiento continuas garantizando rapidez y mejor UX',
            'Entregué solución robusta que mejoró significativamente la experiencia del usuario'
        ],
        tech: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Express', 'CSS'],
        highlight: false
    }
];
