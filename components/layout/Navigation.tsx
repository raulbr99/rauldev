'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import MobileMenu from './MobileMenu';

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="text-2xl font-bold text-white">
                            <span>
                                Raúl <span className="bg-gradient-to-r from-white to-blue-400 text-transparent bg-clip-text">Dev</span>
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#inicio" className="text-white hover:text-blue-400 transition-colors">Inicio</a>
                            <a href="#sobre-mi" className="text-white hover:text-blue-400 transition-colors">Sobre Mí</a>
                            <a href="#servicios" className="text-white hover:text-blue-400 transition-colors">Servicios</a>
                            <a href="#proyectos" className="text-white hover:text-blue-400 transition-colors">Proyectos</a>
                            <a href="#contacto" className="text-white hover:text-blue-400 transition-colors">Contacto</a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-white hover:text-blue-400 transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
        </>
    );
}