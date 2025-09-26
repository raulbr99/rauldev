// components/ui/Button.tsx
'use client';

import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

// Tipos para diferentes elementos
type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
    href?: never;
}

type ButtonAsLink = AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
    href: string;
}

type ButtonAsNextLink = {
    as: 'link';
    href: string;
    [key: string]: any;
}

type ButtonBaseProps = {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
    className?: string;
}

type ButtonProps = ButtonBaseProps & (ButtonAsButton | ButtonAsLink | ButtonAsNextLink);

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        loading = false,
        className = '',
        children,
        as = 'button',
        ...props
    }, ref) => {

        // Clases base
        const baseClasses = [
            'inline-flex',
            'items-center',
            'justify-center',
            'font-semibold',
            'rounded-full',
            'transition-all',
            'duration-200',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-500',
            'focus:ring-offset-2',
            'text-decoration-none' // Para enlaces
        ];

        // Clases para estados disabled (solo botones)
        const disabledClasses = as === 'button' ? [
            'disabled:opacity-50',
            'disabled:cursor-not-allowed'
        ] : [];

        // Variantes
        const variantClasses = {
            primary: [
                'bg-gradient-to-r',
                'from-blue-500',
                'to-cyan-500',
                'text-white',
                'hover:from-blue-600',
                'hover:to-cyan-600',
                'hover:scale-105',
                'shadow-lg',
                'hover:shadow-blue-500/25',
                'transform'
            ],
            secondary: [
                'border-2',
                'border-white/40',
                'text-white',
                'hover:bg-white/10',
                'hover:border-white/60',
                'backdrop-blur-sm',
                'hover:scale-105',
                'transform'
            ],
            ghost: [
                'text-gray-300',
                'hover:text-white',
                'hover:bg-white/10',
                'hover:scale-105',
                'transform'
            ]
        };

        // Tamaños
        const sizeClasses = {
            sm: ['px-4', 'py-2', 'text-sm', 'min-h-8'],
            md: ['px-6', 'py-3', 'text-base', 'min-h-11'],
            lg: ['px-8', 'py-4', 'text-lg', 'min-h-13']
        };

        // Combinar clases
        const allClasses = [
            ...baseClasses,
            ...disabledClasses,
            ...variantClasses[variant as keyof typeof variantClasses],
            ...(sizeClasses[size as keyof typeof sizeClasses]),
            className
        ].join(' ');

        // Contenido del botón/enlace
        const content = (
            <>
                {loading && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {children}
            </>
        );

        // Renderizar según el tipo
        if (as === 'link') {
            const { href, ...linkProps } = props as ButtonAsNextLink;
            return (
                <Link
                    href={href}
                    className={allClasses}
                    ref={ref as any}
                    {...linkProps}
                >
                    {content}
                </Link>
            );
        }

        if (as === 'a') {
            const { href, ...anchorProps } = props as ButtonAsLink;
            return (
                <a
                    href={href}
                    className={allClasses}
                    ref={ref as any}
                    {...anchorProps}
                >
                    {content}
                </a>
            );
        }

        // Botón por defecto
        const { disabled, ...buttonProps } = props as ButtonAsButton;
        return (
            <button
                className={allClasses}
                disabled={disabled || loading}
                ref={ref as any}
                {...buttonProps}
            >
                {content}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;