'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Upload } from 'lucide-react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminGalleryPage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const qc = useQueryClient();

  const { data: images, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: () => adminApi.getGallery().then((r) => r.data.data),
  });

  const addImage = useMutation({
    mutationFn: (data: object) => adminApi.addGalleryImage(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery'] });
      setUrl(''); setTitle(''); setAdding(false);
      toast.success('Image added to gallery');
    },
    onError: () => toast.error('Failed to add image'),
  });

  const deleteImage = useMutation({
    mutationFn: (id: string) => adminApi.deleteGalleryImage(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast.success('Image removed');
    },
  });

  const handleAdd = () => {
    if (!url.trim()) return;
    addImage.mutate({ url: url.trim(), title: title.trim() });
  };

  return (
    <div className="space-y-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <button onClick={() => setAdding(!adding)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green-light transition-colors">
          <Plus size={15} /> Add Image
        </button>
      </div>

      {/* Add Image Form */}
      {adding && (
        <div className="bg-[#1C2128] rounded-2xl p-5 border border-brand-green/30">
          <h3 className="font-bold mb-4 text-white/80">Add New Image</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-white/60 block mb-1.5">Image URL <span className="text-red-400">*</span></label>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://res.cloudinary.com/..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-green/50" />
            </div>
            <div>
              <label className="text-xs text-white/60 block mb-1.5">Title (optional)</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Jersey Collection 2025"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-green/50" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={!url.trim() || addImage.isPending}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green-light disabled:opacity-50 transition-colors">
              <Upload size={14} /> {addImage.isPending ? 'Adding...' : 'Add to Gallery'}
            </button>
            <button onClick={() => setAdding(false)}
              className="px-4 py-2.5 border border-white/10 rounded-xl text-white/50 text-sm hover:bg-white/5 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[#1C2128] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(images || []).map((img: { id: string; url: string; title?: string }) => (
            <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden bg-[#1C2128]">
              <Image src={img.url} alt={img.title || 'Gallery'} fill className="object-cover" sizes="25vw" />
              {img.title && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">{img.title}</p>
                </div>
              )}
              <button
                onClick={() => confirm('Remove from gallery?') && deleteImage.mutate(img.id)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {(!images || images.length === 0) && (
            <div className="col-span-4 py-16 text-center text-white/30">No gallery images yet</div>
          )}
        </div>
      )}
    </div>
  );
}
