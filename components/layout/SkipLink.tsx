/**
 * Primer elemento tabulable de la página: permite saltarse la navegación e ir
 * directo al contenido. Invisible hasta que recibe el foco con el teclado.
 */
export default function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-cyan-400 focus:px-5 focus:py-3 focus:font-mono focus:text-sm focus:uppercase focus:tracking-widest focus:text-slate-950"
    >
      {label}
    </a>
  );
}
