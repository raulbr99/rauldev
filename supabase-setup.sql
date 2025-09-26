-- Supabase Setup Script for Portfolio Projects
-- This script creates the necessary table, storage bucket, indexes, and policies for the portfolio project management system

-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title_key TEXT NOT NULL,
  description_key TEXT NOT NULL,
  tech TEXT[] NOT NULL DEFAULT '{}',
  image TEXT NOT NULL,
  github TEXT NOT NULL,
  demo TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo (opcional)
INSERT INTO projects (id, title_key, description_key, tech, image, github, demo, featured)
VALUES 
  (
    'ecommerce',
    'projects.ecommerce.title',
    'projects.ecommerce.description',
    ARRAY['Next.js', 'TypeScript', 'Stripe', 'Prisma'],
    '/project-placeholder.svg',
    'https://github.com/raulbr99/ecommerce',
    'https://ecommerce-demo.vercel.app',
    true
  ),
  (
    'dashboard',
    'projects.dashboard.title',
    'projects.dashboard.description',
    ARRAY['React', 'D3.js', 'Node.js', 'MongoDB'],
    '/project-placeholder.svg',
    'https://github.com/raulbr99/dashboard',
    'https://dashboard-demo.vercel.app',
    true
  ),
  (
    'fitness',
    'projects.fitness.title',
    'projects.fitness.description',
    ARRAY['React Native', 'Firebase', 'Redux', 'API REST'],
    '/project-placeholder.svg',
    'https://github.com/raulbr99/fitness-app',
    'https://fitness-app-demo.com',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for projects table
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Public can read projects" ON projects
  FOR SELECT USING (true);

-- Policy for service role full access (for admin operations)
CREATE POLICY "Service role can manage projects" ON projects
  FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for storage
-- Policy for public read access to project images
CREATE POLICY "Public can view project images" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

-- Policy for service role to manage project images
CREATE POLICY "Service role can manage project images" ON storage.objects
  FOR ALL USING (bucket_id = 'project-images' AND auth.role() = 'service_role');

-- Policy for authenticated users to upload project images
CREATE POLICY "Authenticated users can upload project images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- Comentarios para documentación
COMMENT ON TABLE projects IS 'Tabla para almacenar información de proyectos del portafolio';
COMMENT ON COLUMN projects.id IS 'Identificador único del proyecto';
COMMENT ON COLUMN projects.title_key IS 'Clave de internacionalización para el título';
COMMENT ON COLUMN projects.description_key IS 'Clave de internacionalización para la descripción';
COMMENT ON COLUMN projects.tech IS 'Array de tecnologías utilizadas en el proyecto';
COMMENT ON COLUMN projects.image IS 'URL de la imagen del proyecto';
COMMENT ON COLUMN projects.github IS 'URL del repositorio de GitHub';
COMMENT ON COLUMN projects.demo IS 'URL de la demo en vivo';
COMMENT ON COLUMN projects.featured IS 'Indica si el proyecto está destacado';