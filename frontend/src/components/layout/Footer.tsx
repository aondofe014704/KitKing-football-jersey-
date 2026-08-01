'use client';

import Link from 'next/link';
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Logo } from './Logo';

const shopLinks = [
  { href: '/shop', label: 'All Jerseys' },
  { href: '/categories/club-jerseys', label: 'Club Jerseys' },
  { href: '/categories/national-teams', label: 'National Teams' },
  { href: '/categories/retro-jerseys', label: 'Retro Jerseys' },
  { href: '/categories/player-version', label: "Player's Version" },
  { href: '/categories/kids', label: "Kids' Jerseys" },
];

const customerLinks = [
  { href: '/track-order', label: 'Track Order' },
  { href: '/dashboard/orders', label: 'My Orders' },
  { href: '/dashboard/wishlist', label: 'My Wishlist' },
  { href: '/faq', label: 'FAQ' },
  { href: '/returns', label: 'Returns & Refunds' },
  { href: '/contact', label: 'Contact Support' },
];

const infoLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/our-store', label: 'Our Store' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Jersey News' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
];

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter/X' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      {/* Newsletter Strip */}
      <div className="bg-brand-green py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">Stay in the Game</h3>
              <p className="text-white/70 text-sm mt-1">
                Get notified about new kits, flash sales, and exclusive drops.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-md gap-3"
            >
              <div className="flex-1 relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50"
                />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-3 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold rounded-xl text-sm transition-colors whitespace-nowrap"
              >
                Subscribe <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo variant="light" size="md" />
            <p className="mt-5 text-gray-400 text-sm leading-relaxed max-w-xs">
              Nigeria's premier destination for authentic football jerseys. Club kits, national
              team jerseys, retro classics and more — delivered to your door.
            </p>
            <div className="mt-6 space-y-3">
              <a
                href="tel:+2348000000000"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                  <Phone size={14} />
                </div>
                +234 800 000 0000
              </a>
              <a
                href="mailto:hello@kitking.ng"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                  <Mail size={14} />
                </div>
                hello@kitking.ng
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} />
                </div>
                123 Sports Avenue, Victoria Island, Lagos, Nigeria
              </div>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-green hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Shop</h4>
            <ul className="space-y-3">
              {shopLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-brand-gold transition-colors hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Customer Care
            </h4>
            <ul className="space-y-3">
              {customerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-brand-gold transition-colors hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Information
            </h4>
            <ul className="space-y-3">
              {infoLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-brand-gold transition-colors hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} KitKing. All rights reserved. Crafted with passion for football.
          </p>
          <div className="flex items-center gap-4">
            {/* Payment icons placeholder */}
            <div className="flex items-center gap-2">
              {['Paystack', 'Flutterwave', 'Bank'].map((method) => (
                <span
                  key={method}
                  className="px-2.5 py-1 bg-white/5 rounded text-[10px] text-gray-500 border border-white/5"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
