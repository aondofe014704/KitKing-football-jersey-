'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingBag, Share2, Star, Shield, Truck,
  RefreshCw, ChevronRight, Minus, Plus, ZoomIn
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { Skeleton } from '@/components/ui/Skeleton';
import { productsApi } from '@/lib/api';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { ProductVariant } from '@/types/product';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [lightbox, setLightbox] = useState(false);

  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug).then((r) => r.data.data),
    enabled: !!slug,
  });

  const { data: related } = useQuery({
    queryKey: ['related', product?.id],
    queryFn: () => productsApi.getRelated(product!.id).then((r) => r.data.data),
    enabled: !!product?.id,
  });

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) return <div className="p-20 text-center text-gray-500">Product not found</div>;

  const images = product.images || [];
  const currentImage = images[selectedImage]?.url || '/images/placeholder-jersey.jpg';
  const discount = getDiscountPercentage(product.price, product.comparePrice);
  const inWishlist = isInWishlist(product.id);
  const inStock = selectedVariant ? selectedVariant.stock > 0 : product.variants.some((v) => v.stock > 0);

  const handleAddToCart = () => {
    const variant = selectedVariant || product.variants.find((v) => v.stock > 0);
    if (!variant) { toast.error('Please select a size'); return; }
    addItem({
      id: Date.now(), quantity,
      productId: product.id, variantId: variant.id,
      product: { id: product.id, name: product.name, slug: product.slug, price: product.price, comparePrice: product.comparePrice, images: product.images, team: product.team, league: product.league },
      variant: { id: variant.id, size: variant.size, stock: variant.stock },
    });
    toast.success('Added to cart!', { icon: '⚽', style: { borderRadius: '12px', background: '#0A4A2F', color: '#fff' } });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-green">Home</Link>
          <ChevronRight size={13} />
          <Link href="/shop" className="hover:text-brand-green">Shop</Link>
          <ChevronRight size={13} />
          {product.category && (
            <>
              <Link href={`/categories/${product.category.slug}`} className="hover:text-brand-green">{product.category.name}</Link>
              <ChevronRight size={13} />
            </>
          )}
          <span className="text-brand-black font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-3">
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in group"
              onClick={() => setLightbox(true)}
            >
              <Image src={currentImage} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              {discount > 0 && <Badge variant="red" className="absolute top-4 left-4">-{discount}%</Badge>}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                <ZoomIn size={28} className="text-white drop-shadow-lg" />
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-brand-green' : 'border-transparent'}`}
                  >
                    <Image src={img.url} alt={`View ${i + 1}`} width={64} height={64} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.isNewArrival && <Badge variant="green">New Arrival</Badge>}
              {product.isBestSeller && <Badge variant="gold">Best Seller</Badge>}
              {product.jerseyType && <Badge variant="gray">{product.jerseyType.replace('_', ' ')}</Badge>}
              {!inStock && <Badge variant="red">Out of Stock</Badge>}
            </div>

            {/* Team / League */}
            {(product.team || product.league) && (
              <p className="text-brand-green text-sm font-semibold uppercase tracking-wider mb-1">
                {product.team}{product.team && product.league ? ' · ' : ''}{product.league}
              </p>
            )}

            <h1 className="text-2xl sm:text-3xl font-display text-brand-black mb-3 leading-tight">{product.name}</h1>

            {/* Rating */}
            {product.averageRating !== undefined && (
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.averageRating} size={16} showValue count={product.reviewCount} />
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl font-bold text-brand-green">{formatPrice(product.price)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
              )}
              {discount > 0 && (
                <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Save {discount}%</span>
              )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.shortDescription}</p>
            )}

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-brand-black">Select Size</span>
                <button className="text-xs text-brand-green underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    disabled={variant.stock === 0}
                    onClick={() => setSelectedVariant(variant)}
                    className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-all ${
                      selectedVariant?.id === variant.id
                        ? 'border-brand-green bg-brand-green text-white'
                        : variant.stock === 0
                        ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through'
                        : 'border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green'
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <p className="text-xs text-gray-400 mt-2">
                  {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-bold text-brand-black">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-sm text-gray-400">
                Total: <strong className="text-brand-green">{formatPrice(product.price * quantity)}</strong>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button onClick={handleAddToCart} disabled={!inStock} size="lg" fullWidth leftIcon={<ShoppingBag size={18} />}>
                Add to Cart
              </Button>
              <Button onClick={handleBuyNow} disabled={!inStock} variant="gold" size="lg" className="shrink-0 px-6">
                Buy Now
              </Button>
              <button
                onClick={() => toggle(product.id)}
                className={`w-12 h-12 shrink-0 rounded-xl border-2 flex items-center justify-center transition-colors ${
                  inWishlist ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
                }`}
              >
                <Heart size={18} className={inWishlist ? 'fill-red-500' : ''} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-brand-gray rounded-2xl mb-4">
              {[
                { icon: Shield, text: '100% Authentic' },
                { icon: Truck, text: 'Fast Delivery' },
                { icon: RefreshCw, text: '7-Day Returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-8 h-8 bg-brand-green/10 rounded-lg flex items-center justify-center">
                    <Icon size={15} className="text-brand-green" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{text}</span>
                </div>
              ))}
            </div>

            {/* Share */}
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-green transition-colors">
              <Share2 size={15} /> Share this product
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
            {(['description', 'specs', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-6 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-500 hover:text-brand-black'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${product.reviewCount || 0})` : tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="prose prose-sm max-w-none text-gray-600">
                <p className="text-base leading-relaxed">{product.description}</p>
              </motion.div>
            )}
            {activeTab === 'specs' && (
              <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['Team / Club', product.team],
                      ['League', product.league],
                      ['Season', product.season],
                      ['Type', product.jerseyType?.replace('_', ' ')],
                      ['Material', product.material],
                      ['SKU', product.sku],
                      ['Available Sizes', product.variants.map((v) => v.size).join(', ')],
                    ].filter(([, v]) => v).map(([label, value]) => (
                      <tr key={label as string}>
                        <td className="py-3 pr-6 font-semibold text-brand-black w-36">{label}</td>
                        <td className="py-3 text-gray-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {product.reviews?.length ? (
                  <div className="space-y-5">
                    {product.reviews.map((review: { id: string; rating: number; title: string; body: string; user?: { firstName: string; lastName: string }; createdAt: string }) => (
                      <div key={review.id} className="bg-brand-gray rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-brand-black text-sm">
                              {review.user?.firstName} {review.user?.lastName}
                            </p>
                            <StarRating rating={review.rating} size={13} className="mt-1" />
                          </div>
                          <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-semibold text-sm text-brand-black mb-1">{review.title}</h4>
                        <p className="text-gray-600 text-sm">{review.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Star size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No reviews yet. Be the first to review this jersey!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Related */}
        {related && related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display text-brand-black mb-6">You May Also Like</h2>
            <ProductGrid products={related} columns={4} />
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <div className="relative w-full max-w-2xl aspect-square rounded-2xl overflow-hidden">
              <Image src={currentImage} alt={product.name} fill className="object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}

function ProductDetailSkeleton() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </MainLayout>
  );
}
