'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Tag, CreditCard, Truck, Globe, Store, HeadphonesIcon, Award } from 'lucide-react';

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Premium Quality',
    description: 'Every jersey is sourced from authorized suppliers. We guarantee authenticity on every item we sell.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Tag,
    title: 'Competitive Prices',
    description: 'Get the best prices on authentic football jerseys without compromising on quality.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Pay securely via Paystack, Flutterwave, or bank transfer. Your transactions are fully protected.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Orders processed within 24 hours. Delivery to all states within 2-5 business days.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Globe,
    title: 'Nationwide Shipping',
    description: 'We ship to all 36 states in Nigeria. Affordable and reliable delivery partners.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: Store,
    title: 'Physical Store',
    description: 'Visit our store in Lagos to see, feel, and try on jerseys before buying.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Support',
    description: 'Our passionate football fans team is available 7 days a week via WhatsApp, call, or chat.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: Award,
    title: '100% Authentic',
    description: 'We never sell replicas or counterfeits. Every jersey comes with an authenticity guarantee.',
    color: 'bg-brand-green/10 text-brand-green',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-green text-sm font-semibold uppercase tracking-wider">Why KitKing</span>
          <h2 className="text-3xl lg:text-4xl font-display text-brand-black mt-1 mb-3">
            The #1 Choice for Football Fans
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            We're not just a jersey store — we're a community of football fans dedicated to bringing you the best kits from around the world.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                variants={item}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow group"
              >
                <div className={`w-12 h-12 rounded-xl ${reason.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-brand-black mb-2">{reason.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{reason.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
