'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', search, page],
    queryFn: () =>
      adminApi.getCustomers({ search, page, limit: 20 }).then((r) => (r as { data: { data: unknown } }).data.data),
  });

  const customers = data?.customers || [];

  return (
    <div className="space-y-5 text-white">
      <h1 className="text-2xl font-bold">Customers</h1>

      <div className="bg-[#1C2128] rounded-2xl p-4 border border-white/5">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input placeholder="Search by name, email, phone..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-green/50" />
        </div>
      </div>

      <div className="bg-[#1C2128] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Customer', 'Email', 'Phone', 'Orders', 'Joined', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-white/40 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><Skeleton className="h-8 bg-white/5 rounded" /></td></tr>
                ))
              : customers.map((customer: {
                  id: string; firstName: string; lastName: string; email: string;
                  phone?: string; isActive: boolean; createdAt: string;
                  _count?: { orders: number };
                }) => (
                  <tr key={customer.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-green/20 rounded-full flex items-center justify-center text-brand-gold text-xs font-bold shrink-0">
                          {customer.firstName[0]}{customer.lastName[0]}
                        </div>
                        <span className="text-white font-medium text-xs">{customer.firstName} {customer.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">{customer.email}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{customer.phone || '—'}</td>
                    <td className="px-4 py-3 text-white/70 text-xs">{customer._count?.orders || 0}</td>
                    <td className="px-4 py-3 text-white/40 text-xs">{formatDate(customer.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        customer.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {customer.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!isLoading && customers.length === 0 && (
          <div className="py-12 text-center text-white/30 text-sm">No customers found</div>
        )}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-white/5">
            <p className="text-white/40 text-xs">Page {page} of {data.meta.totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-xs border border-white/10 rounded-lg text-white/50 disabled:opacity-30 hover:border-white/20">Previous</button>
              <button disabled={page === data.meta.totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-xs border border-white/10 rounded-lg text-white/50 disabled:opacity-30 hover:border-white/20">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
