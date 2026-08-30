import { useState } from 'react';
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
  featured: boolean;
  category: string;
  createdAt: string;
  status?: string;
}

export function useProjects() {
  const [projects] = useState<Project[]>(projectsData.projects);
  const loading = false;

  const featuredProjects = projects.filter(p => p.featured);
  
  const getProjectsByCategory = (category: string) => 
    projects.filter(p => p.category === category);
  
  const getProjectById = (id: string) => 
    projects.find(p => p.id === id);

  return {
    projects,
    featuredProjects,
    loading,
    stats: projectsData.stats,
    getProjectsByCategory,
    getProjectById
  };
}