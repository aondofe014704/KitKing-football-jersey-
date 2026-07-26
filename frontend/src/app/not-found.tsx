'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-gray flex flex-col">
      <header className="bg-white border-b py-4 px-6">
        <Logo />
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="text-[10rem] font-display text-brand-green leading-none mb-2"
          >
            404
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-2xl font-bold text-brand-black mb-2">Page Not Found</h1>
            <p className="text-gray-500 mb-8">
              Looks like this jersey is out of stock — or the page doesn't exist. Let's get you back on the pitch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-green text-white rounded-xl font-semibold text-sm hover:bg-brand-green-light transition-colors">
                <Home size={15} /> Go Home
              </Link>
              <Link href="/shop" className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-green text-brand-green rounded-xl font-semibold text-sm hover:bg-brand-green hover:text-white transition-colors">
                <ShoppingBag size={15} /> Shop Jerseys
              </Link>
              <Link href="/shop" className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors">
                <Search size={15} /> Search
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
