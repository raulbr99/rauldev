import type { PostMeta } from '@/lib/blog';
import { SOCIAL_URLS, feedUrl, localeUrl } from '@/lib/site';

export const LLMS_MARKER = '<!-- BLOG_Y_REDES: lo rellena app/llms.txt/route.ts en el build -->';

export interface SocialPostEntry {
  date: string;
  text: Partial<Record<'es' | 'en', string>>;
  links: { network: string; url: string }[];
}

const NETWORK_LABEL: Record<string, string> = { x: 'X', linkedin: 'LinkedIn', instagram: 'Instagram' };

function postLines(locale: 'es' | 'en', posts: PostMeta[]): string[] {
  return posts.map(
    (post) => `- [${post.title}](${localeUrl(locale, `/blog/${post.slug}`)}) (${post.date}): ${post.description}`,
  );
}

/**
 * Secciones «Blog» y «En redes» de llms.txt, generadas con los mismos datos que
 * la web (content/blog y data/social-posts.json): un agente de IA que lea el
 * fichero encuentra cada artículo, los feeds y los últimos posts sin que haya
 * que acordarse de copiarlos a mano.
 */
export function buildLlmsSections(es: PostMeta[], en: PostMeta[], social: SocialPostEntry[]): string {
  const lines: string[] = [
    '## Blog (artículos)',
    '',
    `- Blog: ${localeUrl('es', '/blog')} (ES) · ${localeUrl('en', '/blog')} (EN)`,
    `- RSS: ${feedUrl('es')} (ES) · ${feedUrl('en')} (EN)`,
    '',
    '### En español',
    ...postLines('es', es),
    '',
    '### In English',
    ...postLines('en', en),
  ];

  if (social.length > 0) {
    lines.push(
      '',
      '## En redes (últimos posts)',
      '',
      `Cuenta lo que prueba en X (${SOCIAL_URLS.x}, en español) y en Instagram (${SOCIAL_URLS.instagram}) y LinkedIn (${SOCIAL_URLS.linkedin}), en inglés.`,
      '',
      ...social.map((post) => {
        const text = post.text.es ?? post.text.en ?? '';
        const links = post.links.map((link) => `[${NETWORK_LABEL[link.network] ?? link.network}](${link.url})`).join(' · ');
        return `- ${post.date}: ${text} ${links}`;
      }),
    );
  }

  return lines.join('\n');
}

/** Sustituye la marca del fichero base por las secciones generadas (falla si no está). */
export function fillLlms(base: string, sections: string): string {
  if (!base.includes(LLMS_MARKER)) throw new Error('content/llms.txt ha perdido la marca BLOG_Y_REDES');
  return base.replace(LLMS_MARKER, sections);
}
