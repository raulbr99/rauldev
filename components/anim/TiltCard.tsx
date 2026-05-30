'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'motion/react';
import { useRef, type ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  /** Show a cursor-following glow highlight. */
  glow?: boolean;
}

/**
 * 3D tilt-on-hover wrapper with an optional cursor-tracking glare. The card
 * leans toward the pointer and springs back on leave. No-op on reduced-motion.
 */
export default function TiltCard({ children, className, max = 9, glow = true }: TiltCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const glowOpacity = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 150, damping: 15 });

  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);
  const glowBg = useMotionTemplate`radial-gradient(420px circle at ${glowX} ${glowY}, rgba(56,189,248,0.20), transparent 60%)`;

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const enter = () => !reduce && glowOpacity.set(1);

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    glowOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={enter}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className={`relative ${className ?? ''}`}
    >
      {glow && !reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
          style={{ background: glowBg, opacity: glowOpacity }}
        />
      )}
      {children}
    </motion.div>
  );
}
