'use client';

import type { ReactNode } from 'react';
import { requestOpenPalette } from '@/lib/palette-events';

/** Abre el buscador ⌘K desde un componente de servidor (p. ej. la 404). */
export default function OpenPaletteButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button type="button" onClick={requestOpenPalette} className={className} aria-keyshortcuts="Meta+K Control+K /">
      {children}
    </button>
  );
}
