// This file should only be used on the server side
if (typeof window !== 'undefined') {
  throw new Error('json-storage can only be used on the server side')
}

import fs from 'fs/promises'
import path from 'path'

export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  tech: string[];
  image: string;
  github: string;
  demo: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectsData {
  projects: Project[];
  metadata: {
    version: string;
    lastUpdated: string;
    totalProjects: number;
  };
}

const PROJECTS_FILE_PATH = path.join(process.cwd(), 'data', 'projects.json')

// Función para leer el archivo JSON
export async function readProjectsFromFile(): Promise<ProjectsData> {
  try {
    const fileContent = await fs.readFile(PROJECTS_FILE_PATH, 'utf-8')
    const data: ProjectsData = JSON.parse(fileContent)
    return data
  } catch (error) {
    console.error('Error reading projects file:', error)
    // Retornar estructura por defecto si hay error
    return {
      projects: [],
      metadata: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        totalProjects: 0
      }
    }
  }
}

// Función para escribir al archivo JSON
export async function writeProjectsToFile(data: ProjectsData): Promise<void> {
  try {
    // Actualizar metadata
    data.metadata.lastUpdated = new Date().toISOString()
    data.metadata.totalProjects = data.projects.length
    
    const jsonContent = JSON.stringify(data, null, 2)
    await fs.writeFile(PROJECTS_FILE_PATH, jsonContent, 'utf-8')
  } catch (error) {
    console.error('Error writing projects file:', error)
    throw new Error('Failed to save projects data')
  }
}

// Función para obtener todos los proyectos
export async function getAllProjects(): Promise<Project[]> {
  const data = await readProjectsFromFile()
  return data.projects
}

// Función para obtener proyectos destacados
export async function getFeaturedProjects(): Promise<Project[]> {
  const data = await readProjectsFromFile()
  return data.projects.filter(project => project.featured === true)
}

// Función para obtener un proyecto por ID
export async function getProjectById(id: string): Promise<Project | null> {
  const data = await readProjectsFromFile()
  const project = data.projects.find(p => p.id === id)
  return project || null
}

// Función para crear un nuevo proyecto
export async function createProject(projectData: Omit<Project, 'createdAt' | 'updatedAt'>): Promise<Project> {
  const data = await readProjectsFromFile()
  
  // Verificar si ya existe un proyecto con el mismo ID
  const existingProject = data.projects.find(p => p.id === projectData.id)
  if (existingProject) {
    throw new Error(`Project with ID '${projectData.id}' already exists`)
  }
  
  const now = new Date().toISOString()
  const newProject: Project = {
    ...projectData,
    createdAt: now,
    updatedAt: now
  }
  
  data.projects.push(newProject)
  await writeProjectsToFile(data)
  
  return newProject
}

// Función para actualizar un proyecto existente
export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project | null> {
  const data = await readProjectsFromFile()
  
  const projectIndex = data.projects.findIndex(p => p.id === id)
  if (projectIndex === -1) {
    return null
  }
  
  const updatedProject: Project = {
    ...data.projects[projectIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  data.projects[projectIndex] = updatedProject
  await writeProjectsToFile(data)
  
  return updatedProject
}

// Función para eliminar un proyecto
export async function deleteProject(id: string): Promise<boolean> {
  const data = await readProjectsFromFile()
  
  const projectIndex = data.projects.findIndex(p => p.id === id)
  if (projectIndex === -1) {
    return false
  }
  
  data.projects.splice(projectIndex, 1)
  await writeProjectsToFile(data)
  
  return true
}

// Función para obtener estadísticas
export async function getProjectsStats(): Promise<{
  total: number;
  featured: number;
  technologies: { [key: string]: number };
}> {
  const data = await readProjectsFromFile()
  
  const stats = {
    total: data.projects.length,
    featured: data.projects.filter(p => p.featured).length,
    technologies: {} as { [key: string]: number }
  }
  
  // Contar tecnologías
  data.projects.forEach(project => {
    project.tech.forEach(tech => {
      stats.technologies[tech] = (stats.technologies[tech] || 0) + 1
    })
  })
  
  return stats
}