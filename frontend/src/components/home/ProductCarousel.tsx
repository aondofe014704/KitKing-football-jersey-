'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

interface ProductCarouselProps {
  title: string;
  highlight?: string;
  products: Product[];
  isLoading?: boolean;
  viewAllHref?: string;
  badge?: string;
}

export function ProductCarousel({
  title,
  highlight,
  products,
  isLoading = false,
  viewAllHref,
  badge,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          {badge && (
            <span className="inline-block px-3 py-1 bg-brand-green/10 text-brand-green text-xs font-semibold rounded-full mb-2">
              {badge}
            </span>
          )}
          <h2 className="text-2xl lg:text-3xl font-display text-brand-black">
            {title}{' '}
            {highlight && <span className="text-brand-green">{highlight}</span>}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-green hover:text-brand-green transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-green hover:text-brand-green transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-brand-green hover:bg-brand-green hover:text-white rounded-xl border border-brand-green transition-colors group ml-2"
            >
              View All
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[220px] sm:w-[260px]">
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product) => (
              <motion.div
                key={product.id}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="shrink-0 w-[220px] sm:w-[260px] snap-start"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
      </div>

      {/* Mobile View All */}
      {viewAllHref && (
        <div className="sm:hidden text-center mt-4">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
