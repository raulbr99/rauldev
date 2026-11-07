import Image from 'next/image';

interface PostCoverProps {
  /** Primera imagen del artículo (`/blog/…`); null si no tiene. */
  src: string | null;
  /** Etiqueta que se pinta en la portada de respaldo, si no hay imagen. */
  tag?: string;
  /** Ancho con el que se pinta, para que next/image sirva el tamaño justo. */
  sizes: string;
  className?: string;
}

/**
 * Portada de un artículo en las listas (portada y /blog). Es decorativa
 * (`alt=""`): el título va justo al lado y lo dice todo. Sin imagen, una
 * portada de respaldo con la rejilla del sitio y la primera etiqueta, para que
 * todas las tarjetas tengan la misma forma. Al pasar el ratón por la tarjeta
 * (`group`) la foto se acerca un poco.
 */
export default function PostCover({ src, tag, sizes, className = '' }: PostCoverProps) {
  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
        />
      ) : (
        <div aria-hidden className="bg-techgrid absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_65%)]" />
          {tag && (
            <span className="relative font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">{tag}</span>
          )}
        </div>
      )}
    </div>
  );
}
