import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Eye, Heart, Award, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

export const metadata: Metadata = { title: 'About Us' };

const values = [
  { icon: ShieldCheck, title: 'Authenticity', desc: 'Every jersey we sell is 100% authentic. We partner directly with authorized suppliers and distributors.' },
  { icon: Users, title: 'Community', desc: 'We\'re more than a store — we\'re a community of football fans passionate about the beautiful game.' },
  { icon: Heart, title: 'Passion', desc: 'Football runs through our veins. We understand what it means to wear your club\'s colours with pride.' },
  { icon: Award, title: 'Excellence', desc: 'From product quality to customer service, we hold ourselves to the highest standards in everything we do.' },
];

const team = [
  { name: 'Emeka Okonkwo', role: 'Founder & CEO', initials: 'EO', color: 'bg-brand-green' },
  { name: 'Adaeze Williams', role: 'Head of Operations', initials: 'AW', color: 'bg-blue-600' },
  { name: 'Tunde Afolabi', role: 'Customer Experience', initials: 'TA', color: 'bg-purple-600' },
  { name: 'Ngozi Eze', role: 'Marketing Manager', initials: 'NE', color: 'bg-amber-600' },
];

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero */}
      <div className="gradient-green py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_80%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-4 py-1.5 bg-white/15 rounded-full text-white/80 text-sm font-medium mb-4">
            Our Story
          </span>
          <h1 className="text-5xl font-display text-white mb-4">
            Passion for <span className="text-brand-gold">Football,</span><br />Commitment to Quality
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            KitKing was born from a simple idea — every football fan deserves access to authentic, premium jerseys without compromise.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-brand-green text-sm font-semibold uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl lg:text-4xl font-display text-brand-black mt-1 mb-5">
                From a Small Shop to<br />Nigeria's Premier Jersey Store
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  KitKing started in 2019 as a small physical store on Sports Avenue, Lagos. Our founder, a lifelong football fan, was frustrated by the flood of fake jerseys in the Nigerian market and decided to do something about it.
                </p>
                <p>
                  We began with a simple promise: only authentic jerseys. No replicas, no fakes. Within months, word spread. Football fans across Lagos and beyond were coming to us not just for jerseys, but for the experience of getting something real.
                </p>
                <p>
                  Today, KitKing serves over 10,000 customers across all 36 states in Nigeria. We stock over 500 jersey styles from clubs and national teams worldwide, and we've built one of the most trusted names in Nigerian football merchandise.
                </p>
              </div>
              <Link href="/shop" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-brand-green text-white rounded-xl font-semibold text-sm hover:bg-brand-green-light transition-colors">
                Shop Our Collection <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '2019', label: 'Founded' },
                { value: '10K+', label: 'Happy Customers' },
                { value: '500+', label: 'Jersey Styles' },
                { value: '36', label: 'States We Deliver To' },
              ].map((stat) => (
                <div key={stat.label} className="bg-brand-gray rounded-2xl p-6 text-center">
                  <div className="text-4xl font-display text-brand-green mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center mb-4">
                <Target size={24} className="text-brand-green" />
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide Nigerian football fans with easy access to authentic, high-quality football jerseys at competitive prices, backed by excellent customer service and reliable nationwide delivery.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center mb-4">
                <Eye size={24} className="text-brand-gold" />
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become Africa's most trusted football merchandise brand — a place where every fan across the continent can find their club, their national team, and their football identity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-green text-sm font-semibold uppercase tracking-wider">What We Stand For</span>
            <h2 className="text-3xl lg:text-4xl font-display text-brand-black mt-1">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-brand-gray rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-brand-green" />
                </div>
                <h3 className="font-bold text-brand-black mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-brand-green text-sm font-semibold uppercase tracking-wider">The People Behind KitKing</span>
            <h2 className="text-3xl font-display text-brand-black mt-1">Meet the Team</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-5 text-center shadow-card">
                <div className={`w-16 h-16 ${member.color} rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3`}>
                  {member.initials}
                </div>
                <h3 className="font-bold text-brand-black text-sm">{member.name}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
