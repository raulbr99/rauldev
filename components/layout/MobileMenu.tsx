'use client';

import { AtSign, X, Home, User, Briefcase, Wrench, FolderOpen, Mail, Github, Linkedin, Instagram, BookOpen } from 'lucide-react';
import { SiX } from 'react-icons/si';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { SOCIAL_URLS } from '@/lib/site';

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const menuItems = [
    { href: '#inicio', key: 'home', Icon: Home },
    { href: '#sobre-mi', key: 'about', Icon: User },
    { href: '#experiencia', key: 'experience', Icon: Briefcase },
    { href: '#habilidades', key: 'skills', Icon: Wrench },
    { href: '#proyectos', key: 'projects', Icon: FolderOpen },
    { href: '#redes', key: 'social', Icon: AtSign },
    { href: '#contacto', key: 'contact', Icon: Mail },
] as const;

const socialItems = [
    { href: SOCIAL_URLS.github, label: 'GitHub', Icon: Github },
    { href: SOCIAL_URLS.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: SOCIAL_URLS.x, label: 'X', Icon: SiX },
    { href: SOCIAL_URLS.instagram, label: 'Instagram', Icon: Instagram },
    { href: 'mailto:raulbernariera99@gmail.com', label: 'Email', Icon: Mail },
] as const;

const itemClass =
    'flex items-center gap-4 border border-transparent px-4 py-3 font-mono text-sm uppercase tracking-widest text-gray-300 transition-colors hover:border-cyan-400/30 hover:bg-white/5 hover:text-cyan-300';

/**
 * Menú del móvil como <dialog> nativo abierto con showModal(): el navegador
 * pone el foco dentro, deja inerte la página de detrás, lo cierra con Esc y
 * devuelve el foco al botón que lo abrió. El bloqueo del scroll y ocultar el
 * chat flotante van en globals.css (`html:has(#menu-movil[open])`), y también
 * la entrada deslizando desde la derecha.
 */
export default function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
    const t = useTranslations('navigation');
    const ta = useTranslations('a11y');
    const isHome = usePathname() === '/';
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) dialog.showModal();
        if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    return (
        <dialog
            ref={dialogRef}
            id="menu-movil"
            aria-label={t('toggleMenu')}
            // Esc lo cierra el navegador: hay que avisar al estado de React.
            onClose={() => setIsOpen(false)}
            // Clic en el fondo oscuro (fuera del panel) = cerrar.
            onClick={(event) => event.target === dialogRef.current && setIsOpen(false)}
            className="mobile-menu fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-80 max-w-[85vw] border-0 border-l border-white/10 bg-slate-900 p-0 text-white shadow-2xl backdrop:bg-black/60"
        >
            <div className="relative h-full">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <p className="text-xl font-bold uppercase tracking-tight text-white">
                        Raúl <span className="text-cyan-400">Dev</span>
                    </p>
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label={ta('closeMenu')}
                        className="flex min-h-11 min-w-11 items-center justify-center text-gray-400 transition-colors hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-6" aria-label={ta('mainNav')}>
                    <ul className="space-y-3">
                        {menuItems.map(({ href, key, Icon }) => (
                            <li key={href}>
                                {isHome ? (
                                    <a href={href} className={itemClass} onClick={() => setIsOpen(false)}>
                                        <Icon className="h-5 w-5 text-cyan-400" aria-hidden />
                                        <span>{t(key)}</span>
                                    </a>
                                ) : (
                                    <Link href={`/${href}`} className={itemClass} onClick={() => setIsOpen(false)}>
                                        <Icon className="h-5 w-5 text-cyan-400" aria-hidden />
                                        <span>{t(key)}</span>
                                    </Link>
                                )}
                            </li>
                        ))}
                        <li>
                            <Link href="/blog" className={itemClass} onClick={() => setIsOpen(false)}>
                                <BookOpen className="h-5 w-5 text-cyan-400" />
                                <span>{t('blog')}</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-6">
                    <div className="flex justify-center gap-2">
                        {socialItems.map(({ href, label, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                target={href.startsWith('http') ? '_blank' : undefined}
                                rel={href.startsWith('http') ? 'me noopener noreferrer' : undefined}
                                className="flex min-h-11 min-w-11 items-center justify-center text-gray-400 transition-colors hover:text-cyan-300"
                            >
                                <Icon className="h-5 w-5" aria-hidden />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </dialog>
    );
}
