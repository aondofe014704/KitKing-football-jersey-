'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers';
import { z } from 'zod';
import { Plus, Trash2, Tag } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

const schema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.coerce.number().positive(),
  minOrderAmount: z.coerce.number().optional(),
  maxUses: z.coerce.number().optional(),
  description: z.string().optional(),
  expiresAt: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function AdminCouponsPage() {
  const [showModal, setShowModal] = useState(false);
  const qc = useQueryClient();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => adminApi.getCoupons().then((r) => r.data.data),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'PERCENTAGE' },
  });

  const createCoupon = useMutation({
    mutationFn: (data: object) => adminApi.createCoupon(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon created!');
      setShowModal(false);
      reset();
    },
    onError: () => toast.error('Failed to create coupon'),
  });

  const deleteCoupon = useMutation({
    mutationFn: (id: string) => adminApi.deleteCoupon(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon deleted');
    },
  });

  return (
    <div className="space-y-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green-light transition-colors">
          <Plus size={15} /> Create Coupon
        </button>
      </div>

      <div className="bg-[#1C2128] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Code', 'Type', 'Value', 'Min Order', 'Used / Max', 'Expires', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-white/40 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-8 bg-white/5 rounded animate-pulse" /></td></tr>
                ))
              : (coupons || []).map((coupon: {
                  id: string; code: string; type: string; value: number;
                  minOrderAmount?: number; maxUses?: number; usedCount: number;
                  isActive: boolean; expiresAt?: string;
                }) => (
                  <tr key={coupon.id} className="hover:bg-white/2">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-brand-gold text-sm">{coupon.code}</span>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs">{coupon.type}</td>
                    <td className="px-4 py-3 text-green-400 font-bold text-sm">
                      {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `₦${coupon.value.toLocaleString()}`}
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">
                      {coupon.minOrderAmount ? `₦${coupon.minOrderAmount.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs">{coupon.usedCount} / {coupon.maxUses || '∞'}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">
                      {coupon.expiresAt ? formatDate(coupon.expiresAt) : 'No expiry'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${coupon.isActive ? 'bg-green-500/15 text-green-400' : 'bg-gray-500/15 text-gray-400'}`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => confirm('Delete this coupon?') && deleteCoupon.mutate(coupon.id)}
                        className="p-1.5 text-red-400/50 hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!isLoading && !coupons?.length && (
          <div className="py-12 text-center text-white/30 text-sm">No coupons yet</div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="Create Coupon">
        <form onSubmit={handleSubmit((d) => createCoupon.mutate(d))} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Code <span className="text-red-500">*</span></label>
              <input placeholder="SAVE20" {...register('code')}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
              <select {...register('type')} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₦)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Value <span className="text-red-500">*</span></label>
              <input type="number" placeholder="20" {...register('value')}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Uses</label>
              <input type="number" placeholder="100" {...register('maxUses')}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Order Amount (₦)</label>
              <input type="number" placeholder="10000" {...register('minOrderAmount')}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Expires At</label>
              <input type="datetime-local" {...register('expiresAt')}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <input placeholder="e.g. 20% off on orders above ₦10,000" {...register('description')}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" isLoading={isSubmitting} leftIcon={<Tag size={14} />}>Create Coupon</Button>
            <button type="button" onClick={() => { setShowModal(false); reset(); }}
              className="px-4 py-2.5 border rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
