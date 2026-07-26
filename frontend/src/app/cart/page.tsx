'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCartStore } from '@/store/cart.store';
import { couponsApi } from '@/lib/api';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; value: number; type: string } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = getTotal();
  const shippingFee = subtotal >= 50000 ? 0 : 2500;
  const discount = appliedCoupon
    ? appliedCoupon.type === 'PERCENTAGE'
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;
  const total = subtotal + shippingFee - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await couponsApi.validate(couponCode.trim().toUpperCase());
      const coupon = res.data.data;
      setAppliedCoupon({ code: coupon.code, value: coupon.value, type: coupon.type });
      toast.success(`Coupon "${coupon.code}" applied!`, { icon: '🎉' });
    } catch {
      toast.error('Invalid or expired coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast('Coupon removed');
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-display text-brand-black mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm">
            Looks like you haven't added any jerseys yet. Discover our premium collection.
          </p>
          <Link href="/shop">
            <Button size="lg" rightIcon={<ArrowRight size={16} />}>Shop Jerseys</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-gray-400 text-sm mb-2">
            <Link href="/" className="hover:text-brand-green">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-black font-medium">Shopping Cart</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-display text-brand-black">
              Your Cart <span className="text-gray-400 text-xl font-body">({items.length} item{items.length !== 1 ? 's' : ''})</span>
            </h1>
            <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1">
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const image = getPrimaryImage(item.product.images);
                const itemTotal = item.product.price * item.quantity;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className="bg-white rounded-2xl p-4 shadow-card flex gap-4"
                  >
                    <Link href={`/shop/${item.product.slug}`} className="shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50">
                        <Image src={image} alt={item.product.name} width={96} height={96} className="w-full h-full object-cover" />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {(item.product.team || item.product.league) && (
                            <p className="text-xs text-brand-green font-semibold uppercase tracking-wide">
                              {item.product.team || item.product.league}
                            </p>
                          )}
                          <Link href={`/shop/${item.product.slug}`}>
                            <h3 className="font-bold text-brand-black text-sm leading-snug hover:text-brand-green transition-colors line-clamp-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5">Size: <strong>{item.variant.size}</strong></p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors shrink-0 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.variant.stock}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-bold text-brand-green">{formatPrice(itemTotal)}</div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-gray-400">{formatPrice(item.product.price)} each</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Continue Shopping */}
            <Link href="/shop" className="flex items-center gap-2 text-sm text-brand-green font-semibold hover:underline">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h3 className="font-bold text-brand-black mb-3 flex items-center gap-2">
                <Tag size={16} className="text-brand-green" /> Promo Code
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div>
                    <p className="text-green-700 font-bold text-sm">{appliedCoupon.code}</p>
                    <p className="text-green-600 text-xs">
                      {appliedCoupon.type === 'PERCENTAGE' ? `${appliedCoupon.value}% off` : `${formatPrice(appliedCoupon.value)} off`}
                    </p>
                  </div>
                  <button onClick={removeCoupon} className="text-green-500 hover:text-red-500">
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    className="uppercase"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    isLoading={applyingCoupon}
                    variant="outline"
                    size="md"
                    className="shrink-0"
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h3 className="font-bold text-brand-black mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? 'text-green-600 font-semibold' : 'font-medium'}>
                    {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}
                {shippingFee > 0 && (
                  <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">
                    Add {formatPrice(50000 - subtotal)} more for free shipping
                  </p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-brand-black text-base">Total</span>
                  <span className="font-bold text-brand-green text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button fullWidth size="lg" className="mt-4" rightIcon={<ArrowRight size={16} />}>
                  Proceed to Checkout
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-4 mt-4">
                {['Paystack', 'Flutterwave', 'Bank Transfer'].map((m) => (
                  <span key={m} className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
