import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'KitKing — Premium Football Jerseys Nigeria',
    template: '%s | KitKing',
  },
  description:
    "Nigeria's #1 destination for authentic football jerseys. Club kits, national team jerseys, retro classics and player-version jerseys. Fast delivery nationwide.",
  keywords: [
    'football jerseys Nigeria',
    'authentic football jerseys',
    'Premier League jerseys',
    'Super Eagles jersey',
    'retro football kits',
    'buy jersey online Nigeria',
  ],
  authors: [{ name: 'KitKing' }],
  creator: 'KitKing',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://kitking.ng',
    siteName: 'KitKing',
    title: 'KitKing — Premium Football Jerseys Nigeria',
    description: "Nigeria's #1 destination for authentic football jerseys.",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'KitKing Football Jerseys' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KitKing — Premium Football Jerseys',
    description: "Nigeria's #1 destination for authentic football jerseys.",
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A4A2F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
