'use client';

import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import PostCover from '@/components/blog/PostCover';
import PostTitleTransition from '@/components/blog/PostTitleTransition';

export interface BlogListPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** Fecha ya formateada en el idioma de la página (se hace en el servidor). */
  dateLabel: string;
  readingLabel: string;
  tags: string[];
  /** Primera imagen del artículo, o null. */
  cover: string | null;
}

interface Labels {
  all: string;
  filter: string;
  showing: string;
  clear: string;
}

interface BlogListProps {
  posts: BlogListPost[];
  labels: Labels;
  activeTag?: string | null;
}

/** Etiquetas con su número de artículos, de más a menos usadas. */
function tagCounts(posts: BlogListPost[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

const chip =
  'border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors';

/**
 * Lista de /blog con filtro por etiqueta. El filtro vive en la URL (`?tag=lidar`)
 * para poder compartirlo; el HTML estático lleva la lista entera (sin filtro),
 * que es lo que ven los buscadores.
 */
export function BlogList({ posts, labels, activeTag = null }: BlogListProps) {
  const tags = tagCounts(posts);
  const tag = activeTag && tags.some(([t]) => t === activeTag) ? activeTag : null;
  const shown = tag ? posts.filter((post) => post.tags.includes(tag)) : posts;

  return (
    <>
      {tags.length > 1 && (
        <nav aria-label={labels.filter} className="mt-10 flex flex-wrap items-center gap-2">
          <Link
            href="/blog"
            scroll={false}
            aria-current={tag === null ? 'true' : undefined}
            className={`${chip} ${tag === null ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-white/15 text-gray-300 hover:border-cyan-400/60 hover:text-cyan-300'}`}
          >
            {labels.all} <span className="opacity-70">{posts.length}</span>
          </Link>
          {tags.map(([name, count]) => (
            <Link
              key={name}
              href={{ pathname: '/blog', query: { tag: name } }}
              scroll={false}
              aria-current={tag === name ? 'true' : undefined}
              className={`${chip} ${tag === name ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-white/15 text-gray-300 hover:border-cyan-400/60 hover:text-cyan-300'}`}
            >
              {name} <span className="opacity-70">{count}</span>
            </Link>
          ))}
        </nav>
      )}

      {tag && (
        <p role="status" className="mt-5 font-mono text-[11px] uppercase tracking-widest text-gray-400">
          {labels.showing.replace('{shown}', String(shown.length)).replace('{total}', String(posts.length)).replace('{tag}', tag)}
          {' · '}
          <Link href="/blog" scroll={false} className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200">
            {labels.clear}
          </Link>
        </p>
      )}

      <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
        {shown.map((post) => (
          <li key={post.slug} className="blog-row">
            <Link
              href={`/blog/${post.slug}`}
              className="group grid gap-6 py-8 transition-colors hover:bg-white/[0.03] sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-start sm:px-4"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
                  <time dateTime={post.date}>{post.dateLabel}</time>
                  {' · '}
                  {post.readingLabel}
                </p>
                <PostTitleTransition slug={post.slug}>
                  <h2 className="mt-3 text-2xl font-bold text-white transition-colors group-hover:text-cyan-300">
                    {post.title}
                  </h2>
                </PostTitleTransition>
                <p className="mt-3 leading-relaxed text-gray-400">{post.description}</p>
                {post.tags.length > 0 && (
                  <p className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((name) => (
                      <span
                        key={name}
                        className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${
                          name === tag ? 'border-cyan-400/60 text-cyan-300' : 'border-white/10 text-gray-400'
                        }`}
                      >
                        {name}
                      </span>
                    ))}
                  </p>
                )}
              </div>
              {/* En el móvil la lista va sin fotos: más artículos a la vista. */}
              <PostCover
                src={post.cover}
                tag={post.tags[0]}
                sizes="176px"
                className="hidden aspect-[4/3] border border-white/10 sm:block"
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

/** La lista leyendo `?tag=` de la URL. Va dentro de <Suspense>: en el build se pinta el fallback (la lista entera). */
export function BlogListFromUrl(props: Omit<BlogListProps, 'activeTag'>) {
  const params = useSearchParams();
  return <BlogList {...props} activeTag={params.get('tag')} />;
}
