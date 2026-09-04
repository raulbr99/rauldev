# Portfolio de Raúl BR - Desarrollador Full Stack

¡Bienvenido a mi portfolio personal! Este sitio web presenta las webs que creo para negocios y la experiencia que he adquirido como desarrollador full stack.

## 🚀 Características

- **Diseño Moderno**: Interfaz elegante con gradientes y efectos glassmorphism
- **Responsive**: Optimizado para todos los dispositivos
- **Gestión Dinámica de Proyectos**: Integración con Supabase para administrar proyectos
- **Subida de Imágenes**: Sube imágenes de proyectos directamente a Supabase Storage o usa URLs externas
- **Panel de Administración**: Formulario secreto para agregar/editar proyectos
- **Secciones Completas**:
  - Presentación personal
   - Webs y servicios que ofrezco
  - Portfolio de proyectos (dinámico)
  - Información de contacto
- **SEO Optimizado**: Metadatos configurados para mejor posicionamiento
- **Navegación Suave**: Scroll suave entre secciones
- **Integración Directa con Supabase**: Proyectos cargados directamente desde la base de datos

## 🛠️ Tecnologías Utilizadas

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Supabase** - Base de datos y backend
- **Supabase Storage** - Almacenamiento de imágenes
- **Lucide React** - Iconos modernos
- **Vercel** - Deployment (recomendado)

## 📦 Instalación y Uso

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/raulbr99/rauldev.git
   cd rauldev
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**:
   ```bash
   cp .env.example .env.local
   ```
   Edita `.env.local` con tus credenciales de Supabase

4. **Configura Supabase** (opcional):
   - Crea un proyecto en [Supabase](https://supabase.com)
   - Ejecuta el script SQL de `supabase-setup.sql`
   - Configura las variables de entorno
   - Ver `SUPABASE_SETUP.md` para instrucciones detalladas

5. **Ejecuta el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

6. **Abre tu navegador** en `http://localhost:3000`

## ✏️ Personalización

### Información Personal
Edita el archivo `src/app/page.tsx` para actualizar:
- Tu nombre y título
- Descripción personal
- Enlaces a redes sociales
- Email de contacto

### Proyectos
**Opción 1: Panel de Administración (Recomendado)**
- Accede a `/admin` en tu aplicación
- Usa la clave secreta configurada en `ADMIN_SECRET_KEY`
- Agrega, edita o elimina proyectos desde la interfaz

**Opción 2: Datos de Fallback**
Modifica el array `fallbackProjects` en `src/data/projects.ts`:
```typescript
export const fallbackProjects: Project[] = [
  {
    id: "tu-proyecto",
    titleKey: "projects.tu-proyecto.title",
    descriptionKey: "projects.tu-proyecto.description",
    tech: ["React", "Node.js", "MongoDB"],
    image: "/imagen.jpg",
    github: "https://github.com/tu-usuario/proyecto",
    demo: "https://tu-proyecto.com",
    featured: true
  }
];
```

### Servicios
Actualiza el array `services` en `src/app/page.tsx` para reflejar los servicios que ofreces.

### Estilos
Personaliza los colores y estilos en:
- `src/app/globals.css` - Estilos globales
- `tailwind.config.js` - Configuración de Tailwind

## 🚀 Deployment

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. El deployment será automático con cada push

### Netlify
1. Conecta tu repositorio a Netlify
2. Configura el comando de build: `npm run build`
3. Directorio de publicación: `out`

## 🔧 Gestión de Proyectos

### Panel de Administración
- **URL**: `/admin`
- **Autenticación**: Clave secreta configurada en `ADMIN_SECRET_KEY`
- **Funciones**:
  - Crear nuevos proyectos
  - 🖼️ Subir imágenes de proyectos o usar URLs externas
  - Editar proyectos existentes
  - Eliminar proyectos (elimina automáticamente las imágenes asociadas)
  - Marcar proyectos como destacados
  - 👀 Vista previa en tiempo real con previsualización de imágenes

### Gestión de Imágenes

- **Subida**: Arrastra y suelta o selecciona imágenes directamente desde tu dispositivo
- **Formatos**: JPEG, PNG, WebP, GIF, SVG soportados
- **Límite de Tamaño**: 50MB máximo por imagen
- **Almacenamiento**: Imágenes almacenadas de forma segura en Supabase Storage
- **Auto-limpieza**: Las imágenes se eliminan automáticamente cuando se eliminan los proyectos

### API Endpoints
- `GET /api/projects` - Obtener todos los proyectos
- `GET /api/projects/[id]` - Obtener proyecto específico
- `POST /api/projects` - Crear proyecto (requiere auth)
- `PUT /api/projects/[id]` - Actualizar proyecto (requiere auth)
- `DELETE /api/projects/[id]` - Eliminar proyecto (requiere auth)
- `POST /api/upload` - Subir imagen (requiere auth)
- `DELETE /api/upload` - Eliminar imagen (requiere auth)

## 📧 Contacto

Si tienes un proyecto web o preguntas sobre este portfolio:

- **Email**: raul@ejemplo.com
- **LinkedIn**: [linkedin.com/in/raulbr99](https://linkedin.com/in/raulbr99)
- **GitHub**: [github.com/raulbr99](https://github.com/raulbr99)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo como base para tu propio portfolio.

---

**¿Te gusta este portfolio?** ¡Dale una estrella ⭐ al repositorio y compártelo con otros desarrolladores!
