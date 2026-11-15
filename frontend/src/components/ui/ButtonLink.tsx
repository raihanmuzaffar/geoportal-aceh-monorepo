import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonLinkProps = {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'inverse' | 'text';
  className?: string;
};

const variantStyles = {
  primary:
    'min-h-12 bg-forest px-6 py-3 text-paper hover:bg-forest-deep active:translate-y-px',
  secondary:
    'min-h-12 border border-line-strong bg-transparent px-6 py-3 text-forest hover:bg-forest-soft active:translate-y-px',
  inverse:
    'min-h-12 bg-paper px-6 py-3 text-forest hover:bg-surface focus-visible:outline-paper active:translate-y-px',
  text: 'min-h-11 text-forest underline-offset-4 hover:underline',
};

export default function ButtonLink({
  to,
  children,
  variant = 'primary',
  className = '',
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center rounded text-sm font-semibold transition-colors duration-200 ease-editorial ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
