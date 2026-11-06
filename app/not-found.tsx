import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * 404 para lo que no pasa por un idioma (p. ej. `/algo.pdf`, que el proxy no
 * toca). El layout raíz no pinta `<html>` ni carga traducciones, así que esta
 * página trae los dos idiomas escritos aquí. El `noindex` lo añade Next.
 */
export const metadata: Metadata = {
  title: '404 · Raúl Berná',
  description: 'Esta página no existe. This page does not exist.',
};

export default function RootNotFound() {
  return (
    <html lang="es">
      <body className="antialiased">
        <main className="flex min-h-dvh flex-col items-center justify-center bg-slate-950 px-4 text-center">
          <p className="font-mono text-7xl font-bold text-cyan-400/30 sm:text-8xl">404</p>
          <h1 className="mt-4 text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
            Esta página no existe
          </h1>
          <p className="mt-4 max-w-md leading-relaxed text-gray-400">
            El enlace que has seguido no lleva a ninguna parte, o la página ha cambiado de sitio.
          </p>
          <p lang="en" className="mt-2 max-w-md leading-relaxed text-gray-400">
            This page doesn&apos;t exist.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {/* Link de Next y no el de next-intl: fuera de [locale] las rutas van tal cual. */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-cyan-400 px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-wider text-slate-950 transition-colors hover:bg-cyan-300"
            >
              Volver al inicio
            </Link>
            <Link
              href="/en"
              lang="en"
              className="inline-flex items-center gap-2 border border-white/25 px-7 py-3.5 font-mono text-sm font-medium uppercase tracking-wider text-white transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
            >
              Back to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
