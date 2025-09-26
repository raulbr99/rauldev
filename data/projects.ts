export interface Project {
  id: string
  titleKey: string
  descriptionKey: string
  tech: string[]
  image: string
  github: string
  demo: string
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

// Función para obtener todos los proyectos
export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch('/api/projects')
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }
    const result = await response.json()
    // Extract data from API response structure
    return result.data || result || []
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
}

// Función para obtener proyectos destacados
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const projects = await getProjects()
    return projects.filter(project => project.featured)
  } catch (error) {
    console.error('Error loading featured projects:', error)
    return []
  }
}

// Función para obtener un proyecto por ID
export async function getProjectById(id: string): Promise<Project | undefined> {
  try {
    const response = await fetch(`/api/projects/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch project')
    }
    const project = await response.json()
    return project
  } catch (error) {
    console.error('Error loading project:', error)
    return undefined
  }
}