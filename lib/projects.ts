import projectsData from '@/data/projects.json';

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  logo?: string;
  github: string | null;
  demo: string | null;
  /** La misma demo publicada en otro sitio (p. ej., Spacefast), si la hay. */
  mirror?: { label: string; url: string };
  /** Slug del artículo del blog que cuenta cómo se hizo, si lo hay. */
  blog?: string;
  featured: boolean;
  category: string;
  createdAt: string;
  status?: string;
}

/** Los proyectos de la portada, tal cual están en data/projects.json. */
export const projects: Project[] = projectsData.projects;
