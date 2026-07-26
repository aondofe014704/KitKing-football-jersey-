'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { categoriesApi, adminApi } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

type FormData = { name: string; description?: string; };

export default function AdminCategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const qc = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll().then((r) => r.data.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>();

  const createCategory = useMutation({
    mutationFn: (data: object) => adminApi.createProduct(data), // placeholder — use categories endpoint
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created');
      setShowModal(false); reset();
    },
  });

  return (
    <div className="space-y-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green-light">
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-[#1C2128] border border-white/5 rounded-2xl animate-pulse" />)
          : (categories || []).map((cat: { id: string; name: string; slug: string; description?: string; _count?: { products: number } }) => (
              <div key={cat.id} className="bg-[#1C2128] rounded-2xl p-5 border border-white/5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
                      <Tag size={16} className="text-brand-green" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{cat.name}</p>
                      <p className="text-white/40 text-xs font-mono">{cat.slug}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="p-1.5 bg-white/5 rounded-lg text-white/40 hover:text-blue-400 transition-colors">
                      <Edit size={12} />
                    </button>
                    <button className="p-1.5 bg-white/5 rounded-lg text-white/40 hover:text-red-400 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                {cat.description && <p className="text-white/40 text-xs mt-3">{cat.description}</p>}
                <div className="mt-3 text-xs text-brand-gold">{cat._count?.products || 0} products</div>
              </div>
            ))}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="Add Category">
        <form onSubmit={handleSubmit((d) => createCategory.mutate(d))} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name *</label>
            <input placeholder="e.g. Club Jerseys" {...register('name', { required: true })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <input placeholder="Short description..." {...register('description')}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
          </div>
          <div className="flex gap-3">
            <Button type="submit" isLoading={isSubmitting} leftIcon={<Plus size={14} />}>Create</Button>
            <button type="button" onClick={() => { setShowModal(false); reset(); }}
              className="px-4 py-2.5 border rounded-xl text-sm text-gray-600">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
