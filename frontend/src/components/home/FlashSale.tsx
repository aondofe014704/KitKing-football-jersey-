'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Clock } from 'lucide-react';

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { hours, minutes, seconds };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center"
      >
        <span className="text-2xl sm:text-3xl font-display text-white">{pad(value)}</span>
      </motion.div>
      <span className="text-white/60 text-[10px] uppercase tracking-widest mt-1.5">{label}</span>
    </div>
  );
}

export function FlashSale() {
  const [target, setTarget] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const d = new Date();
    d.setHours(d.getHours() + 8);
    setTarget(d);
    setTimeLeft(getTimeLeft(d));
  }, []);

  useEffect(() => {
    if (!target) return;
    const timer = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-red-600 via-red-700 to-rose-800 overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_80%,white,transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 opacity-5 bg-[radial-gradient(circle,white,transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 rounded-full text-white text-sm font-semibold mb-4 border border-white/20">
              <Zap size={14} className="fill-white" />
              FLASH SALE — Limited Time Only
            </div>
            <h2 className="text-4xl sm:text-5xl font-display text-white mb-2">
              Up to <span className="text-yellow-300">40% OFF</span>
            </h2>
            <p className="text-white/70 text-base max-w-sm mx-auto lg:mx-0">
              Selected club and national team jerseys at unbeatable prices. Don't miss out!
            </p>
          </div>

          {/* Timer */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-white/60 text-sm mb-4">
              <Clock size={14} />
              Sale ends in:
            </div>
            <div className="flex items-center gap-3">
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <span className="text-white/50 text-3xl font-display mb-4">:</span>
              <TimeUnit value={timeLeft.minutes} label="Mins" />
              <span className="text-white/50 text-3xl font-display mb-4">:</span>
              <TimeUnit value={timeLeft.seconds} label="Secs" />
            </div>
          </div>

          {/* CTA */}
          <div className="text-center lg:text-right">
            <Link
              href="/shop?sale=true"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 font-bold rounded-2xl text-base hover:bg-yellow-50 transition-colors shadow-lg group"
            >
              Shop the Sale
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-white/50 text-xs mt-3">Free shipping on sale items over ₦30,000</p>
          </div>
        </div>
      </div>
    </section>
  );
}
