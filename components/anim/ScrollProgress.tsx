'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/**
 * Thin gradient bar pinned to the top of the viewport that fills as the page
 * scrolls. Spring-smoothed for a premium feel.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
    />
  );
}
