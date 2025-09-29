'use client';

import { X, Home, User, Briefcase, FolderOpen, Mail, Github, Linkedin } from 'lucide-react';
import { useEffect } from 'react';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
    const { handleLinkClick } = useSmoothScroll();

    const menuItems = [
        { href: '#inicio', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
        { href: '#sobre-mi', label: 'Sobre Mí', icon: <User className="w-5 h-5" /> },
        { href: '#experiencia', label: 'Experiencia', icon: <Briefcase className="w-5 h-5" /> },
        { href: '#habilidades', label: 'Habilidades', icon: <User className="w-5 h-5" /> },
        { href: '#proyectos', label: 'Proyectos', icon: <FolderOpen className="w-5 h-5" /> },
        { href: '#contacto', label: 'Contacto', icon: <Mail className="w-5 h-5" /> }
    ];

    // Prevenir scroll cuando el menú está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleMobileLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        handleLinkClick(e, href);
        setIsOpen(false);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-slate-900 border-l border-white/10 shadow-2xl z-50 lg:hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="text-xl font-bold text-white">
                        Raúl <span className="text-blue-400">Dev</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-6">
                    <ul className="space-y-3">
                        {menuItems.map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className="flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    onClick={(e) => handleMobileLinkClick(e, item.href)}
                                >
                                    <span className="text-blue-400">{item.icon}</span>
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Social Links */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
                    <div className="flex gap-4 justify-center">
                        <a href="https://github.com/raulbr99" className="text-gray-400 hover:text-white">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="https://linkedin.com/in/raul-berna-riera" className="text-gray-400 hover:text-blue-400">
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="mailto:raulbernariera99@gmail.com" className="text-gray-400 hover:text-green-400">
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}