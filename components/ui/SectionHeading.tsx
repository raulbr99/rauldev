import type { ReactNode } from 'react';

interface SectionHeadingProps {
  /** Two-digit section index, e.g. "01". */
  number: string;
  /** Short mono eyebrow label, e.g. "SOBRE MÍ". */
  label: string;
  /** Big display title. */
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Bold-tech section header: a numbered monospace eyebrow with a rule, followed
 * by an oversized uppercase display title. Left-aligned by default for rhythm.
 */
export default function SectionHeading({
  number,
  label,
  title,
  subtitle,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const center = align === 'center';

  return (
    <div className={`mb-12 md:mb-16 ${center ? 'text-center' : ''} ${className ?? ''}`}>
      <div className={`mb-5 flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
        <span className="font-mono text-xs font-medium tracking-[0.2em] text-cyan-300 border border-cyan-400/40 px-2 py-1">
          {number}
        </span>
        <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-gray-400">
          {label}
        </span>
        {!center && <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />}
      </div>

      <h2 className="text-4xl font-bold uppercase leading-[0.95] text-white sm:text-5xl md:text-6xl">
        {title}
      </h2>

      {subtitle && (
        <p className={`mt-5 text-lg text-gray-400 ${center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
