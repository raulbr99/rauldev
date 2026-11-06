'use client';

import { useState, useSyncExternalStore } from 'react';
import { Check, Link2, Linkedin, Share2 } from 'lucide-react';
import { SiX } from 'react-icons/si';

interface ShareButtonsProps {
  url: string;
  title: string;
  labels: { x: string; linkedin: string; copy: string; copied: string; native: string };
}

const button =
  'inline-flex items-center gap-2 border border-white/15 px-3 py-2.5 font-mono text-[11px] uppercase tracking-widest text-gray-300 transition-colors hover:border-cyan-400/60 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400';

const noop = () => () => {};

/**
 * Compartir un artículo. X y LinkedIn son enlaces normales (funcionan sin JS);
 * copiar el enlace y el menú nativo del sistema (Web Share API, sobre todo en
 * móvil) se añaden en el cliente. El botón nativo solo aparece si el navegador
 * lo tiene: en el servidor se pinta sin él para no descuadrar la hidratación.
 */
export default function ShareButtons({ url, title, labels }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const canShare = useSyncExternalStore(
    noop,
    () => typeof navigator.share === 'function',
    () => false,
  );

  const xHref = `https://x.com/intent/post?${new URLSearchParams({ text: title, url, via: 'sr_rauldev' })}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url })}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso de portapapeles (iframe, http): no hay nada útil que enseñar.
    }
  }

  async function share() {
    try {
      await navigator.share({ title, url });
    } catch {
      // El usuario cerró el menú: no es un error.
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a href={xHref} target="_blank" rel="noopener noreferrer" className={button}>
        <SiX className="h-3.5 w-3.5" aria-hidden />
        {labels.x}
      </a>
      <a href={linkedinHref} target="_blank" rel="noopener noreferrer" className={button}>
        <Linkedin className="h-3.5 w-3.5" aria-hidden />
        {labels.linkedin}
      </a>
      <button type="button" onClick={copy} className={button} aria-live="polite">
        {copied ? <Check className="h-3.5 w-3.5 text-cyan-300" aria-hidden /> : <Link2 className="h-3.5 w-3.5" aria-hidden />}
        {copied ? labels.copied : labels.copy}
      </button>
      {canShare && (
        <button type="button" onClick={share} className={button}>
          <Share2 className="h-3.5 w-3.5" aria-hidden />
          {labels.native}
        </button>
      )}
    </div>
  );
}
