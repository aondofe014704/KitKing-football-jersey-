'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, CheckCircle, Truck, Home, Clock, XCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ordersApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { Order } from '@/types/order';
import Link from 'next/link';

const STEPS = [
  { key: 'PENDING', label: 'Order Placed', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
  { key: 'PROCESSING', label: 'Processing', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' },
  { key: 'DELIVERED', label: 'Delivered', icon: Home, color: 'text-green-500', bg: 'bg-green-50 border-green-200' },
];

const STATUS_ORDER = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await ordersApi.trackByNumber(orderNumber.trim().toUpperCase());
      setOrder(res.data.data);
    } catch {
      setError('Order not found. Please check your order number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order
    ? order.status === 'CANCELLED' || order.status === 'REFUNDED'
      ? -1
      : STATUS_ORDER.indexOf(order.status)
    : -1;

  return (
    <MainLayout>
      {/* Header */}
      <div className="gradient-green py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-display text-white mb-2">Track Your Order</h1>
          <p className="text-white/70">Enter your order number to get real-time delivery updates</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
          <form onSubmit={handleTrack} className="flex gap-3">
            <Input
              placeholder="Enter order number e.g. KK-20250115-XXXX"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              leftIcon={<Search size={16} />}
              className="font-mono"
            />
            <Button type="submit" isLoading={loading} className="shrink-0">
              Track
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-2">
            Your order number can be found in your confirmation email or{' '}
            <Link href="/dashboard/orders" className="text-brand-green hover:underline">My Orders</Link>.
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3 mb-6"
          >
            <XCircle size={20} className="text-red-500 shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Order Result */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Order Info Card */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Order Number</p>
                    <p className="text-xl font-bold text-brand-black font-mono">{order.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Placed on</p>
                    <p className="font-semibold text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                {order.status === 'CANCELLED' || order.status === 'REFUNDED' ? (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <XCircle size={20} className="text-red-500" />
                    <div>
                      <p className="font-semibold text-red-700">{order.status === 'CANCELLED' ? 'Order Cancelled' : 'Order Refunded'}</p>
                      <p className="text-sm text-red-600">Please contact support for assistance.</p>
                    </div>
                  </div>
                ) : (
                  /* Progress Steps */
                  <div className="relative">
                    {/* Progress line */}
                    <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-brand-green"
                      />
                    </div>

                    <div className="flex justify-between relative">
                      {STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const done = idx <= currentStepIndex;
                        const active = idx === currentStepIndex;
                        return (
                          <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
                              done
                                ? 'bg-brand-green border-brand-green text-white shadow-md'
                                : 'bg-white border-gray-200 text-gray-300'
                            } ${active ? 'ring-4 ring-brand-green/20 scale-110' : ''}`}>
                              <Icon size={18} />
                            </div>
                            <span className={`text-xs font-medium text-center ${done ? 'text-brand-green' : 'text-gray-400'}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {order.trackingNumber && (
                  <div className="mt-5 p-3 bg-brand-gray rounded-xl flex items-center gap-3">
                    <Truck size={16} className="text-brand-green" />
                    <div>
                      <p className="text-xs text-gray-500">Tracking Number</p>
                      <p className="font-bold text-brand-black font-mono text-sm">{order.trackingNumber}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-bold text-brand-black mb-4">Order Items ({order.items.length})</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {item.productImage && (
                          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-brand-black">{item.productName}</p>
                        <p className="text-xs text-gray-400">Size: {item.size} · Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-brand-green text-sm">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-brand-black">
                  <span>Order Total</span>
                  <span className="text-brand-green">{formatPrice(order.total)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
