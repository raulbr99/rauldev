# Configuración de Supabase para el Portafolio

Este documento explica cómo configurar Supabase para gestionar los proyectos del portafolio.

## 1. Configuración Inicial de Supabase

### Crear un proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la URL del proyecto y las claves API

### Configurar la base de datos
Ejecuta el script SQL en tu base de datos de Supabase:

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a "SQL Editor"
3. Copia y pega el contenido de `supabase-setup.sql`
4. Ejecuta el script

Esto creará:
- La tabla `projects` con todas las columnas necesarias
- El bucket `project-images` para almacenar imágenes
- Índices para optimizar las consultas
- Políticas RLS para seguridad
- Datos de ejemplo (opcional)

## 2. Configuración del Proyecto

### Variables de entorno
Copia el archivo `.env.example` a `.env.local` y completa las variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
ADMIN_SECRET_KEY=tu_clave_secreta_admin
```

### Obtener las claves de Supabase
1. **URL del proyecto**: En Settings > API > Project URL
2. **Clave anónima**: En Settings > API > Project API keys > anon public
3. **Clave de servicio**: En Settings > API > Project API keys > service_role (¡MANTÉN ESTA CLAVE SECRETA!)
4. **Clave admin**: Genera una clave secreta fuerte para acceder al panel de administración

## 3. Uso del Sistema

### Panel de Administración
- Accede a `/admin` en tu aplicación
- Ingresa la clave secreta que configuraste en `ADMIN_SECRET_KEY`
- Desde aquí puedes:
  - Crear nuevos proyectos
  - Editar proyectos existentes
  - Eliminar proyectos
  - Marcar proyectos como destacados

### API Endpoints

#### Proyectos

- `GET /api/projects` - Obtener todos los proyectos
- `GET /api/projects/[id]` - Obtener proyecto por ID
- `POST /api/projects` - Crear nuevo proyecto (requiere autenticación admin)
- `PUT /api/projects/[id]` - Actualizar proyecto (requiere autenticación admin)
- `DELETE /api/projects/[id]` - Eliminar proyecto (requiere autenticación admin)

#### Subida de Archivos

- `POST /api/upload` - Subir imagen (requiere autenticación admin)
- `DELETE /api/upload` - Eliminar imagen (requiere autenticación admin)

#### Autenticación Admin

Todos los endpoints de escritura requieren el header:
```
Authorization: Bearer tu_clave_secreta_admin
```

## 4. Estructura de Datos

### Esquema de la tabla `projects`
```sql
CREATE TABLE projects (
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
```

### Storage Bucket

- **Bucket**: `project-images`
- **Acceso**: Público para lectura, autenticado para escritura
- **Límite de tamaño**: 50MB por archivo
- **Tipos permitidos**: JPEG, PNG, WebP, GIF, SVG

### Campos explicados
- `id`: Identificador único del proyecto (slug-friendly)
- `title_key`: Clave de internacionalización para el título
- `description_key`: Clave de internacionalización para la descripción
- `tech`: Array de tecnologías utilizadas
- `image`: URL de la imagen del proyecto
- `github`: URL del repositorio de GitHub
- `demo`: URL de la demo en vivo
- `featured`: Booleano que indica si el proyecto está destacado
- `created_at`: Fecha de creación (automática)
- `updated_at`: Fecha de última actualización (automática)

## 5. Seguridad

### Row Level Security (RLS)
- La tabla tiene RLS habilitado
- Lectura pública permitida para todos los usuarios
- Escritura solo permitida con la clave de servicio (service_role)

### Autenticación de Admin
- El panel de administración requiere una clave secreta
- Las operaciones de escritura en la API requieren autenticación Bearer
- La clave de servicio de Supabase nunca se expone al cliente

## 6. Integración Directa

La aplicación está configurada para cargar proyectos directamente desde Supabase. Si hay algún error de conectividad, se mostrará una lista vacía de proyectos. Esto asegura que siempre tengas control total sobre el contenido mostrado a través del panel de administración.

### Gestión de Errores
- Los errores de conexión se registran en la consola
- Se muestra una lista vacía si no se pueden cargar los proyectos
- El panel de administración permite agregar proyectos fácilmente

## 7. Migración de Datos Existentes

Si ya tienes proyectos definidos estáticamente:
1. Ejecuta el script SQL para crear la tabla
2. Los datos de ejemplo se insertarán automáticamente
3. Usa el panel de administración para agregar más proyectos
4. Los datos estáticos seguirán funcionando como fallback

## 8. Desarrollo Local

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno como se describe arriba

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

4. Accede al panel de administración en `http://localhost:3000/admin`

## 9. Gestión de Imágenes

### Subida de Imágenes

El panel de administración permite:
- Subir imágenes directamente desde tu dispositivo
- Usar URLs de imágenes externas
- Vista previa en tiempo real
- Eliminación automática de imágenes al borrar proyectos

### Formatos Soportados

- JPEG/JPG
- PNG
- WebP
- GIF
- SVG

### Límites

- Tamaño máximo: 50MB por imagen
- Las imágenes se almacenan en Supabase Storage
- URLs públicas generadas automáticamente

## Troubleshooting

### Error de conexión a Supabase
- Verifica que las URLs y claves estén correctas
- Asegúrate de que el proyecto de Supabase esté activo
- Revisa que la tabla `projects` exista

### Error de autenticación en admin
- Verifica que `ADMIN_SECRET_KEY` esté configurada
- Asegúrate de usar la clave correcta en el panel de administración

### Proyectos no se muestran
- Verifica que haya datos en la tabla `projects`
- Revisa la consola del navegador para errores
- El sistema debería usar los datos de fallback si hay problemas