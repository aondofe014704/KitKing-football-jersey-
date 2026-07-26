import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateStars } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  count?: number;
}

export function StarRating({ rating, size = 14, className, showValue = false, count }: StarRatingProps) {
  const { full, half, empty } = generateStars(rating);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`full-${i}`} size={size} className="text-brand-gold fill-brand-gold" />
        ))}
        {half && (
          <span className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="text-gray-200 fill-gray-200" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: '50%' }}
            >
              <Star size={size} className="text-brand-gold fill-brand-gold" />
            </span>
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-200 fill-gray-200" />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-gray-500">
          {rating.toFixed(1)}
          {count !== undefined && <span className="ml-1">({count})</span>}
        </span>
      )}
    </div>
  );
}
