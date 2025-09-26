import { useState, useEffect } from 'react';
import projectsData from '@/data/projects.json';

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  github: string;
  demo: string;
  featured: boolean;
  category: string;
  createdAt: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular loading para UX
    const timer = setTimeout(() => {
      setProjects(projectsData.projects);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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