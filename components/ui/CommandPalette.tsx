'use client';

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ArrowUpRight, Briefcase, FileText, FolderOpen, Hash, Instagram, Linkedin, Github, MessageSquare, Rss, Search } from 'lucide-react';
import { SiX } from 'react-icons/si';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { requestOpenChat } from '@/lib/chat-events';
import { OPEN_PALETTE_EVENT, matchesQuery, postSearchText } from '@/lib/palette-events';
import { SITE_URL, SOCIAL_URLS, feedPath } from '@/lib/site';
import { projectKeyMap } from '@/lib/project-keys';
import projectsData from '@/data/projects.json';

type Group = 'sections' | 'posts' | 'projects' | 'experience' | 'social' | 'actions';

interface Item {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  icon: ReactNode;
  /** Abre otra web en una pestaña nueva (lleva ↗). */
  external?: boolean;
  run: () => void;
}

const SECTIONS = [
  ['sobre-mi', 'about'],
  ['experiencia', 'experience'],
  ['habilidades', 'skills'],
  ['proyectos', 'projects'],
  ['blog', 'blog'],
  ['redes', 'social'],
  ['contacto', 'contact'],
] as const;

const icon = 'h-4 w-4 shrink-0 text-cyan-400';

/**
 * Buscador de toda la web (⌘K / Ctrl+K, o «/»): secciones, artículos, redes y
 * acciones. Es un <dialog> nativo con showModal(): el navegador pone el foco
 * dentro, bloquea el resto de la página y lo cierra con Esc. La lista sigue el
 * patrón combobox + listbox de ARIA para lectores de pantalla.
 */
export default function CommandPalette({
  posts,
  experience,
}: {
  posts: { slug: string; title: string; description: string; tags: string[] }[];
  /** Productos y empresas de la sección Experiencia (`target` = id de la tarjeta). */
  experience: { id: string; target: string; label: string; hint: string }[];
}) {
  const t = useTranslations('palette');
  const tn = useTranslations('navigation');
  const tp = useTranslations('projects');
  const locale = useLocale();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => router.push(href);
    const open = (href: string) => () => window.open(href, '_blank', 'noopener,noreferrer');
    return [
      ...SECTIONS.map(([id, key]) => ({
        id: `s-${id}`,
        group: 'sections' as const,
        label: tn(key),
        icon: <Hash className={icon} aria-hidden />,
        run: go(`/#${id}`),
      })),
      { id: 's-blog-all', group: 'sections' as const, label: t('allPosts'), icon: <FileText className={icon} aria-hidden />, run: go('/blog') },
      ...posts.map((post) => ({
        id: `p-${post.slug}`,
        group: 'posts' as const,
        label: post.title,
        hint: postSearchText(post),
        icon: <FileText className={icon} aria-hidden />,
        run: go(`/blog/${post.slug}`),
      })),
      // Proyectos: abren la demo; el portfolio (su demo es esta web) abre el código.
      ...projectsData.projects.map((project) => {
        const key = projectKeyMap[project.id];
        const title = key ? tp(`data.${key}.title`) : project.title;
        const description = key ? tp(`data.${key}.description`) : project.description;
        const href = project.demo && !project.demo.startsWith(SITE_URL) ? project.demo : project.github;
        return {
          id: `j-${project.id}`,
          group: 'projects' as const,
          label: title,
          hint: `${project.category} ${project.tech.join(' ')} ${description}`,
          icon: <FolderOpen className={icon} aria-hidden />,
          external: !!href,
          run: href ? open(href) : go('/#proyectos'),
        };
      }),
      ...experience.map((item) => ({
        id: `e-${item.id}`,
        group: 'experience' as const,
        label: item.label,
        hint: item.hint,
        icon: <Briefcase className={icon} aria-hidden />,
        run: go(`/#exp-${item.target}`),
      })),
      { id: 'r-x', group: 'social' as const, label: 'X', hint: '@sr_rauldev twitter', icon: <SiX className={icon} aria-hidden />, run: open(SOCIAL_URLS.x) },
      { id: 'r-ig', group: 'social' as const, label: 'Instagram', hint: '@raulberna.dev', icon: <Instagram className={icon} aria-hidden />, run: open(SOCIAL_URLS.instagram) },
      { id: 'r-li', group: 'social' as const, label: 'LinkedIn', hint: 'Raúl Berná', icon: <Linkedin className={icon} aria-hidden />, run: open(SOCIAL_URLS.linkedin) },
      { id: 'r-gh', group: 'social' as const, label: 'GitHub', hint: 'raulbr99 código code', icon: <Github className={icon} aria-hidden />, run: open(SOCIAL_URLS.github) },
      { id: 'a-chat', group: 'actions' as const, label: t('askAssistant'), hint: 'chat ia ai', icon: <MessageSquare className={icon} aria-hidden />, run: requestOpenChat },
      {
        id: 'a-rss',
        group: 'actions' as const,
        label: t('rss'),
        hint: 'rss feed',
        icon: <Rss className={icon} aria-hidden />,
        run: () => window.location.assign(feedPath(locale)),
      },
    ];
  }, [posts, experience, router, t, tn, tp, locale]);

  const results = useMemo(
    () => items.filter((item) => matchesQuery(`${item.label} ${item.hint ?? ''}`, query)),
    [items, query],
  );
  const current = Math.min(active, Math.max(results.length - 1, 0));

  function show() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery('');
    setActive(0);
    dialog.showModal();
    inputRef.current?.focus();
  }

  function close() {
    dialogRef.current?.close();
  }

  function choose(item: Item | undefined) {
    if (!item) return;
    close();
    item.run();
  }

  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (dialogRef.current?.open) close();
        else show();
      } else if (event.key === '/' && !typing && !dialogRef.current?.open) {
        event.preventDefault();
        show();
      }
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
    };
  }, []);

  function onInputKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((current + 1) % Math.max(results.length, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((current - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(results[current]);
    }
  }

  useEffect(() => {
    document.getElementById(`${listId}-${current}`)?.scrollIntoView({ block: 'nearest' });
  }, [current, listId]);

  let lastGroup: Group | null = null;

  return (
    <dialog
      ref={dialogRef}
      aria-label={t('title')}
      // Clic fuera de la caja (en el fondo del diálogo) = cerrar.
      onClick={(event) => event.target === dialogRef.current && close()}
      className="fixed inset-x-0 top-[12vh] mx-auto w-[calc(100%-2rem)] max-w-xl border border-white/15 bg-slate-950 p-0 text-white shadow-2xl shadow-black/60 backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-4">
        <Search className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKey}
          placeholder={t('placeholder')}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-activedescendant={results.length ? `${listId}-${current}` : undefined}
          aria-autocomplete="list"
          className="h-14 w-full bg-transparent text-base text-white placeholder:text-gray-400 focus:outline-none"
        />
        <kbd className="hidden shrink-0 border border-white/15 px-1.5 py-0.5 font-mono text-[10px] text-gray-400 sm:block">esc</kbd>
      </div>

      {/* Sin resultados: aviso fuera de la lista (una lista de opciones vacía no es
          válida) y en una región viva, para que el lector de pantalla lo diga. */}
      <p role="status" className={results.length ? 'sr-only' : 'px-4 py-6 text-sm text-gray-400'}>
        {results.length ? '' : t('empty', { query })}
      </p>
      <ul
        id={listId}
        role="listbox"
        aria-label={t('title')}
        hidden={results.length === 0}
        className="max-h-[min(60vh,26rem)] overflow-y-auto py-2"
      >
        {results.map((item, index) => {
          const header = item.group !== lastGroup ? t(`groups.${item.group}`) : null;
          lastGroup = item.group;
          const selected = index === current;
          return (
            <li key={item.id} role="presentation">
              {header && (
                <p role="presentation" className="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  {header}
                </p>
              )}
              <div
                id={`${listId}-${index}`}
                role="option"
                aria-selected={selected}
                onMouseMove={() => setActive(index)}
                onClick={() => choose(item)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm ${
                  selected ? 'bg-white/[0.07] text-cyan-300' : 'text-gray-200'
                }`}
              >
                {item.icon}
                <span className="flex-1 truncate">{item.label}</span>
                {(item.group === 'social' || item.external) && <ArrowUpRight className="h-3.5 w-3.5 text-gray-500" aria-hidden />}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="border-t border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-gray-400">
        {t('help')}
      </p>
    </dialog>
  );
}
