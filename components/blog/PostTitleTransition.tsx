import { ViewTransition, type ReactNode } from 'react';

/**
 * El título de un artículo es «el mismo objeto» en la portada, en /blog y en el
 * artículo: con el mismo `name`, al navegar el navegador lo desplaza y escala de
 * un sitio a otro en vez de cortar (View Transitions de React, sin JS propio).
 * `default="none"` evita que anime en transiciones que no van con él; sin
 * soporte del navegador, la página cambia sin animación.
 */
export default function PostTitleTransition({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <ViewTransition name={`post-title-${slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
