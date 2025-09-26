import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
}

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
  const baseClasses = 'rounded-xl p-6 transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white/10 backdrop-blur-md border border-white/20',
    glass: 'bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}