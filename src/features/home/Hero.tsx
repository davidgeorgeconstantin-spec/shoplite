'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ProductArt } from '@/features/catalog/ProductArt';
import { PRODUCTS } from '@/data/products';

const FLOATING = [PRODUCTS[0]!, PRODUCTS[5]!, PRODUCTS[10]!];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]); // parallax for the art column
  const words = 'Good coffee, delivered to your door.'.split(' ');

  return (
    <section ref={ref} className="relative overflow-hidden bg-slate-950 text-white">
      <div aria-hidden="true" className="absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-amber-500/30 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">Demo coffee store</p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            {words.map((w, i) => (
              <motion.span key={i} className="mr-[0.25em] inline-block" initial={{ opacity: 0, y: 40, rotateX: -60 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.1 + i * 0.07, type: 'spring', stiffness: 200, damping: 20 }}>
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 max-w-md text-lg text-slate-300">
            A full e-commerce flow built from scratch: catalog, variants, cart, coupons, checkout and admin — the WooCommerce concepts, rebuilt in React.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mt-8 flex gap-3">
            <Link href="/shop/" className="rounded-full bg-amber-400 px-7 py-3.5 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300">Shop now</Link>
            <Link href="/admin/" className="rounded-full border border-white/20 px-7 py-3.5 font-semibold transition hover:bg-white/10">Open admin</Link>
          </motion.div>
        </div>
        <motion.div style={{ y }} className="relative h-80 sm:h-96">
          {FLOATING.map((p, i) => (
            <motion.div
              key={p.id}
              className="absolute"
              style={{ left: ['5%', '45%', '22%'][i], top: ['5%', '18%', '52%'][i] }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
              transition={{ opacity: { delay: 0.3 + i * 0.15 }, scale: { delay: 0.3 + i * 0.15, type: 'spring' }, y: { repeat: Infinity, duration: 4 + i, ease: 'easeInOut' } }}
            >
              <ProductArt emoji={p.emoji} hue={p.hue} className={`rounded-[2rem] shadow-2xl ${i === 1 ? 'h-52 w-52' : 'h-40 w-40'}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Marquee />
    </section>
  );
}

function Marquee() {
  const items = ['Free shipping over 200 RON', 'Freshly roasted (demo)', 'Coupons: WELCOME10', 'Simulated checkout', 'Built with Next.js'];
  return (
    <div className="overflow-hidden border-t border-white/10 py-4">
      <motion.div className="flex w-max gap-12 whitespace-nowrap text-sm font-semibold text-slate-400" animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}>
        {[...items, ...items].map((t, i) => <span key={i}>◆ {t}</span>)}
      </motion.div>
    </div>
  );
}
