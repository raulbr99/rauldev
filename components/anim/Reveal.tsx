import type { CSSProperties, ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const offsets: Record<Direction, [string, string]> = {
  up: ['0px', '12px'],
  down: ['0px', '-12px'],
  left: ['12px', '0px'],
  right: ['-12px', '0px'],
  none: ['0px', '0px'],
};

interface RevealProps {
  children: ReactNode;
  /**
   * 'view' (por defecto): aparece al entrar en pantalla, con una animación
   * ligada al scroll (`animation-timeline: view()`). 'load': aparece al cargar
   * la página, para lo que ya está a la vista (la portada).
   */
  trigger?: 'view' | 'load';
  /** En 'load', segundos de espera; en 'view', escalona: cuánto más tarde empieza. */
  delay?: number;
  direction?: Direction;
  className?: string;
}

/**
 * Entrada con CSS puro (clases `reveal-*` de globals.css), sin JavaScript: el
 * contenido llega visible en el HTML y el navegador lo anima. Sin soporte de
 * animaciones por scroll, o con «reducir movimiento», se ve sin animación.
 * Antes era `motion` y el HTML salía con opacity: 0 hasta hidratar, así que el
 * nombre de la portada no se veía hasta que cargaba el JS.
 */
export default function Reveal({ children, trigger = 'view', delay = 0, direction = 'up', className }: RevealProps) {
  const [x, y] = offsets[direction];
  const style: CSSProperties & Record<`--${string}`, string> = {
    '--reveal-x': x,
    '--reveal-y': y,
    ...(trigger === 'load'
      ? { '--reveal-delay': `${delay}s` }
      : { '--reveal-shift': `${Math.round(delay * 600)}px` }),
  };

  return (
    <div className={`reveal-${trigger}${className ? ` ${className}` : ''}`} style={style}>
      {children}
    </div>
  );
}
