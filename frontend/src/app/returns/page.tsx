import { Metadata } from 'next';
import Link from 'next/link';
import { RefreshCw, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

export const metadata: Metadata = { title: 'Returns & Refund Policy' };

const steps = [
  { step: '01', title: 'Contact Us', desc: 'Email or WhatsApp us within 7 days of delivery with your order number and reason for return.', icon: Package },
  { step: '02', title: 'Get Approval', desc: 'Our team reviews your request within 24 hours and provides a return label or pickup arrangement.', icon: CheckCircle },
  { step: '03', title: 'Ship the Item', desc: 'Return the item in its original packaging, unworn and with all tags attached.', icon: RefreshCw },
  { step: '04', title: 'Receive Refund', desc: 'Once we inspect the returned item, your refund is processed within 3-5 business days.', icon: CheckCircle },
];

export default function ReturnsPage() {
  return (
    <MainLayout>
      <div className="gradient-green py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={26} className="text-white" />
          </div>
          <h1 className="text-4xl font-display text-white mb-2">Returns & Refund Policy</h1>
          <p className="text-white/70">Hassle-free returns within 7 days. Your satisfaction is our priority.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Return Process */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-bold text-brand-black mb-6">How to Return</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-brand-green" />
                </div>
                <div className="text-brand-green font-display text-2xl mb-1">{step}</div>
                <h3 className="font-bold text-brand-black text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What can be returned */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
              <CheckCircle size={16} /> Items Eligible for Return
            </h3>
            <ul className="space-y-2 text-green-700 text-sm">
              {['Unworn, unwashed jerseys', 'Items with original tags attached', 'Items in original packaging', 'Orders delivered within 7 days', 'Items that arrived damaged or defective', 'Wrong item received'].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
              <AlertCircle size={16} /> Items NOT Eligible for Return
            </h3>
            <ul className="space-y-2 text-red-700 text-sm">
              {['Worn or washed items', 'Items without original tags', 'Customized/personalized jerseys', 'Sale/discounted items', 'Items returned after 7 days', 'Items without original packaging'].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Refund info */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-bold text-brand-black mb-4">Refund Information</h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund.</p>
            <p>Approved refunds are processed within <strong className="text-brand-black">3-5 business days</strong> to your original payment method (card, bank account, etc.).</p>
            <p>Return shipping costs are covered by KitKing for defective or wrong items. For change-of-mind returns, the customer covers return shipping.</p>
          </div>
        </div>

        <div className="bg-brand-green rounded-2xl p-6 text-center text-white">
          <p className="font-bold text-lg mb-2">Need to start a return?</p>
          <p className="text-white/70 text-sm mb-4">Contact our support team and we'll guide you through the process.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-green font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
