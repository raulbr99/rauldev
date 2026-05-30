'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { handleLinkClick } = useSmoothScroll();
    const t = useTranslations('navigation');

    const navItems = [
        { href: '#inicio', key: 'home' },
        { href: '#sobre-mi', key: 'about' },
        { href: '#experiencia', key: 'experience' },
        { href: '#habilidades', key: 'skills' },
        { href: '#proyectos', key: 'projects' },
        { href: '#contacto', key: 'contact' },
    ];

    return (
        <>
            <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="text-xl font-bold uppercase tracking-tight text-white">
                            <span>
                                Raúl <span className="text-cyan-400">Dev</span>
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-7">
                            {navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="font-mono text-xs uppercase tracking-widest text-gray-300 transition-colors hover:text-cyan-300"
                                    onClick={(e) => handleLinkClick(e, item.href)}
                                >
                                    {t(item.key)}
                                </a>
                            ))}
                            <LanguageSwitcher />
                        </div>

                        <div className="flex items-center gap-4 md:hidden">
                            <LanguageSwitcher />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-white hover:text-cyan-300 transition-colors"
                                aria-label={t('toggleMenu')}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
        </>
    );
}
