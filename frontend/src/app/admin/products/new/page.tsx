'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { adminApi, categoriesApi } from '@/lib/api';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(3, 'Product name required'),
  description: z.string().min(20, 'Description required (min 20 chars)'),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive('Price required'),
  comparePrice: z.coerce.number().optional(),
  sku: z.string().min(2, 'SKU required'),
  categoryId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  team: z.string().optional(),
  league: z.string().optional(),
  season: z.string().optional(),
  jerseyType: z.enum(['HOME', 'AWAY', 'THIRD', 'GOALKEEPER', 'TRAINING']).optional(),
  material: z.string().optional(),
  tags: z.string().optional(),
  variants: z.array(z.object({
    size: z.string().min(1, 'Size required'),
    stock: z.coerce.number().min(0),
  })).min(1, 'Add at least one size variant'),
});
type FormData = z.infer<typeof schema>;

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'YXS', 'YS', 'YM', 'YL'];

export default function NewProductPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll().then((r) => r.data.data),
  });

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'ACTIVE',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      variants: [{ size: 'M', stock: 10 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  const createProduct = useMutation({
    mutationFn: (data: object) => adminApi.createProduct(data),
    onSuccess: (res) => {
      toast.success('Product created!');
      router.push('/admin/products');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create product';
      toast.error(msg);
    },
  });

  const addImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
      images: images.map((url, i) => ({ url, isPrimary: i === 0, order: i })),
    };
    createProduct.mutate(payload);
  };

  return (
    <div className="text-white space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="bg-[#1C2128] rounded-2xl p-6 border border-white/5">
            <h2 className="font-bold mb-5 text-white/80">Basic Information</h2>
            <div className="space-y-4">
              <AdminInput label="Product Name" placeholder="e.g. Arsenal Home Kit 2024/25" error={errors.name?.message} {...register('name')} required />
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="SKU" placeholder="e.g. ARS-HOME-2425" error={errors.sku?.message} {...register('sku')} required />
                <AdminInput label="Season" placeholder="e.g. 2024/25" {...register('season')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Description <span className="text-red-400">*</span></label>
                <textarea rows={4} placeholder="Full product description..." {...register('description')}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-green/50 resize-none ${errors.description ? 'border-red-500/50' : 'border-white/10'}`}
                />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
              </div>
              <AdminInput label="Short Description (optional)" placeholder="One line summary..." {...register('shortDescription')} />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#1C2128] rounded-2xl p-6 border border-white/5">
            <h2 className="font-bold mb-5 text-white/80">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <AdminInput label="Price (₦)" type="number" placeholder="15000" error={errors.price?.message} {...register('price')} required />
              <AdminInput label="Compare Price (₦)" type="number" placeholder="20000" hint="Original price (shown crossed out)" {...register('comparePrice')} />
            </div>
          </div>

          {/* Jersey Details */}
          <div className="bg-[#1C2128] rounded-2xl p-6 border border-white/5">
            <h2 className="font-bold mb-5 text-white/80">Jersey Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <AdminInput label="Team / Club" placeholder="e.g. Arsenal FC" {...register('team')} />
              <AdminInput label="League" placeholder="e.g. Premier League" {...register('league')} />
              <AdminInput label="Material" placeholder="e.g. 100% Polyester Dri-FIT" {...register('material')} />
              <AdminInput label="Tags (comma separated)" placeholder="arsenal, epl, home-kit" {...register('tags')} />
            </div>
          </div>

          {/* Variants */}
          <div className="bg-[#1C2128] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white/80">Size Variants</h2>
              <button type="button" onClick={() => append({ size: 'S', stock: 0 })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-green/20 text-brand-green rounded-lg text-xs font-semibold hover:bg-brand-green/30 transition-colors">
                <Plus size={13} /> Add Size
              </button>
            </div>
            {errors.variants && <p className="text-red-400 text-xs mb-3">{errors.variants.message}</p>}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3">
                  <select {...register(`variants.${index}.size`)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-green/50 w-28">
                    {SIZES.map((s) => <option key={s} value={s} className="bg-gray-800">{s}</option>)}
                  </select>
                  <input type="number" min="0" placeholder="Stock" {...register(`variants.${index}.stock`)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-green/50" />
                  <button type="button" onClick={() => remove(index)} disabled={fields.length === 1}
                    className="p-2 text-red-400/50 hover:text-red-400 disabled:opacity-20 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-[#1C2128] rounded-2xl p-6 border border-white/5">
            <h2 className="font-bold mb-5 text-white/80">Product Images</h2>
            <div className="flex gap-3 mb-4">
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL (Cloudinary, Unsplash, etc.)"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-green/50" />
              <button type="button" onClick={addImage} className="px-4 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green-light transition-colors">
                Add
              </button>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Image ${i + 1}`} className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                    {i === 0 && <span className="absolute top-1 left-1 text-[10px] bg-brand-green text-white px-1.5 rounded">Primary</span>}
                    <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-[#1C2128] rounded-2xl p-5 border border-white/5">
            <h3 className="font-bold mb-4 text-white/80">Publish Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/60 block mb-1.5">Status</label>
                <select {...register('status')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-green/50">
                  <option value="ACTIVE" className="bg-gray-800">Active</option>
                  <option value="INACTIVE" className="bg-gray-800">Inactive</option>
                  <option value="DRAFT" className="bg-gray-800">Draft</option>
                </select>
              </div>
              {[
                { name: 'isFeatured' as const, label: 'Featured Product' },
                { name: 'isNewArrival' as const, label: 'New Arrival' },
                { name: 'isBestSeller' as const, label: 'Best Seller' },
              ].map(({ name, label }) => (
                <label key={name} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register(name)} className="accent-brand-green w-4 h-4" />
                  <span className="text-sm text-white/70">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="bg-[#1C2128] rounded-2xl p-5 border border-white/5">
            <h3 className="font-bold mb-4 text-white/80">Category</h3>
            <select {...register('categoryId')}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-green/50">
              <option value="" className="bg-gray-800">Select Category</option>
              {(categories || []).map((cat: { id: string; name: string }) => (
                <option key={cat.id} value={cat.id} className="bg-gray-800">{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Jersey Type */}
          <div className="bg-[#1C2128] rounded-2xl p-5 border border-white/5">
            <h3 className="font-bold mb-4 text-white/80">Jersey Type</h3>
            <select {...register('jerseyType')}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-green/50">
              <option value="" className="bg-gray-800">Select Type</option>
              {['HOME', 'AWAY', 'THIRD', 'GOALKEEPER', 'TRAINING'].map((t) => (
                <option key={t} value={t} className="bg-gray-800">{t}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <Button type="submit" isLoading={isSubmitting} fullWidth size="lg" leftIcon={<Save size={15} />}>
            Save Product
          </Button>
          <button type="button" onClick={() => router.back()}
            className="w-full py-2.5 border border-white/10 rounded-xl text-white/50 text-sm hover:bg-white/5 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Admin-styled input wrapper
function AdminInput({ label, error, hint, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/60 mb-1.5">
        {label} {props.required && <span className="text-red-400">*</span>}
      </label>
      <input
        className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-green/50 transition-colors ${error ? 'border-red-500/50' : 'border-white/10'}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-white/30 text-xs mt-1">{hint}</p>}
    </div>
  );
}
