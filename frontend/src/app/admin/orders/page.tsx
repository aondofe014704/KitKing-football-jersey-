'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Eye, ChevronDown } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', status, page, search],
    queryFn: () =>
      adminApi.getOrders({
        status: status === 'ALL' ? '' : status,
        page, limit: 20,
        search,
      }).then((r) => r.data.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: string }) =>
      adminApi.updateOrderStatus(id, newStatus),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const orders = data?.orders || [];

  return (
    <div className="space-y-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <span className="text-white/40 text-sm">{data?.meta?.total || 0} total orders</span>
      </div>

      {/* Filters */}
      <div className="bg-[#1C2128] rounded-2xl p-4 border border-white/5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            placeholder="Search order number, customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-green/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                status === s ? 'bg-brand-green text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1C2128] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Order #', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-white/40 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton className="h-4 bg-white/5 rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                : orders.map((order: {
                    id: string; orderNumber: string; status: string; paymentStatus: string;
                    total: number; createdAt: string;
                    items: { id: string }[];
                    user?: { firstName: string; lastName: string; email: string };
                  }) => (
                    <tr key={order.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="font-mono text-brand-gold hover:underline text-xs">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white text-xs font-medium">{order.user?.firstName} {order.user?.lastName}</p>
                        <p className="text-white/40 text-[11px]">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-white/70 text-xs">{order.items.length}</td>
                      <td className="px-4 py-3 text-green-400 font-bold text-sm">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          order.paymentStatus === 'PAID' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative group">
                          <button className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${getOrderStatusColor(order.status)}`}>
                            {order.status} <ChevronDown size={10} />
                          </button>
                          <div className="absolute top-full left-0 mt-1 w-40 bg-[#2D3748] border border-white/10 rounded-xl shadow-2xl z-10 hidden group-hover:block py-1">
                            {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                              <button
                                key={s}
                                onClick={() => updateStatus.mutate({ id: order.id, newStatus: s })}
                                className="w-full text-left px-4 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.id}`}
                          className="p-1.5 bg-white/5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors inline-flex">
                          <Eye size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!isLoading && orders.length === 0 && (
          <div className="py-16 text-center text-white/30">No orders found</div>
        )}

        {/* Pagination */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/5">
            <p className="text-white/40 text-xs">
              Page {page} of {data.meta.totalPages} · {data.meta.total} orders
            </p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-xs border border-white/10 rounded-lg text-white/50 disabled:opacity-30 hover:border-white/20 transition-colors">
                Previous
              </button>
              <button disabled={page === data.meta.totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-xs border border-white/10 rounded-lg text-white/50 disabled:opacity-30 hover:border-white/20 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
