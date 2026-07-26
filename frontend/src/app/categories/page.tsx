import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

export const metadata: Metadata = { title: 'Categories' };

const categories = [
  { slug: 'club-jerseys', name: 'Club Jerseys', desc: 'EPL, La Liga, Serie A, Bundesliga, Ligue 1 & more', emoji: '🏟️', count: '200+ kits', color: 'from-blue-600 to-blue-800' },
  { slug: 'national-teams', name: 'National Teams', desc: 'Super Eagles, Bafana Bafana, Black Stars & world teams', emoji: '🌍', count: '50+ nations', color: 'from-brand-green to-brand-green-dark' },
  { slug: 'retro-jerseys', name: 'Retro Classics', desc: "Iconic kits from football's greatest eras", emoji: '🏆', count: '80+ retros', color: 'from-amber-600 to-amber-800' },
  { slug: 'player-version', name: "Player's Version", desc: 'Authentic match-grade jerseys — exactly what players wear', emoji: '⚡', count: 'Match quality', color: 'from-purple-600 to-purple-800' },
  { slug: 'fan-version', name: "Fan's Version", desc: 'Great value supporter kits for everyday wear', emoji: '🎽', count: 'Best value', color: 'from-red-600 to-red-800' },
  { slug: 'kids', name: "Kids' Jerseys", desc: "Premium kits for young football fans aged 3–14", emoji: '👦', count: 'Ages 3–14', color: 'from-teal-600 to-teal-800' },
  { slug: 'training-kits', name: 'Training Kits', desc: 'Breathable training jerseys used by the pros', emoji: '🏃', count: 'Lightweight', color: 'from-indigo-600 to-indigo-800' },
  { slug: 'accessories', name: 'Accessories', desc: 'Shorts, socks, balls, boots & football accessories', emoji: '⚽', count: '100+ items', color: 'from-gray-700 to-gray-900' },
];

export default function CategoriesPage() {
  return (
    <MainLayout>
      <div className="gradient-green py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-display text-white mb-2">
            Shop by <span className="text-brand-gold">Category</span>
          </h1>
          <p className="text-white/70">Browse our complete range of authentic football jerseys and merchandise.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="group">
              <div className={`bg-gradient-to-br ${cat.color} rounded-2xl p-6 relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl h-48`}>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_70%,white,transparent)]" />
                <span className="text-5xl block mb-3">{cat.emoji}</span>
                <h3 className="text-white font-bold text-lg leading-tight">{cat.name}</h3>
                <p className="text-white/70 text-xs mt-1">{cat.desc}</p>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1 text-white text-xs">
                  {cat.count} <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse all CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">Can't find what you're looking for?</p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-white rounded-2xl font-bold text-base hover:bg-brand-green-light transition-colors shadow-lg">
            Browse All Jerseys <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
