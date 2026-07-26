'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const { data: dashboard } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard().then((r) => r.data.data),
  });

  const { data: chartData } = useQuery({
    queryKey: ['admin-analytics-chart'],
    queryFn: () => adminApi.getAnalytics({ period: 'month' }).then((r) => r.data.data),
  });

  const summaryCards = [
    { label: 'Total Revenue', value: formatPrice(dashboard?.revenue?.total || 0), icon: DollarSign, change: `+${dashboard?.revenue?.growth || 0}%`, up: true },
    { label: 'Monthly Revenue', value: formatPrice(dashboard?.revenue?.monthly || 0), icon: TrendingUp, change: 'This month', up: true },
    { label: 'Total Orders', value: dashboard?.orders?.total || 0, icon: ShoppingBag, change: `${dashboard?.orders?.monthly || 0} this month`, up: true },
    { label: 'Total Customers', value: dashboard?.customers?.total || 0, icon: Users, change: `${dashboard?.customers?.new || 0} new this month`, up: true },
  ];

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, change }) => (
          <div key={label} className="bg-[#1C2128] rounded-2xl p-5 border border-white/5">
            <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center mb-3">
              <Icon size={18} className="text-brand-green" />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-white/40 text-xs mt-0.5">{label}</div>
            <div className="text-green-400 text-xs mt-1">{change}</div>
          </div>
        ))}
      </div>

      {/* Chart placeholder - in production, use a library like recharts */}
      <div className="bg-[#1C2128] rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-brand-green" /> Revenue Chart
          </h2>
          <p className="text-white/30 text-xs">Monthly breakdown</p>
        </div>

        {chartData && Array.isArray(chartData) && chartData.length > 0 ? (
          <div className="space-y-3">
            {(chartData as { date: string; revenue: number; orders: number }[]).map((point) => {
              const maxRevenue = Math.max(...chartData.map((p: { revenue: number }) => p.revenue));
              const pct = maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={point.date} className="flex items-center gap-3">
                  <span className="text-white/40 text-xs w-20 shrink-0">{point.date}</span>
                  <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-green to-brand-green-light rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-green-400 font-bold text-xs w-24 text-right shrink-0">{formatPrice(point.revenue)}</span>
                  <span className="text-white/30 text-xs w-16 text-right shrink-0">{point.orders} orders</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-white/20">
            <div className="text-center">
              <BarChart3 size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No data available yet</p>
              <p className="text-xs mt-1">Data will appear once orders are placed</p>
            </div>
          </div>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-[#1C2128] rounded-2xl p-6 border border-white/5">
        <h2 className="font-bold text-white mb-5">Top Selling Products</h2>
        <p className="text-white/30 text-sm text-center py-8">
          Top products data will appear here once orders are processed.
        </p>
      </div>
    </div>
  );
}
