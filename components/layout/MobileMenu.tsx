'use client';

import { X, Home, User, Briefcase, Wrench, FolderOpen, Mail, Github, Linkedin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

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
    { href: '#contacto', key: 'contact', Icon: Mail },
] as const;

const socialItems = [
    { href: 'https://github.com/raulbr99', label: 'GitHub', Icon: Github },
    { href: 'https://www.linkedin.com/in/raul-berna-riera', label: 'LinkedIn', Icon: Linkedin },
    { href: 'mailto:raulbernariera99@gmail.com', label: 'Email', Icon: Mail },
] as const;

const FOCUSABLE = 'a[href], button:not([disabled])';

export default function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
    const t = useTranslations('navigation');
    const ta = useTranslations('a11y');
    const panelRef = useRef<HTMLDivElement>(null);
    const openerRef = useRef<Element | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        openerRef.current = document.activeElement;
        document.body.style.overflow = 'hidden';

        // El foco entra en el panel y queda atrapado dentro mientras esté abierto:
        // sin esto se puede tabular por la página de detrás sin verla.
        const panel = panelRef.current;
        panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                return;
            }
            if (e.key !== 'Tab' || !panel) return;

            const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
            if (items.length === 0) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
            // Devuelve el foco al botón que lo abrió.
            (openerRef.current as HTMLElement | null)?.focus?.();
        };
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 z-40 md:hidden"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />

            <div
                ref={panelRef}
                id="menu-movil"
                role="dialog"
                aria-modal="true"
                aria-label={t('toggleMenu')}
                className="fixed right-0 top-0 h-dvh w-80 max-w-[85vw] bg-slate-900 border-l border-white/10 shadow-2xl z-50 md:hidden"
            >
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
                                <a
                                    href={href}
                                    className="flex items-center gap-4 border border-transparent px-4 py-3 font-mono text-sm uppercase tracking-widest text-gray-300 transition-colors hover:border-cyan-400/30 hover:bg-white/5 hover:text-cyan-300"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Icon className="h-5 w-5 text-cyan-400" />
                                    <span>{t(key)}</span>
                                </a>
                            </li>
                        ))}
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
                                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="flex min-h-11 min-w-11 items-center justify-center text-gray-400 transition-colors hover:text-cyan-300"
                            >
                                <Icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
