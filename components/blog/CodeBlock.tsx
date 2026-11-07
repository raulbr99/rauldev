'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  /** Lenguaje del bloque (```bash → «bash»); vacío si no se indicó. */
  language: string;
  /** Texto del bloque tal cual, sin el salto de línea final. */
  code: string;
  labels: { copy: string; copied: string };
  children: ReactNode;
}

const noop = () => () => {};

/**
 * Bloque de código de un artículo con una barra arriba: el lenguaje a la
 * izquierda y «Copiar» a la derecha. El botón solo aparece si el navegador deja
 * escribir en el portapapeles (en el servidor y sin JS no se pinta); la barra
 * tiene altura fija, así que su llegada no mueve nada.
 */
export default function CodeBlock({ language, code, labels, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  // Si la línea no cabe y el bloque hace scroll lateral, tiene que poder
  // enfocarse para moverlo con las flechas (WCAG 2.1.1). Solo entonces: un
  // bloque corto no debe ser una parada más del tabulador.
  const preRef = useRef<HTMLPreElement>(null);
  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    // El observador avisa también al empezar, así que mide la primera vez.
    const observer = new ResizeObserver(() => setScrollable(pre.scrollWidth > pre.clientWidth));
    observer.observe(pre);
    return () => observer.disconnect();
  }, []);
  const canCopy = useSyncExternalStore(
    noop,
    () => typeof navigator.clipboard?.writeText === 'function',
    () => false,
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso de portapapeles: no hay nada útil que enseñar.
    }
  }

  return (
    <div className="mb-5 border border-white/10 bg-slate-900">
      <div className="flex h-9 items-center justify-between border-b border-white/10 pl-4 pr-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">{language}</span>
        {canCopy && (
          <button
            type="button"
            onClick={copy}
            aria-live="polite"
            className="inline-flex h-7 items-center gap-1.5 px-2.5 font-mono text-[10px] uppercase tracking-widest text-gray-300 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-cyan-400"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-cyan-300" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            {copied ? labels.copied : labels.copy}
          </button>
        )}
      </div>
      <pre
        ref={preRef}
        tabIndex={scrollable ? 0 : undefined}
        className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-gray-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan-400"
      >
        {children}
      </pre>
    </div>
  );
}
