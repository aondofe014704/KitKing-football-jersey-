'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, ShoppingBag, Package, Users, TrendingUp, TrendingDown,
  Clock, CheckCircle, XCircle, AlertCircle, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

function ClientDate() {
  const [label, setLabel] = useState('');
  useEffect(() => {
    setLabel(new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);
  return <>{label}</>;
}

function StatCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; trend?: { value: string; up: boolean };
}) {
  return (
    <div className="bg-[#1C2128] rounded-2xl p-5 border border-white/5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={18} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend.up ? 'text-green-400' : 'text-red-400'}`}>
            {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-white/50 text-xs mt-0.5">{label}</div>
      {sub && <div className="text-white/30 text-xs mt-1">{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard().then((r) => r.data.data),
  });

  const stats = [
    {
      label: "Today's Revenue", value: formatPrice(data?.todayRevenue || 0),
      sub: `${data?.todayOrders || 0} orders today`, icon: DollarSign,
      color: 'bg-green-500/20 text-green-400',
      trend: { value: '+12%', up: true },
    },
    {
      label: 'Total Orders', value: data?.totalOrders || 0,
      sub: `${data?.pendingOrders || 0} pending`, icon: Package,
      color: 'bg-blue-500/20 text-blue-400',
      trend: { value: '+5%', up: true },
    },
    {
      label: 'Total Customers', value: data?.totalCustomers || 0,
      sub: `${data?.newCustomersToday || 0} new today`, icon: Users,
      color: 'bg-purple-500/20 text-purple-400',
      trend: { value: '+8%', up: true },
    },
    {
      label: 'Monthly Revenue', value: formatPrice(data?.monthRevenue || 0),
      sub: 'This month', icon: DollarSign,
      color: 'bg-amber-500/20 text-amber-400',
      trend: { value: '+18%', up: true },
    },
  ];

  const orderStatuses = [
    { label: 'Pending', value: data?.pendingOrders || 0, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Processing', value: data?.processingOrders || 0, icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Delivered', value: data?.deliveredOrders || 0, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Cancelled', value: data?.cancelledOrders || 0, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">
            <ClientDate />
          </p>
        </div>
        <Link href="/admin/orders" className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green-light transition-colors">
          View Orders <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 bg-white/5 rounded-2xl" />)}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </motion.div>
      )}

      {/* Order Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {orderStatuses.map(({ label, value, icon: Icon, color, bg }) => (
          <Link key={label} href={`/admin/orders?status=${label.toUpperCase()}`}
            className={`${bg} border border-white/5 rounded-2xl p-4 flex items-center gap-3 hover:border-white/10 transition-colors`}>
            <Icon size={18} className={color} />
            <div>
              <div className="text-xl font-bold text-white">{value}</div>
              <div className={`text-xs ${color}`}>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#1C2128] rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="font-bold text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-brand-gold text-xs hover:underline flex items-center gap-1">
            View All <ArrowRight size={11} />
          </Link>
        </div>
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 bg-white/5 rounded-xl" />)}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {(data?.recentOrders || []).map((order: {
              id: string; orderNumber: string; status: string;
              total: number; createdAt: string;
              user?: { firstName: string; lastName: string };
            }) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm font-mono">{order.orderNumber}</p>
                  <p className="text-white/40 text-xs">{order.user?.firstName} {order.user?.lastName} · {formatDate(order.createdAt)}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getOrderStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className="font-bold text-green-400 text-sm shrink-0">{formatPrice(order.total)}</span>
              </Link>
            ))}
            {(!data?.recentOrders || data.recentOrders.length === 0) && (
              <div className="p-10 text-center text-white/30 text-sm">No orders yet</div>
            )}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Add Product', href: '/admin/products/new', icon: ShoppingBag, color: 'bg-blue-500/10 text-blue-400' },
          { label: 'View Orders', href: '/admin/orders', icon: Package, color: 'bg-green-500/10 text-green-400' },
          { label: 'Manage Coupons', href: '/admin/coupons', icon: Package, color: 'bg-amber-500/10 text-amber-400' },
          { label: 'Store Settings', href: '/admin/settings', icon: Package, color: 'bg-purple-500/10 text-purple-400' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href}
              className={`${item.color} border border-white/5 rounded-2xl p-4 flex items-center gap-3 hover:border-white/10 transition-colors text-sm font-medium`}>
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
