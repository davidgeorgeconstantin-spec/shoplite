'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { CATEGORIES } from '@/data/products';
import { ProductCard } from '@/features/catalog/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const CAT_EMOJI: Record<string, string> = { coffee: '☕', equipment: '⚙️', apparel: '👕', home: '🎁' };

export function HomeSections() {
  const products = useProducts();
  const featured = products.filter((p) => p.rating >= 4.7).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-5">
      <section className="py-16">
        <h2 className="text-3xl font-extrabold">Shop by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORIES.filter((c) => c.id !== 'all').map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.08 }}>
              <Link href="/shop/" className="group flex h-36 flex-col justify-between rounded-3xl bg-slate-100 p-5 transition hover:bg-slate-900 hover:text-white">
                <span className="text-4xl transition group-hover:scale-110">{CAT_EMOJI[c.id]}</span>
                <span className="flex items-center justify-between font-bold">{c.label}<span className="transition group-hover:translate-x-1">→</span></span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-extrabold">Top rated</h2>
          <Link href="/shop/" className="font-semibold text-slate-500 hover:text-slate-900">See all →</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      <motion.section initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="mt-16 grid gap-8 rounded-[2rem] bg-amber-100 p-8 md:grid-cols-3 md:p-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-extrabold">From WooCommerce to headless</h2>
          <p className="mt-3 text-slate-700">
            Products, variations, stock, coupons and orders work like in WooCommerce — but the frontend is a Next.js app.
            The <code>/server</code> folder has an Express API with an optional importer for the WooCommerce REST API.
          </p>
        </div>
        <ul className="space-y-2 text-sm font-semibold">
          {['Variations → size & color', 'Coupons → percent / fixed / free shipping', 'Orders → status workflow', 'Stock → decremented on checkout'].map((t) => <li key={t}>✓ {t}</li>)}
        </ul>
      </motion.section>
    </div>
  );
}
