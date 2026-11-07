import { ImageResponse } from 'next/og';
import { locales } from '@/i18n/config';
import { OG_CYAN as CYAN, OG_GRID, OG_SIZE as SIZE, ogFonts, publicDataUrl } from '@/lib/og';
import { SITE_OWNER } from '@/lib/site';
import en from '@/messages/en.json';
import es from '@/messages/es.json';

/**
 * Imagen para compartir la portada (`/og/es/home.png`, `/og/en/home.png`), con
 * el diseño actual del sitio: la foto del hero, nombre, rol, la frase del pie y
 * las tecnologías. Sustituye a `public/og-image.jpg` (mayo 2026: otro diseño y
 * el apellido sin tilde), que se queda en `public/` por si hay que volver.
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

/** La línea de tecnologías de la imagen anterior. */
const STACK = 'React · Next.js · Node.js · TypeScript';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = locale === 'en' ? en : es;
  const photo = publicDataUrl('/me.jpg') as string;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', ...OG_GRID, fontFamily: 'Space Grotesk', color: 'white', padding: '0 64px' }}>
        <div style={{ display: 'flex', flexShrink: 0, width: 340, height: 340, border: `3px solid ${CYAN}`, boxShadow: '0 30px 80px -30px rgba(34,211,238,0.55)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og dibuja <img>, no hay <Image> aquí */}
          <img src={photo} alt="" width={334} height={334} style={{ width: 334, height: 334, objectFit: 'cover' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 64, flex: 1 }}>
          <div style={{ display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: 4, color: CYAN }}>RAULDEV.DEV</div>
          <div style={{ display: 'flex', marginTop: 14, fontSize: 84, fontWeight: 600, lineHeight: 1, letterSpacing: -2 }}>{SITE_OWNER}</div>
          <div style={{ display: 'flex', marginTop: 14, fontSize: 38, fontWeight: 600, color: CYAN }}>{messages.hero.role}</div>
          <div style={{ display: 'flex', marginTop: 26, paddingLeft: 20, borderLeft: `3px solid ${CYAN}`, fontSize: 27, lineHeight: 1.35, color: '#cbd5e1' }}>
            {messages.footer.tagline}
          </div>
          <div style={{ display: 'flex', marginTop: 30, fontFamily: 'JetBrains Mono', fontSize: 20, color: '#94a3b8' }}>{STACK}</div>
          <div style={{ display: 'flex', marginTop: 10, fontFamily: 'JetBrains Mono', fontSize: 20, color: '#94a3b8' }}>@sr_rauldev · rauldev.dev</div>
        </div>
      </div>
    ),
    { ...SIZE, fonts: ogFonts() },
  );
}
