'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Package, Clock, ChevronRight, Search } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

const STATUS_FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', statusFilter, page],
    queryFn: () =>
      ordersApi.getMyOrders({
        status: statusFilter === 'ALL' ? '' : statusFilter,
        page,
        limit: '10',
      }).then((r) => r.data.data),
  });

  const orders = (data?.orders || []).filter((o: { orderNumber: string }) =>
    !search || o.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="text-xl font-bold text-brand-black mb-5">My Orders</h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search by order number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? 'bg-brand-green text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={44} className="text-gray-200 mx-auto mb-3" />
            <p className="font-semibold text-gray-500">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">Orders you place will appear here</p>
            <Link href="/shop" className="inline-block mt-4 px-5 py-2 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green-light transition-colors">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: {
              id: string;
              orderNumber: string;
              status: string;
              paymentStatus: string;
              total: number;
              createdAt: string;
              items: { id: string; productName: string; productImage: string; size: string; quantity: number }[];
            }) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="block p-4 rounded-2xl border border-gray-100 hover:border-brand-green/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-brand-black font-mono text-sm">{order.orderNumber}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock size={11} />
                      {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    {/* Item thumbnails */}
                    <div className="flex gap-1 mt-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden">
                          {item.productImage && <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-brand-green text-lg">{formatPrice(order.total)}</span>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:border-brand-green transition-colors">
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-500">{page} / {data.meta.totalPages}</span>
            <button disabled={page === data.meta.totalPages} onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:border-brand-green transition-colors">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
