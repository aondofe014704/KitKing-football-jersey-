'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});
type FormData = z.infer<typeof schema>;

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+234 800 000 0000', href: 'tel:+2348000000000' },
  { icon: Mail, label: 'Email', value: 'hello@kitking.ng', href: 'mailto:hello@kitking.ng' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+234 800 000 0000', href: 'https://wa.me/2348000000000' },
  { icon: MapPin, label: 'Address', value: '123 Sports Avenue, Victoria Island, Lagos', href: '#' },
];

const hours = [
  { day: 'Monday – Friday', time: '9:00 AM – 7:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 6:00 PM' },
  { day: 'Sunday', time: '12:00 PM – 5:00 PM' },
];

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Contact form:', data);
    toast.success("Message sent! We'll get back to you within 24 hours.", { duration: 5000 });
    reset();
  };

  return (
    <MainLayout>
      {/* Hero */}
      <div className="gradient-green py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-display text-white mb-2">Contact Us</h1>
          <p className="text-white/70">Have a question? We're here to help. Reach out via any channel below.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-brand-black text-lg mb-5">Get in Touch</h2>
              <div className="space-y-4">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <a key={label} href={href} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-green group-hover:text-white transition-colors">
                      <Icon size={16} className="text-brand-green group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-sm font-semibold text-brand-black group-hover:text-brand-green transition-colors">{value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-bold text-brand-black mb-4 flex items-center gap-2">
                <Clock size={16} className="text-brand-green" /> Business Hours
              </h3>
              <div className="space-y-2">
                {hours.map(({ day, time }) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-gray-600">{day}</span>
                    <span className="font-semibold text-brand-black">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps placeholder */}
            <div className="bg-gray-200 rounded-2xl overflow-hidden h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin size={28} className="mx-auto mb-2 text-brand-green" />
                <p className="text-sm font-medium">Google Maps</p>
                <p className="text-xs">123 Sports Avenue, VI Lagos</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-card p-7">
              <h2 className="font-bold text-brand-black text-xl mb-1">Send Us a Message</h2>
              <p className="text-gray-500 text-sm mb-6">We'll respond within 24 hours on business days.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Your Name" placeholder="John Doe" error={errors.name?.message} {...register('name')} required />
                  <Input label="Email Address" type="email" placeholder="email@example.com" error={errors.email?.message} {...register('email')} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Phone (optional)" type="tel" placeholder="+234..." {...register('phone')} />
                  <Input label="Subject" placeholder="Order inquiry, product question..." error={errors.subject?.message} {...register('subject')} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Write your message here..."
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green resize-none transition-colors ${errors.message ? 'border-red-400' : 'border-gray-200'}`}
                    {...register('message')}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                </div>
                <Button type="submit" isLoading={isSubmitting} size="lg" rightIcon={<Send size={15} />}>
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
