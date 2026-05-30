'use client';

import { motion, useReducedMotion } from 'motion/react';

const blobs = [
  { color: 'bg-blue-600', size: 'h-[42rem] w-[42rem]', pos: 'top-[-12%] left-[-8%]', delay: 0, dur: 20 },
  { color: 'bg-cyan-500', size: 'h-[34rem] w-[34rem]', pos: 'top-[28%] right-[-10%]', delay: 2, dur: 24 },
  { color: 'bg-indigo-600', size: 'h-[38rem] w-[38rem]', pos: 'bottom-[-14%] left-[18%]', delay: 4, dur: 28 },
  { color: 'bg-sky-500', size: 'h-[26rem] w-[26rem]', pos: 'top-[55%] left-[40%]', delay: 1, dur: 22 },
];

/**
 * Fixed, full-viewport animated aurora: slow-drifting colour blobs over the
 * dark base, plus a faint grid and a radial vignette. Sits behind all content.
 * Blobs hold still under reduced-motion.
 */
export default function AuroraBackground() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute ${b.pos} ${b.size} ${b.color} rounded-full opacity-[0.18] blur-[130px] will-change-transform`}
          animate={
            reduce
              ? undefined
              : { x: [0, 50, -30, 0], y: [0, -40, 50, 0], scale: [1, 1.18, 0.92, 1] }
          }
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
        />
      ))}

      {/* Subtle tech grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      {/* Vignette so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.65)_90%)]" />
    </div>
  );
}
