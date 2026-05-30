'use client';

import { motion, useReducedMotion } from 'motion/react';

interface WordRevealProps {
  text: string;
  className?: string;
  /** Delay (s) before the first word animates. */
  delay?: number;
  /** Per-word stagger (s). */
  stagger?: number;
}

/**
 * Animates a string word-by-word on mount: each word rises and unblurs.
 * Used for the hero headline. Falls back to plain text on reduced-motion.
 */
export default function WordReveal({ text, className, delay = 0, stagger = 0.08 }: WordRevealProps) {
  const reduce = useReducedMotion();
  const words = text.split(' ');

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <motion.span
      className={className}
      style={{ display: 'inline-block' }}
      initial="hidden"
      animate="visible"
      aria-label={text}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden
          style={{ display: 'inline-block', marginRight: '0.25em', willChange: 'transform, filter, opacity' }}
          variants={{
            hidden: { opacity: 0, y: '0.6em', filter: 'blur(10px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
