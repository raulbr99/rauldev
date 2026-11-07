import { ImageResponse } from 'next/og';
import { getPosts, postCover } from '@/lib/blog';
import { locales, type Locale } from '@/i18n/config';
import { OG_CYAN as CYAN, OG_GRID, OG_INK as INK, OG_SIZE as SIZE, clip, ogFonts, publicDataUrl } from '@/lib/og';
import { SITE_OWNER } from '@/lib/site';
import en from '@/messages/en.json';
import es from '@/messages/es.json';

/**
 * Imagen para compartir el blog (`/og/es/blog.png`, `/og/en/blog.png`): la
 * entradilla del blog, los tres últimos artículos y la foto del más reciente.
 * Se genera en el build, así que cambia sola al publicar un artículo. La
 * carpeta estática `blog.png` gana a la dinámica `[slug]` de al lado.
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

const LATEST = 3;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isSpanish = locale === 'es';
  const blog = (isSpanish ? es : en).blog;
  const posts = getPosts(locale as Locale).slice(0, LATEST);
  const day = new Intl.DateTimeFormat(isSpanish ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

  // Foto: la portada del artículo más reciente que tenga una JPEG o PNG.
  const coverSrc = posts.map((post) => postCover(locale as Locale, post.slug)).find((src) => src && /\.(?:jpe?g|png)$/i.test(src));
  const cover = coverSrc ? publicDataUrl(coverSrc) : undefined;
  const avatar = publicDataUrl('/me.jpg') as string;
  const textWidth = cover ? 780 : 1072;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', ...OG_GRID, fontFamily: 'Space Grotesk', color: 'white' }}>
        {cover && (
          <div style={{ position: 'absolute', top: 0, right: 0, width: 520, height: 630, display: 'flex' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- next/og dibuja <img>, no hay <Image> aquí */}
            <img src={cover} alt="" width={520} height={630} style={{ width: 520, height: 630, objectFit: 'cover' }} />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 520,
                height: 630,
                display: 'flex',
                backgroundImage: `linear-gradient(to right, ${INK} 0%, rgba(2,6,23,0.75) 25%, rgba(2,6,23,0.1) 70%)`,
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: textWidth, height: '100%', padding: '52px 0 48px 64px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: 4, color: CYAN }}>RAULDEV.DEV // BLOG</div>
            <div style={{ display: 'flex', marginTop: 22, paddingRight: 40, fontSize: 27, lineHeight: 1.3, color: '#cbd5e1' }}>{clip(blog.intro, 130)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 30 }}>
              {posts.map((post, i) => (
                <div
                  key={post.slug}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    paddingTop: 14,
                    paddingBottom: 14,
                    borderTop: i === 0 ? `2px solid ${CYAN}` : '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <div style={{ display: 'flex', width: 96, flexShrink: 0, marginTop: 6, fontFamily: 'JetBrains Mono', fontSize: 17, color: CYAN }}>
                    {day.format(new Date(post.date)).toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', paddingRight: 40, fontSize: 26, fontWeight: 600, lineHeight: 1.2 }}>{clip(post.title, 72)}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- next/og dibuja <img>, no hay <Image> aquí */}
            <img src={avatar} alt="" width={56} height={56} style={{ width: 56, height: 56, objectFit: 'cover', border: `2px solid ${CYAN}` }} />
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 18 }}>
              <div style={{ display: 'flex', fontSize: 26, fontWeight: 600 }}>{SITE_OWNER}</div>
              <div style={{ display: 'flex', marginTop: 2, fontFamily: 'JetBrains Mono', fontSize: 18, color: '#94a3b8' }}>
                {`@sr_rauldev · ${isSpanish ? 'rauldev.dev/blog' : 'rauldev.dev/en/blog'} · RSS`}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...SIZE, fonts: ogFonts() },
  );
}
