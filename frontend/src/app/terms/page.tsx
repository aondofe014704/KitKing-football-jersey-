import { Metadata } from 'next';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';

export const metadata: Metadata = { title: 'Terms & Conditions' };

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="gradient-green py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display text-white">Terms & Conditions</h1>
          <p className="text-white/70 mt-1">Last updated: January 2025</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-card p-8 prose prose-sm max-w-none">
          {[
            { title: '1. Acceptance of Terms', content: 'By accessing or using KitKing\'s website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.' },
            { title: '2. Products and Pricing', content: 'All prices are displayed in Nigerian Naira (₦). Prices are subject to change without notice. We reserve the right to refuse or cancel orders if pricing errors occur. All products are subject to availability.' },
            { title: '3. Orders and Payment', content: 'By placing an order, you confirm that you are legally entitled to use the payment method. Orders are confirmed only after successful payment verification. We accept payments via Paystack, Flutterwave, and bank transfer.' },
            { title: '4. Delivery', content: 'Delivery timelines are estimates only and not guaranteed. KitKing is not responsible for delays caused by courier companies or circumstances beyond our control. Risk passes to the customer upon delivery.' },
            { title: '5. Returns and Refunds', content: 'Unworn, unwashed items in original packaging may be returned within 7 days of delivery. Customized, personalized, or sale items are non-returnable. Refunds are processed within 3-5 business days of receiving the returned item.' },
            { title: '6. Intellectual Property', content: 'All content on KitKing\'s website including images, text, logos, and brand materials are protected by copyright. You may not reproduce or use our content without prior written permission.' },
            { title: '7. Limitation of Liability', content: 'KitKing\'s liability is limited to the value of goods purchased. We are not liable for indirect, incidental, or consequential damages arising from your use of our services.' },
            { title: '8. Changes to Terms', content: 'We reserve the right to modify these terms at any time. Changes are effective immediately upon posting. Continued use of our services constitutes acceptance of updated terms.' },
          ].map(({ title, content }) => (
            <div key={title} className="mb-6">
              <h2 className="text-lg font-bold text-brand-black mb-2">{title}</h2>
              <p className="text-gray-600 leading-relaxed">{content}</p>
            </div>
          ))}
          <div className="border-t pt-4 mt-6">
            <p className="text-sm text-gray-400">
              Questions? <Link href="/contact" className="text-brand-green hover:underline">Contact us</Link> or see our{' '}
              <Link href="/privacy-policy" className="text-brand-green hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
