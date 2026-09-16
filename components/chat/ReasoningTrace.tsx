'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';

/**
 * El resumen de razonamiento llega con encabezados en **negrita** que aquí
 * sobran: el bloque ya tiene su propio título.
 */
function clean(text: string) {
  return text.replace(/\*\*/g, '').trim();
}

/**
 * Muestra el razonamiento del modelo (los `reasoning` parts del stream) en un
 * panel plegable: se abre solo mientras piensa —así la espera enseña trabajo
 * en vez de tres puntitos— y se pliega al llegar la respuesta, sin perderse:
 * se puede volver a abrir.
 */
export default function ReasoningTrace({ text, streaming }: { text: string; streaming: boolean }) {
  const t = useTranslations('chat');
  const reduce = useReducedMotion();
  // Abierto mientras piensa y plegado al terminar, salvo que la persona haya
  // decidido lo contrario a mano.
  const [userToggled, setUserToggled] = useState<boolean | null>(null);
  const open = userToggled ?? streaming;
  const [seconds, setSeconds] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Cronómetro visible mientras razona; al parar, el contador se congela en
  // el tiempo total.
  useEffect(() => {
    if (!streaming) return;
    const start = Date.now();
    const id = setInterval(() => setSeconds(Math.round((Date.now() - start) / 1000)), 250);
    return () => clearInterval(id);
  }, [streaming]);

  // Lo último que piensa se mantiene a la vista dentro del panel.
  useEffect(() => {
    if (streaming && bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [text, streaming]);

  return (
    <div className="border border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setUserToggled(!open)}
        aria-expanded={open}
        className="group/trace flex w-full items-center gap-2 px-2.5 py-1.5 text-left transition-colors hover:bg-white/[0.03]"
      >
        <Sparkles
          aria-hidden
          className={`h-3 w-3 shrink-0 text-cyan-300 ${streaming && !reduce ? 'animate-pulse' : ''}`}
        />
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
            streaming ? 'text-cyan-200/90' : 'text-gray-500 group-hover/trace:text-gray-400'
          }`}
        >
          {streaming ? t('reasoningLive') : t('reasoningDone')}
        </span>
        {streaming && seconds > 0 && (
          <span className="font-mono text-[10px] tabular-nums text-cyan-300/60">{seconds}s</span>
        )}
        <ChevronDown
          aria-hidden
          className={`ml-auto h-3 w-3 shrink-0 text-gray-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              ref={bodyRef}
              className="max-h-36 overflow-y-auto border-t border-white/10 px-2.5 py-2 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-gray-500"
            >
              {clean(text)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
