import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const sectionLinks = [
  { href: '#sobre-mi', key: 'about' },
  { href: '#experiencia', key: 'experience' },
  { href: '#habilidades', key: 'skills' },
  { href: '#proyectos', key: 'projects' },
  { href: '#contacto', key: 'contact' },
] as const;

const legalLinks = [
  { href: '/aviso-legal', key: 'legalNotice' },
  { href: '/privacidad', key: 'privacy' },
  { href: '/cookies', key: 'cookies' },
] as const;

const socialLinks = [
  { href: 'https://github.com/raulbr99', label: 'GitHub', Icon: Github },
  { href: 'https://www.linkedin.com/in/raul-berna-riera', label: 'LinkedIn', Icon: Linkedin },
  { href: 'mailto:raulbernariera99@gmail.com', label: 'Email', Icon: Mail },
] as const;

/**
 * Pie de página: cierra el sitio con los enlaces legales exigidos por la LSSI
 * y el RGPD, además de navegación interna y perfiles. Sigue la estética del
 * resto: esquinas rectas, etiquetas mono y acento cian.
 */
export default function Footer() {
  const t = useTranslations('footer');
  const tn = useTranslations('navigation');
  const year = new Date().getFullYear();

  const columnTitle = 'mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500';
  const columnLink =
    'inline-block py-1 text-sm text-gray-400 transition-colors hover:text-cyan-300';

  return (
    <footer className="border-t border-white/10 bg-slate-950/60 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Identidad */}
          <div>
            <p className="text-xl font-bold uppercase tracking-tight text-white">
              Raúl <span className="text-cyan-400">Dev</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">{t('tagline')}</p>
            <a
              href="/cv-raul.pdf"
              download
              className="mt-5 inline-flex items-center gap-2 border border-white/20 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-white transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
            >
              <Download className="h-3.5 w-3.5" />
              {t('downloadCV')}
            </a>
          </div>

          {/* Secciones */}
          <nav aria-label={t('sections')}>
            <h2 className={columnTitle}>{t('sections')}</h2>
            <ul>
              {sectionLinks.map((item) => (
                <li key={item.href}>
                  <Link href={`/${item.href}`} className={columnLink}>
                    {tn(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label={t('legal')}>
            <h2 className={columnTitle}>{t('legal')}</h2>
            <ul>
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={columnLink}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Perfiles */}
          <div>
            <h2 className={columnTitle}>{t('elsewhere')}</h2>
            <ul>
              {socialLinks.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`${columnLink} flex items-center gap-2.5`}
                  >
                    <Icon className="h-4 w-4 text-cyan-400" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 font-mono text-[11px] tracking-widest text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Raúl Berná Riera. {t('rights')}</p>
          <p>{t('builtWith')}</p>
        </div>
      </div>
    </footer>
  );
}
