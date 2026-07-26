'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { galleryApi } from '@/lib/api';

const TABS = ['All', 'Jerseys', 'Store', 'Customers', 'Events'];

// Fallback images if API has no data
const FALLBACK = [
  { id: '1', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80', title: 'Club Collection', category: 'Jerseys' },
  { id: '2', url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80', title: 'Match Day Kits', category: 'Jerseys' },
  { id: '3', url: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0d?w=800&q=80', title: 'National Teams', category: 'Jerseys' },
  { id: '4', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', title: 'Retro Classics', category: 'Jerseys' },
  { id: '5', url: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=800&q=80', title: 'Premium Kits', category: 'Jerseys' },
  { id: '6', url: 'https://images.unsplash.com/photo-1559181567-c3190ca9d222?w=800&q=80', title: 'Away Jerseys', category: 'Jerseys' },
  { id: '7', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80', title: 'Store Interior', category: 'Store' },
  { id: '8', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', title: 'Store Front', category: 'Store' },
  { id: '9', url: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80', title: 'Happy Customer', category: 'Customers' },
  { id: '10', url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80', title: 'Fan Photo', category: 'Customers' },
  { id: '11', url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', title: 'Launch Event', category: 'Events' },
  { id: '12', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80', title: 'Jersey Drop Event', category: 'Events' },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { data: apiImages } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => galleryApi.getAll().then((r) => r.data.data),
  });

  const allImages = (apiImages?.length ? apiImages : FALLBACK).map((img: { id: string; url: string; title?: string; category?: string }) => ({
    ...img,
    category: img.category || 'Jerseys',
  }));

  const filtered = activeTab === 'All' ? allImages : allImages.filter((img: { category?: string }) => img.category === activeTab);

  const prev = () => setLightbox((p) => (p! - 1 + filtered.length) % filtered.length);
  const next = () => setLightbox((p) => (p! + 1) % filtered.length);

  return (
    <MainLayout>
      {/* Hero */}
      <div className="gradient-green py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-display text-white mb-2">
            Our <span className="text-brand-gold">Gallery</span>
          </h1>
          <p className="text-white/70">Browse our collection of premium jerseys, store photos and happy customer moments.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === tab ? 'bg-brand-green text-white' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {tab}
              {tab !== 'All' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({allImages.filter((img: { category?: string }) => img.category === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3"
        >
          <AnimatePresence>
            {filtered.map((img: { id: string; url: string; title?: string }, idx: number) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="break-inside-avoid cursor-pointer group rounded-xl overflow-hidden relative"
                onClick={() => setLightbox(idx)}
              >
                <Image
                  src={img.url}
                  alt={img.title || `Gallery ${idx + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/40 transition-colors flex items-center justify-center">
                  <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {img.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium">{img.title}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 z-10">
              <X size={20} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">
              <ChevronLeft size={20} />
            </button>
            <motion.div
              key={lightbox}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-4xl w-full max-h-[80vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightbox].url}
                alt={filtered[lightbox].title || ''}
                width={1200} height={900}
                className="w-full h-full object-contain"
              />
            </motion.div>
            <button onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 text-white/50 text-sm">
              {lightbox + 1} / {filtered.length}
              {filtered[lightbox].title && ` · ${filtered[lightbox].title}`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
