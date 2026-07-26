'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';

const slides = [
  {
    id: 1,
    headline: 'Premium Football',
    highlight: 'Jerseys',
    subheading: 'Authentic club kits, national team jerseys & retro classics. Officially licensed and player-grade quality.',
    cta: { label: 'Shop Now', href: '/shop' },
    secondaryCta: { label: 'Visit Our Store', href: '/our-store' },
    badge: '⚽ New Season Kits Available',
    bg: 'from-brand-green-dark via-brand-green to-brand-green-light',
    accent: 'bg-brand-gold',
  },
  {
    id: 2,
    headline: 'Retro Classics',
    highlight: 'Collection',
    subheading: 'Relive the iconic moments. Our retro jersey collection features legendary kits from football history.',
    cta: { label: 'Shop Retro', href: '/categories/retro-jerseys' },
    secondaryCta: { label: 'View Gallery', href: '/gallery' },
    badge: '🏆 Iconic Kits. Timeless Style.',
    bg: 'from-gray-900 via-gray-800 to-gray-700',
    accent: 'bg-brand-gold',
  },
  {
    id: 3,
    headline: 'National Team',
    highlight: 'Jerseys',
    subheading: 'Represent your nation with pride. Authentic Super Eagles, Bafana Bafana, and all African national team kits.',
    cta: { label: 'Shop National', href: '/categories/national-teams' },
    secondaryCta: { label: 'All Categories', href: '/categories' },
    badge: '🌍 African Nations & Global Teams',
    bg: 'from-brand-green-dark via-[#0A5C38] to-brand-green',
    accent: 'bg-white',
  },
];

const stats = [
  { label: 'Jerseys In Stock', value: '500+' },
  { label: 'Happy Customers', value: '10K+' },
  { label: 'Teams Covered', value: '100+' },
  { label: 'Years in Business', value: '5+' },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className={`relative min-h-[85vh] bg-gradient-to-br ${slide.bg} overflow-hidden transition-all duration-700`}>
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Large jersey silhouette */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 flex items-center justify-end pr-8 pointer-events-none select-none">
        <span className="text-[28rem] leading-none font-display text-white">K</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center min-h-[85vh] py-20">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm font-medium mb-6">
                <span>{slide.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display text-white leading-none mb-4">
                {slide.headline}{' '}
                <span className="text-brand-gold">{slide.highlight}</span>
              </h1>

              {/* Subheading */}
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                {slide.subheading}
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {[
                  { icon: Star, text: '4.9/5 Rating' },
                  { icon: Shield, text: '100% Authentic' },
                  { icon: Truck, text: 'Fast Delivery' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-white/70 text-sm">
                    <Icon size={14} className="text-brand-gold" />
                    {text}
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={slide.cta.href}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold rounded-2xl text-base transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  {slide.cta.label}
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href={slide.secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-base transition-all duration-200 border border-white/20 backdrop-blur-sm"
                >
                  {slide.secondaryCta.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2 mt-12">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'bg-brand-gold w-8 h-2' : 'bg-white/30 w-2 h-2'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center sm:text-left"
            >
              <div className="text-3xl font-display text-brand-gold">{stat.value}</div>
              <div className="text-white/60 text-xs mt-1 uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-gray to-transparent" />
    </section>
  );
}
