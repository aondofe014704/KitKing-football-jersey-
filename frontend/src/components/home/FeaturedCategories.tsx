'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    slug: 'club-jerseys',
    name: 'Club Jerseys',
    description: 'EPL, La Liga, Serie A & more',
    count: '200+ kits',
    emoji: '🏟️',
    color: 'from-blue-600 to-blue-800',
    href: '/categories/club-jerseys',
  },
  {
    slug: 'national-teams',
    name: 'National Teams',
    description: 'African & world national kits',
    count: '50+ nations',
    emoji: '🌍',
    color: 'from-brand-green to-brand-green-dark',
    href: '/categories/national-teams',
  },
  {
    slug: 'retro-jerseys',
    name: 'Retro Classics',
    description: 'Legendary kits from history',
    count: '80+ retros',
    emoji: '🏆',
    color: 'from-amber-600 to-amber-800',
    href: '/categories/retro-jerseys',
  },
  {
    slug: 'player-version',
    name: "Player's Version",
    description: 'Authentic match-grade jerseys',
    count: 'Pro quality',
    emoji: '⚡',
    color: 'from-purple-600 to-purple-800',
    href: '/categories/player-version',
  },
  {
    slug: 'fan-version',
    name: "Fan's Version",
    description: 'Great value supporter kits',
    count: 'Best value',
    emoji: '🎽',
    color: 'from-red-600 to-red-800',
    href: '/categories/fan-version',
  },
  {
    slug: 'kids',
    name: "Kids' Jerseys",
    description: 'Perfect for young fans',
    count: 'Ages 3-14',
    emoji: '👦',
    color: 'from-teal-600 to-teal-800',
    href: '/categories/kids',
  },
  {
    slug: 'training-kits',
    name: 'Training Kits',
    description: 'Train like the pros',
    count: 'Breathable fabrics',
    emoji: '🏃',
    color: 'from-indigo-600 to-indigo-800',
    href: '/categories/training-kits',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    description: 'Shorts, socks & more',
    count: '100+ items',
    emoji: '⚽',
    color: 'from-gray-700 to-gray-900',
    href: '/categories/accessories',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FeaturedCategories() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-brand-green text-sm font-semibold uppercase tracking-wider">Browse by Category</span>
            <h2 className="text-3xl lg:text-4xl font-display text-brand-black mt-1">
              Shop <span className="text-brand-green">Collections</span>
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-green-dark transition-colors group"
          >
            All Categories
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={item}>
              <Link href={cat.href} className="group block">
                <div
                  className={`relative bg-gradient-to-br ${cat.color} rounded-2xl p-5 h-36 sm:h-44 overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl`}
                >
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_70%,white,transparent)]" />

                  <span className="text-4xl sm:text-5xl block mb-3">{cat.emoji}</span>
                  <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-white/70 text-xs mt-1 hidden sm:block">{cat.description}</p>

                  {/* Count badge */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-[10px] font-medium">
                    {cat.count}
                  </div>

                  {/* Arrow */}
                  <div className="absolute bottom-3 right-3 w-7 h-7 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:bg-white/25 transition-colors">
                    <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile All Link */}
        <div className="sm:hidden text-center mt-6">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 border border-brand-green text-brand-green rounded-xl text-sm font-semibold hover:bg-brand-green hover:text-white transition-colors"
          >
            View All Categories <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
