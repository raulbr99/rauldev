'use client';

import { useState } from 'react';
import MobileMenu from '@/components/MobileMenu';

interface NavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function Navigation({ isMobileMenuOpen, setIsMobileMenuOpen }: NavigationProps) {
  return (
    <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-white">
            <span>
              Raúl <span className="bg-gradient-to-r from-white to-blue-400 text-transparent bg-clip-text">Dev</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-white hover:text-blue-400 transition-colors">Inicio</a>
            <a href="#sobre-mi" className="text-white hover:text-blue-400 transition-colors">Sobre Mí</a>
            <a href="#servicios" className="text-white hover:text-blue-400 transition-colors">Servicios</a>
            <a href="#proyectos" className="text-white hover:text-blue-400 transition-colors">Proyectos</a>
            <a href="#contacto" className="text-white hover:text-blue-400 transition-colors">Contacto</a>
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
}