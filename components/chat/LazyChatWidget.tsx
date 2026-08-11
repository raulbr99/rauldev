'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false });

/**
 * El chat arrastra todo el pipeline de markdown (react-markdown, micromark,
 * mdast, hast): ~148 KB comprimidos que no hacen falta para leer la página.
 * Aquí se monta solo cuando el navegador está ocioso, o antes si la persona
 * da señales de ir a interactuar, de modo que sale de la carga crítica sin
 * que se note al usarlo.
 */
export default function LazyChatWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    const activate = () => setMounted(true);

    // Cualquier señal de interacción lo adelanta.
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;
    events.forEach((e) => window.addEventListener(e, activate, { once: true, passive: true }));

    const idle = typeof window.requestIdleCallback === 'function';
    const id = idle
      ? window.requestIdleCallback(activate, { timeout: 3000 })
      : window.setTimeout(activate, 1500);

    return () => {
      events.forEach((e) => window.removeEventListener(e, activate));
      if (idle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, [mounted]);

  return mounted ? <ChatWidget /> : null;
}
