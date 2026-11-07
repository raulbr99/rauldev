import type { PostHeading } from '@/lib/blog';

interface TableOfContentsProps {
  headings: PostHeading[];
  title: string;
}

/** Con menos apartados que estos, el índice no aporta nada y no se pinta. */
const MIN_SECTIONS = 3;

/**
 * Índice del artículo, entre la entradilla y el cuerpo: los apartados
 * numerados como enlaces a sus anclas (las que pone PostBody). Es HTML del
 * servidor, sin JS. En pantallas anchas va a dos columnas para no empujar el
 * texto hacia abajo; el orden se lee de arriba abajo, columna a columna.
 */
export default function TableOfContents({ headings, title }: TableOfContentsProps) {
  const sections = headings.filter((heading) => heading.level === 2).length;
  if (sections < MIN_SECTIONS) return null;

  // Número de cada apartado (01, 02…); los de nivel 3 van sangrados y sin número.
  const numbers = headings.map((_, i) => headings.slice(0, i + 1).filter((h) => h.level === 2).length);
  return (
    <nav aria-labelledby="post-toc" className="mt-10 border border-white/10 bg-white/[0.02] px-5 py-4">
      <h2 id="post-toc" className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">
        {title}
      </h2>
      <ol className="mt-2 gap-x-8 sm:columns-2">
        {headings.map((heading, i) => (
          <li key={heading.id} className={`break-inside-avoid ${heading.level === 3 ? 'pl-9' : ''}`}>
            <a
              href={`#${heading.id}`}
              className="group flex gap-3 py-1.5 text-[15px] leading-snug text-gray-300 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              {heading.level === 2 && (
                <span aria-hidden className="pt-px font-mono text-xs tabular-nums text-cyan-400/70 group-hover:text-cyan-300">
                  {String(numbers[i]).padStart(2, '0')}
                </span>
              )}
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
