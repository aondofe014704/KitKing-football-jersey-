'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';

const faqs = [
  {
    category: 'Orders & Shipping',
    items: [
      { q: 'How long does delivery take?', a: 'Delivery within Lagos takes 1-2 business days. Other states take 2-5 business days depending on your location.' },
      { q: 'Do you ship to all states in Nigeria?', a: 'Yes! We deliver to all 36 states and the FCT. Shipping fees vary by location and are calculated at checkout.' },
      { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email/SMS. You can also use our Track Order page anytime.' },
      { q: 'Can I change or cancel my order?', a: 'You can cancel or modify your order within 2 hours of placing it. Contact us immediately via WhatsApp or email.' },
    ],
  },
  {
    category: 'Products & Authenticity',
    items: [
      { q: 'Are your jerseys authentic?', a: 'Absolutely. Every jersey we sell is 100% authentic and sourced from authorized suppliers. We never sell replicas or fakes.' },
      { q: "What's the difference between Player's and Fan's version?", a: "Player's version (authentic) is made with match-grade materials, tighter fit, and Dri-FIT technology — exactly what players wear. Fan's version is slightly looser, more comfortable for everyday wear, and more affordable." },
      { q: 'What sizes do you offer?', a: 'We stock XS, S, M, L, XL, XXL, and 3XL for most jerseys. Kids\' jerseys come in ages 3-14 (XS to L in youth sizing).' },
      { q: 'Do you sell retro/vintage jerseys?', a: 'Yes! Our Retro Classics collection features iconic kits from the 1970s through 2010s. Stock is limited so grab yours while available.' },
    ],
  },
  {
    category: 'Payments',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept Paystack (card, bank transfer, USSD), Flutterwave (card, mobile money), and direct bank transfer.' },
      { q: 'Is online payment secure?', a: 'Yes. All transactions are processed through Paystack or Flutterwave, which use 256-bit SSL encryption. We never store your card details.' },
      { q: 'Can I pay on delivery?', a: 'Cash on delivery is available for Lagos orders only for orders under ₦30,000. Select COD at checkout.' },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      { q: 'What is your return policy?', a: 'We offer 7-day returns for unworn, unwashed jerseys in original packaging. Customized/personalized jerseys cannot be returned.' },
      { q: 'How do I return an item?', a: 'Contact us within 7 days of delivery with your order number and reason for return. We\'ll arrange a pickup or give you our return address.' },
      { q: 'When will I get my refund?', a: 'Refunds are processed within 3-5 business days after we receive and inspect the returned item.' },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-brand-black text-sm pr-4">{q}</span>
        <ChevronDown size={16} className={`text-brand-green shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <MainLayout>
      <div className="gradient-green py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-display text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-white/70">Everything you need to know about KitKing and our jerseys.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        {faqs.map(({ category, items }) => (
          <div key={category}>
            <h2 className="text-lg font-bold text-brand-black mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-brand-green rounded-lg flex items-center justify-center text-white text-xs">?</span>
              {category}
            </h2>
            <div className="space-y-2">
              {items.map((item) => <FaqItem key={item.q} {...item} />)}
            </div>
          </div>
        ))}

        <div className="bg-brand-green rounded-2xl p-6 text-center text-white">
          <p className="font-bold text-lg mb-2">Still have questions?</p>
          <p className="text-white/70 text-sm mb-4">Our support team is available 7 days a week to help you.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-green font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
