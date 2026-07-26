'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { Product } from '@/types/product';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search, page],
    queryFn: () =>
      adminApi.getProducts({ search, page, limit: 20, status: '' }).then((r) => r.data.data),
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteProduct.mutate(id);
    }
  };

  const products: Product[] = data?.products || [];

  return (
    <div className="space-y-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green-light transition-colors">
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="bg-[#1C2128] rounded-2xl p-4 border border-white/5">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            placeholder="Search products by name, team, league..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-green/50"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#1C2128] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-white/40 text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-4 py-3"><Skeleton className="h-10 bg-white/5 rounded" /></td></tr>
                  ))
                : products.map((product) => {
                    const image = getPrimaryImage(product.images);
                    const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
                    return (
                      <tr key={product.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                              <Image src={image} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-xs line-clamp-1">{product.name}</p>
                              <p className="text-white/40 text-[11px] font-mono">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs">{product.category?.name || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="text-green-400 font-bold text-sm">{formatPrice(product.price)}</span>
                          {product.comparePrice && (
                            <span className="text-white/30 text-xs line-through ml-2">{formatPrice(product.comparePrice)}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold ${totalStock === 0 ? 'text-red-400' : totalStock < 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {totalStock === 0 ? 'Out of Stock' : `${totalStock} units`}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            product.status === 'ACTIVE' ? 'bg-green-500/15 text-green-400'
                            : product.status === 'DRAFT' ? 'bg-gray-500/15 text-gray-400'
                            : 'bg-red-500/15 text-red-400'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Link href={`/shop/${product.slug}`}
                              className="p-1.5 bg-white/5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                              <Eye size={13} />
                            </Link>
                            <Link href={`/admin/products/${product.id}/edit`}
                              className="p-1.5 bg-white/5 rounded-lg text-white/50 hover:bg-blue-500/20 hover:text-blue-400 transition-colors">
                              <Edit size={13} />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="p-1.5 bg-white/5 rounded-lg text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {!isLoading && products.length === 0 && (
          <div className="py-16 text-center text-white/30">
            <p className="mb-3">No products found</p>
            <Link href="/admin/products/new" className="text-brand-green text-sm hover:underline">Add your first product →</Link>
          </div>
        )}

        {data?.meta && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/5">
            <p className="text-white/40 text-xs">Page {page} of {data.meta.totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-xs border border-white/10 rounded-lg text-white/50 disabled:opacity-30 hover:border-white/20">
                Previous
              </button>
              <button disabled={page === data.meta.totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-xs border border-white/10 rounded-lg text-white/50 disabled:opacity-30 hover:border-white/20">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
