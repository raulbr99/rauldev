'use client';

import { useCallback } from 'react';

export const useSmoothScroll = () => {
  const scrollToSection = useCallback((sectionId: string) => {
    // Remover el # si está presente
    const id = sectionId.replace('#', '');
    
    // Buscar el elemento
    const element = document.getElementById(id);
    
    if (element) {
      // Calcular la posición considerando la altura del navbar fijo
      const navbarHeight = 80; // Altura aproximada del navbar
      const elementPosition = element.offsetTop - navbarHeight;
      
      // Scroll suave
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Solo manejar enlaces internos (que empiecen con #)
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollToSection(href);
    }
  }, [scrollToSection]);

  return { scrollToSection, handleLinkClick };
};