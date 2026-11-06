'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const offsets: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 12 },
  down: { y: -12 },
  left: { x: 12 },
  right: { x: -12 },
  none: {},
};

interface RevealProps {
  children: ReactNode;
  /** Seconds of delay before the reveal starts. */
  delay?: number;
  /** Slide-in direction. */
  direction?: Direction;
  /** Pop-in from a slightly smaller scale. */
  scale?: boolean;
  className?: string;
  /**
   * Cuánto del elemento tiene que verse para que aparezca: 'some' (cualquier
   * parte), 'all' o una fracción 0-1. Por defecto 'some': con una fracción,
   * una sección más alta que la pantalla dividida por esa fracción (p. ej.
   * «Proyectos» en un móvil, más de 4 pantallas con 0.25) nunca llega a
   * mostrarse.
   */
  amount?: 'some' | 'all' | number;
  duration?: number;
}

/**
 * Scroll-triggered entrance. Wraps server-rendered children, so sections can
 * stay Server Components while still animating in. Honours reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  scale = false,
  className,
  amount = 'some',
  duration = 0.5,
}: RevealProps) {
  const reduce = useReducedMotion();
  const o = offsets[direction];

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, ...o, scale: scale ? 0.85 : 1 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
