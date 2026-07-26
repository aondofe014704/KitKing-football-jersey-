'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ArrowRight } from 'lucide-react';

const galleryImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80', title: 'Match Day Kit', span: 'col-span-1 row-span-2' },
  { id: '2', url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80', title: 'Club Collection', span: 'col-span-1 row-span-1' },
  { id: '3', url: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0d?w=600&q=80', title: 'National Team', span: 'col-span-1 row-span-1' },
  { id: '4', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80', title: 'Retro Classic', span: 'col-span-2 row-span-1' },
  { id: '5', url: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=600&q=80', title: 'Premium Kit', span: 'col-span-1 row-span-1' },
  { id: '6', url: 'https://images.unsplash.com/photo-1559181567-c3190ca9d222?w=600&q=80', title: 'Away Jersey', span: 'col-span-1 row-span-1' },
];

export function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox((p) => (p! - 1 + galleryImages.length) % galleryImages.length);
  const next = () => setLightbox((p) => (p! + 1) % galleryImages.length);

  return (
    <section className="py-16 lg:py-20 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-brand-green text-sm font-semibold uppercase tracking-wider">Our Gallery</span>
            <h2 className="text-3xl lg:text-4xl font-display text-brand-black mt-1">
              The <span className="text-brand-green">Beautiful Game</span>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-green-dark group"
          >
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[480px]">
          {galleryImages.map((img, idx) => (
            <motion.div
              key={img.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${img.span}`}
              onClick={() => setLightbox(idx)}
            >
              <Image
                src={img.url}
                alt={img.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/40 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium">{img.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <motion.div
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[lightbox].url}
                alt={galleryImages[lightbox].title}
                fill
                className="object-cover"
                sizes="80vw"
              />
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightbox + 1} / {galleryImages.length} · {galleryImages[lightbox].title}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
