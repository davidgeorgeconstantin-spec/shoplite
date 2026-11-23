import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PageTransition } from '@/components/layout/PageTransition';
import { Providers } from '@/components/layout/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'ShopLite — demo coffee store', template: '%s · ShopLite' },
  description: 'A demo e-commerce store (learning project): catalog, variants, cart, coupons, simulated checkout and admin. Built with Next.js, Zustand and Motion.',
  icons: { icon: '/shoplite/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        <Providers>
          <DemoBanner />
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
