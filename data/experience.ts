// data/experience.ts

export interface ExperienceItem {
    id: string;
    company: string;
    role: string;
    period: string;
    location: string;
    type: 'Remoto' | 'Presencial' | 'Híbrido';
    description: string;
    achievements: string[];
    tech: string[];
    highlight?: boolean;
}

export const experiences: ExperienceItem[] = [
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
        highlight: true
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
    },
    {
        id: 'proyectos-personales',
        company: 'Proyectos Personales',
        role: 'Desarrollador Independiente',
        period: '2020 - Presente',
        location: 'España',
        type: 'Remoto',
        description: 'Desarrollo de proyectos SaaS, e-commerce y herramientas web utilizando tecnologías modernas.',
        achievements: [
            'Fadesso: SaaS multi-tenant para barberías con reservas online, gestión de barberos/servicios y roles',
            'E-commerce headless con Printful + Strapi y sincronización automática por webhooks',
            'Generador/Gestor de contraseñas con cifrado, autenticación y medidor de fortaleza',
            'Implementé arquitecturas escalables usando Next.js, TypeScript y Supabase',
            'Demostré capacidad de llevar proyectos desde concepto hasta producción'
        ],
        tech: ['Next.js', 'TypeScript', 'Supabase', 'Strapi', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
        highlight: false
    }
];

export const stats = [
    { label: 'Años de Experiencia', value: '2+', icon: 'Calendar' },
    { label: 'Proyectos Completados', value: '15+', icon: 'Code' },
    { label: 'Tecnologías Dominadas', value: '12+', icon: 'TrendingUp' },
    { label: 'Equipos Internacionales', value: '3', icon: 'Users' }
];