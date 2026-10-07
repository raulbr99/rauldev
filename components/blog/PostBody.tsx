import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Cuerpo de un artículo. Sin `rehype-raw`: el HTML dentro del Markdown no se
 * interpreta, así que un artículo no puede inyectar marcado.
 */
export default function PostBody({ children }: { children: string }) {
  return (
    <div className="text-lg leading-relaxed text-gray-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mb-4 mt-12 text-3xl font-bold text-white">{children}</h2>
          ),
          h2: ({ children }) => (
            <h2 className="mb-4 mt-12 text-3xl font-bold text-white">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-8 text-xl font-bold text-white">{children}</h3>
          ),
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
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} loading="lazy" className="mb-5 w-full border border-white/10" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
