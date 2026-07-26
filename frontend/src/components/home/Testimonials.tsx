'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Chukwuemeka Obi',
    role: 'Arsenal Fan',
    location: 'Lagos',
    rating: 5,
    text: "Ordered the Arsenal home kit and it arrived in 2 days! The quality is exactly what I expected from a player version. KitKing is now my go-to for all football jerseys.",
    avatar: 'CO',
    color: 'bg-red-500',
  },
  {
    id: 2,
    name: 'Adaeze Nwosu',
    role: 'Chelsea Fan',
    location: 'Abuja',
    rating: 5,
    text: "I was skeptical about buying jerseys online but KitKing exceeded my expectations. The Chelsea kit looks and feels amazing. Will definitely order again for my kids too!",
    avatar: 'AN',
    color: 'bg-blue-600',
  },
  {
    id: 3,
    name: 'Tunde Bakare',
    role: 'Super Eagles Fan',
    location: 'Port Harcourt',
    rating: 5,
    text: "Got the Super Eagles jersey for AFCON and I'm so proud. Customer service was top-notch and helped me with sizing. The jersey arrived perfectly packaged.",
    avatar: 'TB',
    color: 'bg-brand-green',
  },
  {
    id: 4,
    name: 'Ngozi Eze',
    role: 'Real Madrid Fan',
    location: 'Enugu',
    rating: 5,
    text: "The retro Real Madrid jersey I ordered is absolutely stunning. Exactly as pictured and the stitching quality is excellent. Fast shipping to Enugu — very impressed!",
    avatar: 'NE',
    color: 'bg-purple-600',
  },
  {
    id: 5,
    name: 'Samuel Afolabi',
    role: 'Man City Fan',
    location: 'Ibadan',
    rating: 5,
    text: "KitKing offers the best prices I've found in Nigeria for authentic jerseys. The Man City away kit is perfect. Delivery was fast and the packaging was premium.",
    avatar: 'SA',
    color: 'bg-sky-500',
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const visible = [
    testimonials[current % testimonials.length],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-green text-sm font-semibold uppercase tracking-wider">Customer Reviews</span>
          <h2 className="text-3xl lg:text-4xl font-display text-brand-black mt-1">
            What Our <span className="text-brand-green">Fans Say</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} className="fill-brand-gold text-brand-gold" />
            ))}
            <span className="text-gray-600 text-sm ml-2">4.9 out of 5 from 1,200+ reviews</span>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {visible.map((t, i) => (
                <motion.div
                  key={`${t.id}-${current}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-brand-gray rounded-2xl p-6 relative ${i === 1 ? 'md:scale-105 md:shadow-lg border border-brand-green/20' : ''}`}
                >
                  <Quote size={32} className="text-brand-green/20 mb-4" />

                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="fill-brand-gold text-brand-gold" />
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>

                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-brand-black text-sm">{t.name}</div>
                      <div className="text-gray-400 text-xs">
                        {t.role} · {t.location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-green hover:text-brand-green transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all ${i === current ? 'bg-brand-green w-6 h-2' : 'bg-gray-200 w-2 h-2'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrent((p) => (p + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-green hover:text-brand-green transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
