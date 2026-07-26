import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { text: 'text-xl', sub: 'text-[9px]' },
  md: { text: 'text-2xl', sub: 'text-[10px]' },
  lg: { text: 'text-3xl', sub: 'text-xs' },
};

export function Logo({ className, variant = 'dark', size = 'md' }: LogoProps) {
  const isLight = variant === 'light';
  const s = sizes[size];

  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      {/* Icon mark */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-green to-brand-green-light shadow-sm group-hover:shadow-md transition-shadow">
        <span className="text-white font-display text-lg leading-none">K</span>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-brand-gold" />
      </div>
      {/* Word mark */}
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display tracking-wider leading-none',
            s.text,
            isLight ? 'text-white' : 'text-brand-black'
          )}
        >
          KIT<span className={isLight ? 'text-brand-gold' : 'text-brand-green'}>KING</span>
        </span>
        <span
          className={cn(
            'font-body tracking-[0.15em] uppercase font-medium',
            s.sub,
            isLight ? 'text-white/60' : 'text-gray-400'
          )}
        >
          Football Jerseys
        </span>
      </div>
    </Link>
  );
}
