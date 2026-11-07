'use client';

import { useRef, type MouseEvent, type ReactNode } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  labels: { zoom: string; close: string };
  /** La imagen tal como se ve en el artículo (la pinta el servidor). */
  children: ReactNode;
}

/**
 * Imagen de un artículo que se amplía a pantalla completa al pulsarla. Es un
 * enlace a la imagen original: sin JS (o con Ctrl/⌘ para abrirla en otra
 * pestaña) funciona como enlace normal. Con JS abre un <dialog> nativo:
 * el navegador pone el foco en «Cerrar», bloquea la página, cierra con Esc y
 * devuelve el foco a la imagen. Un clic en cualquier sitio también la cierra.
 * La versión grande la sirve next/image al ancho de la pantalla y solo se
 * descarga al abrirla (dentro de un diálogo cerrado no se pide).
 */
export default function ZoomableImage({ src, alt, width, height, labels, children }: ZoomableImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function open(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    dialogRef.current?.showModal();
  }

  return (
    <>
      <a
        href={src}
        onClick={open}
        aria-label={alt ? `${labels.zoom}: ${alt}` : labels.zoom}
        className="block cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
      >
        {children}
      </a>
      <dialog
        ref={dialogRef}
        aria-label={alt || labels.zoom}
        onClick={() => dialogRef.current?.close()}
        className="lightbox m-auto max-h-none max-w-none cursor-zoom-out border-0 bg-transparent p-0 backdrop:bg-slate-950/90"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="94vw"
          className="h-auto max-h-[92dvh] w-auto max-w-[94vw] border border-white/10 object-contain"
        />
        <button
          type="button"
          autoFocus
          onClick={() => dialogRef.current?.close()}
          aria-label={labels.close}
          className="fixed right-4 top-4 flex h-11 w-11 items-center justify-center border border-white/20 bg-slate-950/80 text-white transition-colors hover:border-cyan-400/60 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </dialog>
    </>
  );
}
