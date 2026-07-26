import { Metadata } from 'next';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <div className="gradient-green py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display text-white">Privacy Policy</h1>
          <p className="text-white/70 mt-1">Last updated: January 2025</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-card p-8 prose prose-sm max-w-none">
          {[
            { title: '1. Information We Collect', content: 'We collect information you provide directly to us when you create an account, make a purchase, or contact us. This includes your name, email address, phone number, delivery address, and payment information (processed securely by our payment providers).' },
            { title: '2. How We Use Your Information', content: 'We use the information we collect to process your orders, send order confirmations and updates, respond to your comments and questions, send promotional communications (with your consent), and improve our services.' },
            { title: '3. Information Sharing', content: "We do not sell, rent, or share your personal information with third parties for their marketing purposes. We share information with service providers who help us operate our platform (payment processors, delivery companies) and when required by law." },
            { title: '4. Data Security', content: 'We implement industry-standard security measures including SSL encryption, secure payment processing through Paystack and Flutterwave, and restricted access to personal data. However, no method of transmission over the Internet is 100% secure.' },
            { title: '5. Cookies', content: 'We use cookies to enhance your experience, remember your preferences, and analyze site traffic. You can control cookies through your browser settings, though disabling cookies may affect site functionality.' },
            { title: '6. Your Rights', content: 'You have the right to access, correct, or delete your personal information. You can update your account details in your dashboard or contact us to request data deletion. You may opt out of marketing communications at any time.' },
            { title: '7. Contact Us', content: 'If you have any questions about this Privacy Policy, please contact us at privacy@kitking.ng or through our contact page.' },
          ].map(({ title, content }) => (
            <div key={title} className="mb-6">
              <h2 className="text-lg font-bold text-brand-black mb-2">{title}</h2>
              <p className="text-gray-600 leading-relaxed">{content}</p>
            </div>
          ))}
          <div className="border-t pt-4 mt-6">
            <p className="text-sm text-gray-400">
              Questions? <Link href="/contact" className="text-brand-green hover:underline">Contact us</Link> or see our{' '}
              <Link href="/terms" className="text-brand-green hover:underline">Terms & Conditions</Link>.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
