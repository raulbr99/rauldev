'use client';

import { useEffect, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { Link, usePathname } from '@/i18n/navigation';
import { requestOpenPalette } from '@/lib/palette-events';

export const navItems = [
    { href: '#inicio', key: 'home' },
    { href: '#sobre-mi', key: 'about' },
    { href: '#experiencia', key: 'experience' },
    { href: '#habilidades', key: 'skills' },
    { href: '#proyectos', key: 'projects' },
    { href: '#redes', key: 'social' },
    { href: '#contacto', key: 'contact' },
] as const;

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeId, setActiveId] = useState<string>('inicio');
    const t = useTranslations('navigation');
    const pathname = usePathname();
    const isHome = pathname === '/';
    const inBlog = pathname.startsWith('/blog');
    const ta = useTranslations('a11y');
    const tp = useTranslations('palette');

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
                // Ancla en las transiciones de página: la barra no se funde ni se mueve.
                style={{ viewTransitionName: 'site-header' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center gap-4 py-4">
                        <div className="whitespace-nowrap text-xl font-bold uppercase tracking-tight text-white">
                            <Link href="/" className="transition-colors hover:text-cyan-100">
                                Raúl <span className="text-cyan-400">Dev</span>
                            </Link>
                        </div>

                        {/* Barra completa desde 1024 px: en español, con «Redes», no cabe antes
                            (a 768 se cortaba el selector de idioma y «Sobre mí» se partía). */}
                        <div className="hidden lg:flex items-center gap-4 xl:gap-7">
                            {navItems.map((item) => {
                                const isActive = isHome && activeId === item.href.slice(1);
                                const className = `whitespace-nowrap font-mono text-xs uppercase tracking-widest transition-colors hover:text-cyan-300 ${
                                    isActive ? 'text-cyan-300' : 'text-gray-300'
                                }`;
                                const label = (
                                    <>
                                        {isActive && (
                                            <span className="sr-only">{ta('currentSection')}: </span>
                                        )}
                                        {t(item.key)}
                                    </>
                                );
                                // Fuera de la portada las secciones viven en `/#id`.
                                return isHome ? (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        aria-current={isActive ? 'true' : undefined}
                                        className={className}
                                    >
                                        {label}
                                    </a>
                                ) : (
                                    <Link key={item.href} href={`/${item.href}`} className={className}>
                                        {label}
                                    </Link>
                                );
                            })}
                            <Link
                                href="/blog"
                                aria-current={inBlog ? 'page' : undefined}
                                className={`whitespace-nowrap font-mono text-xs uppercase tracking-widest transition-colors hover:text-cyan-300 ${
                                    inBlog ? 'text-cyan-300' : 'text-gray-300'
                                }`}
                            >
                                {t('blog')}
                            </Link>
                            <button
                                type="button"
                                onClick={requestOpenPalette}
                                aria-keyshortcuts="Meta+K Control+K /"
                                className="flex min-h-11 items-center gap-2 border border-white/15 px-2.5 font-mono text-[11px] uppercase tracking-widest text-gray-300 transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
                            >
                                <Search className="h-3.5 w-3.5" aria-hidden />
                                {/* Nombre accesible = «Buscar ⌘K»: incluye lo que se ve (WCAG 2.5.3). */}
                                <span className="sr-only">{tp('button')}</span>
                                <kbd className="hidden font-mono lg:inline">⌘K</kbd>
                            </button>
                            <LanguageSwitcher />
                        </div>

                        <div className="flex items-center gap-2 lg:hidden">
                            <button
                                type="button"
                                onClick={requestOpenPalette}
                                aria-label={tp('button')}
                                className="flex min-h-11 min-w-11 items-center justify-center text-white transition-colors hover:text-cyan-300"
                            >
                                <Search className="h-5 w-5" aria-hidden />
                            </button>
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
