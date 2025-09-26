import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Verificar si las variables de entorno están disponibles
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using fallback mode.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Cliente para operaciones administrativas (solo en servidor)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null

// Tipos para la base de datos
export interface DatabaseProject {
  id: string
  title_key: string
  description_key: string
  tech: string[]
  image: string
  github: string
  demo: string
  featured: boolean
  created_at: string
  updated_at: string
}

// Servicio para manejar archivos en Supabase Storage
export const storageService = {
  async uploadImage(file: File, fileName: string): Promise<string> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not initialized');
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${fileName}-${timestamp}.${fileExtension}`;

    const { data, error } = await supabaseAdmin.storage
      .from('project-images')
      .upload(uniqueFileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('project-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  async deleteImage(imageUrl: string): Promise<void> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not initialized');
    }

    // Extract file path from URL
    const urlParts = imageUrl.split('/storage/v1/object/public/project-images/');
    if (urlParts.length < 2) return; // Invalid URL format
    
    const filePath = urlParts[1];
    
    const { error } = await supabaseAdmin.storage
      .from('project-images')
      .remove([filePath]);

    if (error) {
      console.warn('Failed to delete image from storage:', error);
      // Don't throw error as this is not critical
    }
  }
};

// Funciones para manejar proyectos
export const projectsService = {
  // Obtener todos los proyectos
  async getAll(): Promise<DatabaseProject[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Obtener proyectos destacados
  async getFeatured(): Promise<DatabaseProject[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Obtener proyecto por ID
  async getById(id: string): Promise<DatabaseProject | null> {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data
  },

  // Crear nuevo proyecto (solo admin)
  async create(project: Omit<DatabaseProject, 'created_at' | 'updated_at'>): Promise<DatabaseProject> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not initialized')
    }
    
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Actualizar proyecto (solo admin)
  async update(id: string, updates: Partial<Omit<DatabaseProject, 'id' | 'created_at' | 'updated_at'>>): Promise<DatabaseProject> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not initialized')
    }
    
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Eliminar proyecto (solo admin)
  async delete(id: string): Promise<void> {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not initialized')
    }
    
    // Get project to find image URL before deletion
    const project = await this.getById(id);
    
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    // Delete associated image from storage
    if (project?.image && project.image.includes('project-images')) {
      await storageService.deleteImage(project.image);
    }
  }
}