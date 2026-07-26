'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist.store';
import { useCartStore } from '@/store/cart.store';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import { Product } from '@/types/product';
import toast from 'react-hot-toast';

export default function DashboardWishlistPage() {
  const { productIds, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const { data: products } = useQuery({
    queryKey: ['wishlist-products-dash', productIds],
    queryFn: async () => {
      if (!productIds.length) return [];
      const res = await productsApi.getAll({ limit: '100' });
      return (res.data.data.products as Product[]).filter((p) => productIds.includes(p.id));
    },
    enabled: productIds.length > 0,
  });

  const handleAddToCart = (product: Product) => {
    const variant = product.variants.find((v) => v.stock > 0);
    if (!variant) { toast.error('Out of stock'); return; }
    addItem({
      id: Date.now(), quantity: 1,
      productId: product.id, variantId: variant.id,
      product: { id: product.id, name: product.name, slug: product.slug, price: product.price, comparePrice: product.comparePrice, images: product.images, team: product.team, league: product.league },
      variant: { id: variant.id, size: variant.size, stock: variant.stock },
    });
    toast.success('Added to cart!', { icon: '⚽' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-brand-black flex items-center gap-2">
          <Heart size={20} className="text-red-500" /> My Wishlist
          <span className="text-gray-400 font-normal text-base">({productIds.length})</span>
        </h2>
        {productIds.length > 0 && (
          <Link href="/shop" className="text-sm text-brand-green font-semibold hover:underline flex items-center gap-1">
            Browse More <ArrowRight size={13} />
          </Link>
        )}
      </div>

      {productIds.length === 0 ? (
        <div className="text-center py-14">
          <Heart size={44} className="text-red-200 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">Your wishlist is empty</p>
          <Link href="/shop" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green-light transition-colors">
            Explore Jerseys <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(products || []).map((product) => (
            <div key={product.id} className="flex gap-4 p-3 border border-gray-100 rounded-2xl hover:border-brand-green/20 transition-colors">
              <Link href={`/shop/${product.slug}`} className="shrink-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50">
                  <Image src={getPrimaryImage(product.images)} alt={product.name} width={64} height={64} className="w-full h-full object-cover" />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/shop/${product.slug}`}>
                  <p className="font-bold text-brand-black text-sm line-clamp-2 hover:text-brand-green transition-colors">{product.name}</p>
                </Link>
                <p className="text-brand-green font-bold text-sm mt-1">{formatPrice(product.price)}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-1 px-3 py-1 bg-brand-green text-white rounded-lg text-xs font-semibold hover:bg-brand-green-light transition-colors">
                    <ShoppingBag size={11} /> Add to Cart
                  </button>
                  <button onClick={() => removeItem(product.id)}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
