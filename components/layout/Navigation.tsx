'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export const navItems = [
    { href: '#inicio', key: 'home' },
    { href: '#sobre-mi', key: 'about' },
    { href: '#experiencia', key: 'experience' },
    { href: '#habilidades', key: 'skills' },
    { href: '#proyectos', key: 'projects' },
    { href: '#contacto', key: 'contact' },
] as const;

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeId, setActiveId] = useState<string>('inicio');
    const t = useTranslations('navigation');
    const ta = useTranslations('a11y');

    // Scroll-spy: marca en la navegación la sección que se está leyendo, para
    // que también lo anuncien los lectores de pantalla vía aria-current.
    useEffect(() => {
        const sections = navItems
            .map((item) => document.getElementById(item.href.slice(1)))
            .filter((el): el is HTMLElement => el !== null);

        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) setActiveId(visible.target.id);
            },
            // La franja alta compensa el header fijo de 70px.
            { rootMargin: '-20% 0px -60% 0px', threshold: [0.1, 0.5, 1] }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <nav
                aria-label={ta('mainNav')}
                className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="text-xl font-bold uppercase tracking-tight text-white">
                            <span>
                                Raúl <span className="text-cyan-400">Dev</span>
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-7">
                            {navItems.map((item) => {
                                const isActive = activeId === item.href.slice(1);
                                return (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        aria-current={isActive ? 'true' : undefined}
                                        className={`font-mono text-xs uppercase tracking-widest transition-colors hover:text-cyan-300 ${
                                            isActive ? 'text-cyan-300' : 'text-gray-300'
                                        }`}
                                    >
                                        {item.href === `#${activeId}` && (
                                            <span className="sr-only">{ta('currentSection')}: </span>
                                        )}
                                        {t(item.key)}
                                    </a>
                                );
                            })}
                            <LanguageSwitcher />
                        </div>

                        <div className="flex items-center gap-4 md:hidden">
                            <LanguageSwitcher />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="flex min-h-11 min-w-11 items-center justify-center text-white transition-colors hover:text-cyan-300"
                                aria-label={t('toggleMenu')}
                                aria-expanded={isMobileMenuOpen}
                                aria-controls="menu-movil"
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
