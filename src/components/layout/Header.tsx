'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { CartButton } from '@/features/cart/CartButton';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/shop/', label: 'Shop' },
  { href: '/admin/', label: 'Admin' },
];

export function Header() {
  const pathname = usePathname();
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, '')));

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-amber-400">◆</span> ShopLite
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={cn('relative rounded-full px-3 py-2 text-sm font-semibold sm:px-4', active(n.href) ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900')}>
              {active(n.href) && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-slate-100" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
              <span className="relative">{n.label}</span>
            </Link>
          ))}
          <span className="ml-2"><CartButton /></span>
        </nav>
      </div>
    </header>
  );
}
