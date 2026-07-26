import { Metadata } from 'next';
import { MapPin, Phone, Clock, MessageCircle, Car, Navigation } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

export const metadata: Metadata = { title: 'Our Store' };

const hours = [
  { day: 'Monday – Friday', time: '9:00 AM – 7:00 PM', open: true },
  { day: 'Saturday', time: '10:00 AM – 6:00 PM', open: true },
  { day: 'Sunday', time: '12:00 PM – 5:00 PM', open: true },
  { day: 'Public Holidays', time: '11:00 AM – 4:00 PM', open: true },
];

const storeImages = [
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', alt: 'Store front' },
  { src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', alt: 'Jersey display' },
  { src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80', alt: 'Store interior' },
  { src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80', alt: 'Product shelves' },
];

export default function OurStorePage() {
  return (
    <MainLayout>
      {/* Hero */}
      <div className="gradient-green py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-display text-white mb-2">
            Visit Our <span className="text-brand-gold">Store</span>
          </h1>
          <p className="text-white/70">Come in, try on your favourite jersey, and experience the KitKing difference in person.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Info */}
          <div className="space-y-6">
            {/* Address card */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-brand-black text-xl mb-5 flex items-center gap-2">
                <MapPin className="text-brand-green" size={20} /> Store Location
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-brand-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-black">KitKing Flagship Store</p>
                    <p className="text-gray-500 text-sm mt-0.5">123 Sports Avenue<br />Victoria Island, Lagos<br />Nigeria</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-brand-green" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Store Phone</p>
                    <a href="tel:+2348000000000" className="font-semibold text-brand-black hover:text-brand-green transition-colors">
                      +234 800 000 0000
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">WhatsApp</p>
                    <a href="https://wa.me/2348000000000" className="font-semibold text-brand-black hover:text-green-600 transition-colors">
                      Chat With Us
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green-light transition-colors">
                  <Navigation size={14} /> Get Directions
                </a>
                <a href="https://wa.me/2348000000000"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-bold text-brand-black mb-4 flex items-center gap-2">
                <Clock size={16} className="text-brand-green" /> Opening Hours
              </h3>
              <div className="space-y-3">
                {hours.map(({ day, time }) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-600">{day}</span>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span className="text-sm font-semibold text-brand-black">{time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Getting here */}
            <div className="bg-brand-gray rounded-2xl p-5">
              <h3 className="font-bold text-brand-black mb-3 flex items-center gap-2">
                <Car size={16} className="text-brand-green" /> How to Find Us
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>🚗 <strong>By Car:</strong> Turn off Ozumba Mbadiwe Ave onto Sports Avenue. We're on the right, look for the green KitKing sign.</p>
                <p>🚌 <strong>By Bus:</strong> Take any bus to Victoria Island. Drop at Eko Hotel bus stop, then a 5-minute walk.</p>
                <p>🛵 <strong>By Bolt/Uber:</strong> Search "KitKing, Sports Avenue, Victoria Island" — we show on the map.</p>
              </div>
            </div>
          </div>

          {/* Right: Map + Photos */}
          <div className="space-y-5">
            {/* Map placeholder */}
            <div className="h-64 bg-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="text-brand-green mx-auto mb-2" />
                <p className="font-semibold text-gray-600">Interactive Map</p>
                <p className="text-sm text-gray-400">123 Sports Avenue, VI Lagos</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-brand-green hover:underline">
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Store Photos */}
            <div>
              <h3 className="font-bold text-brand-black mb-3">Store Gallery</h3>
              <div className="grid grid-cols-2 gap-3">
                {storeImages.map((img, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
