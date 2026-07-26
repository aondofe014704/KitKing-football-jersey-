'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Package, Heart, MapPin, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { ordersApi } from '@/lib/api';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { productIds } = useWishlistStore();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersApi.getMyOrders({ limit: '5' }).then((r) => r.data.data),
  });

  const orders = ordersData?.orders || [];
  const totalSpent = orders.reduce((sum: number, o: { total: number }) => sum + o.total, 0);

  const stats = [
    { label: 'Total Orders', value: ordersData?.meta?.total || 0, icon: Package, color: 'bg-blue-50 text-blue-600', href: '/dashboard/orders' },
    { label: 'Wishlist Items', value: productIds.length, icon: Heart, color: 'bg-red-50 text-red-500', href: '/dashboard/wishlist' },
    { label: 'Saved Addresses', value: user?.addresses?.length || 0, icon: MapPin, color: 'bg-green-50 text-green-600', href: '/dashboard/addresses' },
    { label: 'Total Spent', value: formatPrice(totalSpent), icon: TrendingUp, color: 'bg-gold-50 bg-amber-50 text-amber-600', href: '/dashboard/orders' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-brand-green to-brand-green-light rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-display mb-1">Welcome back, {user?.firstName}! 👋</h2>
        <p className="text-white/70 text-sm">Manage your orders, wishlist and account details all in one place.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-white text-sm font-semibold transition-colors">
          Shop New Arrivals <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-shadow group">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={18} />
              </div>
              <div className="text-2xl font-bold text-brand-black">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-brand-black text-lg">Recent Orders</h3>
          <Link href="/dashboard/orders" className="text-sm text-brand-green font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10">
            <Package size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No orders yet</p>
            <Link href="/shop" className="text-brand-green text-sm hover:underline mt-1 inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: { id: string; orderNumber: string; status: string; total: number; createdAt: string; items: { id: string; productName: string }[] }) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-green/30 hover:bg-brand-green/5 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                  <Package size={18} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-black text-sm font-mono">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock size={10} /> {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getOrderStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="font-bold text-brand-green text-sm mt-1">{formatPrice(order.total)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
