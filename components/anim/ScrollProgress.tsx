/**
 * Barra fina arriba del todo que se llena según se baja por la página. Es CSS
 * puro (`animation-timeline: scroll()`, en globals.css): sin JS ni listeners de
 * scroll. Donde el navegador no lo soporta, no se pinta.
 */
export default function ScrollProgress() {
  return <div aria-hidden className="scroll-progress" />;
}
