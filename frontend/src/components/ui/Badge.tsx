import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'gold' | 'red' | 'gray' | 'blue' | 'white';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  green: 'bg-brand-green text-white',
  gold: 'bg-brand-gold text-white',
  red: 'bg-red-500 text-white',
  gray: 'bg-gray-100 text-gray-600',
  blue: 'bg-blue-500 text-white',
  white: 'bg-white text-brand-green border border-brand-green/30',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({ children, variant = 'green', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
