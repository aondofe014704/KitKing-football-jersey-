'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Heart, MapPin, User, Lock, LogOut, ChevronRight
} from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'My Orders', icon: Package },
  { href: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/dashboard/addresses', label: 'Addresses', icon: MapPin },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/password', label: 'Change Password', icon: Lock },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login?redirect=/dashboard');
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    clearAuth();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm font-semibold text-brand-black">{user?.firstName} {user?.lastName}</p>
            </div>
            <div className="w-9 h-9 bg-brand-green rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-gray-400 mb-5">
          <Link href="/" className="hover:text-brand-green">Home</Link>
          <ChevronRight size={13} />
          <span className="text-brand-black font-medium">My Account</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              {/* User info */}
              <div className="p-5 bg-gradient-to-br from-brand-green to-brand-green-light text-white">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <p className="font-bold">{user?.firstName} {user?.lastName}</p>
                <p className="text-white/70 text-xs mt-0.5">{user?.email}</p>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5',
                        active
                          ? 'bg-brand-green/10 text-brand-green'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-brand-black'
                      )}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full mt-1 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
