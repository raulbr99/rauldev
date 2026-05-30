'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders the assistant's markdown output (bold, lists, links, code) with the
 * portfolio's bold-tech styling. Tolerant of partial markdown during streaming.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="break-words text-cyan-300 underline underline-offset-2"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="marker:text-cyan-400">{children}</li>,
          code: ({ children }) => (
            <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em] text-cyan-200">{children}</code>
          ),
          h1: ({ children }) => <p className="mb-2 font-semibold text-white">{children}</p>,
          h2: ({ children }) => <p className="mb-2 font-semibold text-white">{children}</p>,
          h3: ({ children }) => <p className="mb-2 font-semibold text-white">{children}</p>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
