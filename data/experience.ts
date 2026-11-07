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
    /** Featured products built during this role (logo shown in the card). */
    projects?: { name: string; logo: string; url: string; /** Proporción del SVG (su viewBox), para reservar el hueco. */ width: number; height: number }[];
}

export const experiences: ExperienceItem[] = [
    {
        id: 'nanonino-sl-2',
        company: 'Nanonino SL',
        role: 'Full Stack Developer',
        period: 'Oct 2025 - Actualidad',
        location: 'Alicante, España',
        type: 'Presencial',
        description: 'Segunda etapa en la empresa, desarrollando Talkrev, una plataforma SaaS de IA conversacional multi-tenant (chat, voz en tiempo real y reservas), Turno, su agente de IA para restaurantes, y PartsNow.ai, su producto de agentic commerce para piezas de camión y tráiler.',
        achievements: [
            'Desarrollé Talkrev, una plataforma SaaS de IA conversacional multi-tenant con chat y voz en tiempo real, incluyendo el dashboard del agente',
            'Con el equipo de Talkrev estamos construyendo Turno, un agente de IA para restaurantes que atiende por mensaje y por teléfono: coge reservas, responde dudas, organiza cenas de grupo y deja que el equipo dicte las comandas con una nota de voz',
            'Construí un pipeline RAG para dar contexto a los agentes sobre la base de conocimiento de cada cliente',
            'Implementé los agentes conversacionales y de voz en tiempo real, además de integraciones con otros agentes de IA',
            'Construí PartsNow.ai: comercio con IA para piezas de camión con búsqueda por chat, voz, foto o VIN sobre un catálogo de +50.000 piezas y checkout unificado',
            'Integré pasarelas de pago y envíos automatizados, con backend y despliegue continuo en la nube'
        ],
        tech: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Supabase', 'OpenAI API', 'Vercel'],
        highlight: true,
        projects: [
            { name: 'Talkrev', logo: '/logos/talkrev.svg', url: 'https://talkrev.ai', width: 205, height: 42 },
            { name: 'Turno', logo: '/logos/turno.svg', url: 'https://turno.ai', width: 960, height: 383 },
            { name: 'PartsNow.ai', logo: '/logos/partsnow.svg', url: 'https://partsnow.ai', width: 1076, height: 350 }
        ]
    },
    {
        id: 'nanonino-sl',
        company: 'Nanonino SL',
        role: 'Full Stack Developer',
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
        role: 'Full Stack Developer',
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
