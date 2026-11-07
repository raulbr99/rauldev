# rauldev.dev

Portfolio personal de Raúl Berná, Full Stack Developer en Alicante. Cuenta qué construyo (apps web, bots y herramientas de IA), dónde trabajo, mis proyectos y lo que pruebo de IA en el blog, con un chat que responde sobre todo eso.

En producción en [rauldev.dev](https://rauldev.dev): español en `/` e inglés en `/en`.

## Qué hay en la web

- **Portada**: presentación, sobre mí, experiencia, habilidades, proyectos, últimos artículos del blog, preguntas frecuentes y formulario de contacto.
- **Blog** (`/blog`): artículos en Markdown, en español y en inglés.
- **Chat con IA**: responde en primera persona sobre mi experiencia, mis proyectos y el blog. Usa OpenAI (gpt-4.1-mini) y, si no responde, Vercel AI Gateway. Sus instrucciones y datos están en `lib/raul-context.ts` y salen de los mismos datos que pinta la web.
- **Contacto**: el formulario envía un correo con Resend.
- **Páginas legales**: aviso legal, privacidad y cookies.
- **SEO**: metadatos, canonical y hreflang por página, un bloque JSON-LD por página, `sitemap.xml`, `robots.txt`, RSS del blog (`/feed.xml`, `/en/feed.xml`), una imagen social por artículo (`/og/<idioma>/<slug>.png`) y `llms.txt` para agentes de IA (se genera en el build desde `content/llms.txt` más la lista de artículos y de posts en redes).

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, next-intl 4, Motion, AI SDK, Resend, Upstash Redis y Vercel Analytics / Speed Insights. Tests con Vitest. Se despliega en Vercel.

## Estructura

```
app/
  [locale]/            páginas por idioma (portada, blog, legales, 404)
  api/chat/            chat con IA (streaming)
  api/contact/         formulario de contacto
  sitemap.ts, robots.ts
components/            secciones, layout, chat, blog y legales
content/blog/es|en/    artículos en Markdown (el nombre del fichero es la URL)
data/                  proyectos (projects.json) y experiencia (experience.ts)
messages/              textos en español e inglés
i18n/                  idiomas y rutas de next-intl
lib/                   blog, contexto del chat, JSON-LD, límite de peticiones
proxy.ts               middleware de next-intl (el idioma lo decide la URL)
public/                imágenes, manifest y llms.txt
tests/                 tests de Vitest
```

## Desarrollo

Requiere Node 24.

```bash
npm install
npm run dev         # http://localhost:3000
npm run typecheck   # tsc --noEmit
npm run lint
npm test            # vitest
npm run build
```

`npm run build` descarga las fuentes de Google Fonts, así que necesita red.

## Variables de entorno

| Variable | Para qué | Si falta |
| --- | --- | --- |
| `OPENAI_API_KEY` | Chat con OpenAI directamente | El chat va solo por Vercel AI Gateway |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway fuera de Vercel (en Vercel se autentica solo) | En local, el respaldo del chat no funciona |
| `RESEND_API_KEY` | Envío del formulario de contacto | El formulario no puede enviar |
| `KV_REST_API_URL` y `KV_REST_API_TOKEN` (o `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`) | Límite de peticiones del chat y del formulario en Upstash Redis | Se cuenta en memoria, por instancia |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Verificación de Google Search Console | No se pinta la etiqueta |

## Contenido

- **Artículo nuevo**: copia `content/blog/es/plantilla-de-articulo.md`, cambia el nombre del fichero (será la URL) y rellena la cabecera. Con `draft: true` solo se ve en `npm run dev`. Para la versión en inglés, el mismo nombre en `content/blog/en/`: así los dos idiomas se enlazan con hreflang.
- **Proyectos**: `data/projects.json`, sus textos traducidos en `messages/*.json` (`projects.data.<clave>`) y la clave en `lib/project-keys.ts`. El número de proyectos de la web sale de este fichero.
- **Experiencia**: `data/experience.ts` y sus textos en `messages/*.json` (`experience.data.<clave>`).
- Si cambian datos de perfil, revisa también `content/llms.txt` (lo escrito a mano de `llms.txt`; el blog y las redes se añaden solos).
- La sección «Lo último en redes» lee `data/social-posts.json`: al publicar un post nuevo, regenera ese fichero.

## Contacto

- Formulario: [rauldev.dev/#contacto](https://rauldev.dev/#contacto)
- LinkedIn: [linkedin.com/in/raul-berna-riera](https://www.linkedin.com/in/raul-berna-riera)
- GitHub: [github.com/raulbr99](https://github.com/raulbr99)
