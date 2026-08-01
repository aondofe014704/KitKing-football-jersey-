'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star, Zap } from 'lucide-react';
import { Product } from '@/types/product';
import { useWishlistStore } from '@/store/wishlist.store';
import { useCartStore } from '@/store/cart.store';
import { formatPrice, getDiscountPercentage, getPrimaryImage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { toggle, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => setMounted(true), []);

  const primaryImage = getPrimaryImage(product.images);
  const secondaryImage = product.images.find((img) => !img.isPrimary)?.url;
  const discount = getDiscountPercentage(product.price, product.comparePrice);
  const inWishlist = mounted ? isInWishlist(product.id) : false;
  const inStock = product.variants.some((v) => v.stock > 0);
  const availableSizes = product.variants.filter((v) => v.stock > 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = selectedSize
      ? product.variants.find((v) => v.size === selectedSize && v.stock > 0)
      : product.variants.find((v) => v.stock > 0);

    if (!variant) {
      toast.error('Please select a size');
      return;
    }

    addItem({
      id: Date.now(),
      quantity: 1,
      productId: product.id,
      variantId: variant.id,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        comparePrice: product.comparePrice,
        images: product.images,
        team: product.team,
        league: product.league,
      },
      variant: {
        id: variant.id,
        size: variant.size,
        stock: variant.stock,
      },
    });

    toast.success(`${product.name} added to cart!`, {
      icon: '⚽',
      style: { borderRadius: '12px', background: '#0A4A2F', color: '#fff' },
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!', {
      icon: inWishlist ? '💔' : '❤️',
    });
  };

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn('group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-gray-100', className)}
    >
      {/* Image Container */}
      <Link href={`/shop/${product.slug}`} className="block relative overflow-hidden bg-gray-50">
        <div className="aspect-square relative">
          <Image
            src={hovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Overlay on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute inset-0 bg-brand-black/20"
          />

          {/* Quick View Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full text-xs font-semibold text-brand-black shadow-lg">
              <Eye size={13} />
              Quick View
            </span>
          </motion.div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              -{discount}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 bg-brand-green text-white text-xs font-bold rounded-full">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-1 bg-brand-gold text-white text-xs font-bold rounded-full flex items-center gap-1">
              <Zap size={10} />
              HOT
            </span>
          )}
          {!inStock && (
            <span className="px-2.5 py-1 bg-gray-800 text-white text-xs font-bold rounded-full">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart
            size={15}
            className={cn('transition-colors', inWishlist && 'fill-red-500 text-red-500')}
          />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4">
        {/* Club / League */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide truncate">
            {product.team || product.league || product.category?.name || 'Football Jersey'}
          </span>
          {product.season && (
            <span className="text-xs text-gray-400">{product.season}</span>
          )}
        </div>

        {/* Name */}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-bold text-brand-black text-sm leading-tight line-clamp-2 hover:text-brand-green transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.averageRating !== undefined && product.averageRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={cn(
                  i < Math.floor(product.averageRating!) ? 'fill-brand-gold text-brand-gold' : 'fill-gray-200 text-gray-200'
                )}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Sizes - quick select */}
        {availableSizes.length > 0 && (
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            {availableSizes.slice(0, 5).map((variant) => (
              <button
                key={variant.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSize(variant.size === selectedSize ? null : variant.size);
                }}
                className={cn(
                  'px-2 py-0.5 text-xs border rounded-lg font-medium transition-colors',
                  selectedSize === variant.size
                    ? 'border-brand-green bg-brand-green text-white'
                    : 'border-gray-200 text-gray-500 hover:border-brand-green hover:text-brand-green'
                )}
              >
                {variant.size}
              </button>
            ))}
            {availableSizes.length > 5 && (
              <span className="text-xs text-gray-400">+{availableSizes.length - 5}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-brand-green">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
            inStock
              ? 'bg-brand-green text-white hover:bg-brand-green-light active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          )}
        >
          <ShoppingBag size={15} />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  );
}
