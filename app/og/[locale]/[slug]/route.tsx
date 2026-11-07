import { ImageResponse } from 'next/og';
import { getPost, getPosts, localImages } from '@/lib/blog';
import { locales, type Locale } from '@/i18n/config';
import { OG_CYAN as CYAN, OG_GRID, OG_INK as INK, OG_SIZE as SIZE, clip, ogFonts, publicDataUrl } from '@/lib/og';
import { SITE_OWNER } from '@/lib/site';

/**
 * Imagen para compartir cada artículo (1200×630): `/og/es/<slug>.png` y
 * `/og/en/<slug>.png`. Se generan en el build con el título, la entradilla y la
 * primera imagen del artículo. El `.png` del final hace que el proxy de
 * next-intl no toque la ruta (su matcher salta las rutas con punto).
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getPosts(locale).map((post) => ({ locale, slug: `${post.slug}.png` })),
  );
}

/** Primera imagen JPEG o PNG del artículo como data URL (next/og solo dibuja esas dos). */
function firstImage(body: string): string | undefined {
  const src = localImages(body).find((image) => /\.(?:jpe?g|png)$/i.test(image));
  return src ? publicDataUrl(src) : undefined;
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = getPost(locale as Locale, slug.replace(/\.png$/, ''));
  if (!post) return new Response('Not found', { status: 404 });

  const isSpanish = locale === 'es';
  const date = new Intl.DateTimeFormat(isSpanish ? 'es-ES' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(post.date));
  const minutes = isSpanish ? `${post.readingMinutes} min de lectura` : `${post.readingMinutes} min read`;
  const image = firstImage(post.body);
  // Siempre existe; si faltara, mejor que el build falle que una imagen sin foto.
  const avatar = publicDataUrl('/me.jpg') as string;
  // Con foto, el texto ocupa la mitad izquierda y la foto se funde con el fondo por debajo.
  const titleSize = image ? (post.title.length > 40 ? 50 : 56) : post.title.length > 48 ? 54 : 64;
  const textWidth = image ? 650 : 1072;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          ...OG_GRID,
          fontFamily: 'Space Grotesk',
          color: 'white',
        }}
      >
        {image && (
          <div style={{ position: 'absolute', top: 0, right: 0, width: 600, height: 630, display: 'flex' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- next/og dibuja <img>, no hay <Image> aquí */}
            <img src={image} alt="" width={600} height={630} style={{ width: 600, height: 630, objectFit: 'cover' }} />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 600,
                height: 630,
                display: 'flex',
                backgroundImage: `linear-gradient(to right, ${INK} 0%, rgba(2,6,23,0.7) 22%, rgba(2,6,23,0) 55%)`,
              }}
            />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: textWidth,
            height: '100%',
            padding: '56px 0 52px 64px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: 4, color: CYAN }}>
              RAULDEV.DEV // BLOG
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 28,
                fontSize: titleSize,
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: -1,
              }}
            >
              {clip(post.title, 90)}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 26,
                paddingLeft: 22,
                borderLeft: `3px solid ${CYAN}`,
                fontSize: 27,
                lineHeight: 1.35,
                color: '#cbd5e1',
              }}
            >
              {clip(post.description, image ? 120 : 170)}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- next/og dibuja <img>, no hay <Image> aquí */}
            <img src={avatar} alt="" width={64} height={64} style={{ width: 64, height: 64, objectFit: 'cover', border: `2px solid ${CYAN}` }} />
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 600 }}>{SITE_OWNER}</div>
              <div style={{ display: 'flex', marginTop: 4, fontFamily: 'JetBrains Mono', fontSize: 19, color: '#94a3b8' }}>
                {`@sr_rauldev · ${date} · ${minutes}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: ogFonts(),
    },
  );
}
