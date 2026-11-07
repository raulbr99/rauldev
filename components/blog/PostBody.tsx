import { isValidElement, type ReactNode } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { headingId } from '@/lib/blog';
import { publicImageSize } from '@/lib/image-size';

/** Texto plano de lo que react-markdown pasa como hijos (cadenas, <strong>, <code>…). */
function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement(node)) return textOf((node.props as { children?: ReactNode }).children);
  return '';
}

/**
 * Apartado con id estable y un «#» que enlaza a él (visible al pasar el ratón o
 * al llegar con el teclado), para poder compartir un trozo concreto. `scroll-mt`
 * deja sitio a la barra fija al saltar al ancla.
 */
function Heading({ level, children, anchorLabel }: { level: 2 | 3; children: ReactNode; anchorLabel: string }) {
  const id = headingId(textOf(children));
  const Tag = level === 2 ? 'h2' : 'h3';
  const size = level === 2 ? 'mb-4 mt-12 text-3xl' : 'mb-3 mt-8 text-xl';
  return (
    <Tag id={id || undefined} className={`group scroll-mt-28 font-bold text-white ${size}`}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label={`${anchorLabel}: ${textOf(children)}`}
          className="ml-3 font-mono text-[0.7em] text-cyan-400/0 transition-colors group-hover:text-cyan-400/70 focus-visible:text-cyan-400"
        >
          #
        </a>
      )}
    </Tag>
  );
}

/**
 * Cuerpo de un artículo. Sin `rehype-raw`: el HTML dentro del Markdown no se
 * interpreta, así que un artículo no puede inyectar marcado.
 */
export default function PostBody({ children, anchorLabel }: { children: string; anchorLabel: string }) {
  return (
    <div className="text-lg leading-relaxed text-gray-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <Heading level={2} anchorLabel={anchorLabel}>{children}</Heading>,
          h2: ({ children }) => <Heading level={2} anchorLabel={anchorLabel}>{children}</Heading>,
          h3: ({ children }) => <Heading level={3} anchorLabel={anchorLabel}>{children}</Heading>,
          p: ({ children }) => <p className="mb-5">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          a: ({ href, children }) => {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="text-cyan-300 underline underline-offset-4 transition-colors hover:text-cyan-200"
              >
                {children}
              </a>
            );
          },
          ul: ({ children }) => <ul className="mb-5 list-disc space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="mb-5 list-decimal space-y-2 pl-6">{children}</ol>,
          li: ({ children }) => <li className="marker:text-cyan-400">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="mb-5 border-l-2 border-cyan-400/50 pl-5 text-gray-400">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-10 border-white/10" />,
          // El bloque ``` llega como <pre><code>; el código en línea, como <code> suelto.
          pre: ({ children }) => (
            <pre className="mb-5 overflow-x-auto border border-white/10 bg-slate-900 p-4 font-mono text-sm leading-relaxed text-gray-200">
              {children}
            </pre>
          ),
          code: ({ className, children }) =>
            className ? (
              <code className={className}>{children}</code>
            ) : (
              <code className="bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-cyan-200">
                {children}
              </code>
            ),
          table: ({ children }) => (
            <div className="mb-5 overflow-x-auto">
              <table className="w-full border-collapse text-left text-base">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-white/20 px-3 py-2 font-mono text-xs uppercase tracking-widest text-gray-400">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-white/10 px-3 py-2 align-top">{children}</td>
          ),
          img: ({ src, alt }) => {
            const url = typeof src === 'string' ? src : undefined;
            const size = url ? publicImageSize(url) : undefined;
            // Fotos propias (public/): <Image> con sus medidas reales, así el
            // navegador reserva el hueco (sin saltos) y Next las sirve en
            // AVIF/WebP al ancho de la columna en vez del JPEG de 1600 px.
            if (url && size) {
              return (
                <Image
                  src={url}
                  alt={alt ?? ''}
                  width={size.width}
                  height={size.height}
                  sizes="(max-width: 800px) calc(100vw - 2rem), 736px"
                  className="mb-5 h-auto w-full border border-white/10"
                />
              );
            }
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={url} alt={alt ?? ''} loading="lazy" className="mb-5 w-full border border-white/10" />;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
