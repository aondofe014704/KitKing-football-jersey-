'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { useWishlistStore } from '@/store/wishlist.store';
import { useCartStore } from '@/store/cart.store';
import { formatPrice, getDiscountPercentage, getPrimaryImage } from '@/lib/utils';
import { productsApi } from '@/lib/api';
import { Product } from '@/types/product';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { productIds, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  // Fetch product details for wishlisted IDs
  const { data: allProducts } = useQuery({
    queryKey: ['wishlist-products', productIds],
    queryFn: async () => {
      if (!productIds.length) return [];
      const res = await productsApi.getAll({ limit: '100' });
      const products: Product[] = res.data.data.products;
      return products.filter((p) => productIds.includes(p.id));
    },
    enabled: productIds.length > 0,
  });

  const products = allProducts || [];

  const handleAddToCart = (product: Product) => {
    const variant = product.variants.find((v) => v.stock > 0);
    if (!variant) { toast.error('Out of stock'); return; }
    addItem({
      id: Date.now(), quantity: 1,
      productId: product.id, variantId: variant.id,
      product: { id: product.id, name: product.name, slug: product.slug, price: product.price, comparePrice: product.comparePrice, images: product.images, team: product.team, league: product.league },
      variant: { id: variant.id, size: variant.size, stock: variant.stock },
    });
    toast.success('Added to cart!', { icon: '⚽', style: { borderRadius: '12px', background: '#0A4A2F', color: '#fff' } });
  };

  return (
    <MainLayout>
      <div className="bg-white border-b py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <nav className="text-gray-400 text-sm mb-1">
              <Link href="/" className="hover:text-brand-green">Home</Link> <span className="mx-1">/</span>
              <span className="text-brand-black font-medium">Wishlist</span>
            </nav>
            <h1 className="text-3xl font-display text-brand-black flex items-center gap-2">
              My Wishlist
              <span className="text-lg font-body text-gray-400">({productIds.length})</span>
            </h1>
          </div>
          {productIds.length > 0 && (
            <button onClick={clearWishlist} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1.5">
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {productIds.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-5">
              <Heart size={40} className="text-red-300" />
            </div>
            <h2 className="text-2xl font-display text-brand-black mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-7 max-w-sm">
              Save your favourite jerseys to your wishlist and never miss a deal.
            </p>
            <Link href="/shop">
              <Button size="lg" rightIcon={<ArrowRight size={16} />}>Explore Jerseys</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {products.map((product) => {
                const image = getPrimaryImage(product.images);
                const discount = getDiscountPercentage(product.price, product.comparePrice);
                const inStock = product.variants.some((v) => v.stock > 0);

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-card overflow-hidden group"
                  >
                    <Link href={`/shop/${product.slug}`} className="block relative">
                      <div className="aspect-square relative overflow-hidden bg-gray-50">
                        <Image src={image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                        {discount > 0 && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            -{discount}%
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      {(product.team || product.league) && (
                        <p className="text-xs text-brand-green font-semibold uppercase tracking-wide mb-1">
                          {product.team || product.league}
                        </p>
                      )}
                      <Link href={`/shop/${product.slug}`}>
                        <h3 className="font-bold text-brand-black text-sm line-clamp-2 hover:text-brand-green transition-colors mb-2">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-brand-green text-lg">{formatPrice(product.price)}</span>
                        {product.comparePrice && (
                          <span className="text-gray-400 text-sm line-through">{formatPrice(product.comparePrice)}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!inStock}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-green text-white text-sm font-semibold rounded-xl hover:bg-brand-green-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ShoppingBag size={14} />
                          {inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-200 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
