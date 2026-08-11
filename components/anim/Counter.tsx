'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'motion/react';

interface CounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

/**
 * Counts up from 0 to `to` the first time it scrolls into view.
 * Shows the final value immediately under reduced-motion.
 */
export default function Counter({ to, prefix = '', suffix = '', duration = 1.6, className }: CounterProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  // Con reduced-motion se muestra el valor final directamente, sin pasar por
  // el estado: fijarlo desde el efecto provocaba un render extra innecesario.
  const shown = reduce ? to : value;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
