'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Stars } from '@/components/ui/Stars';
import { formatMoney } from '@/lib/money';
import type { Product } from '@/types';
import { ProductArt } from './ProductArt';

// React 19: `ref` is a normal prop. AnimatePresence mode="popLayout" needs it to measure the card.
export function ProductCard({ product, index = 0, ref }: { product: Product; index?: number; ref?: React.Ref<HTMLElement> }) {
  const soldOut = product.stock <= 0;
  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), layout: { type: 'spring', stiffness: 300, damping: 30 } }}
      className="group"
    >
      <Link href={`/products/${product.slug}/`} className="block">
        <div className="relative overflow-hidden rounded-3xl">
          <ProductArt emoji={product.emoji} hue={product.hue} className="aspect-square transition duration-500 group-hover:scale-105" />
          <div className="absolute left-3 top-3 flex gap-1.5">
            {product.compareAtPrice && <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">Sale</span>}
            {soldOut && <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">Sold out</span>}
            {!soldOut && product.stock < 10 && <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold">Only {product.stock} left</span>}
          </div>
          <span className="absolute bottom-3 right-3 translate-y-3 rounded-full bg-white px-4 py-2 text-sm font-semibold opacity-0 shadow transition group-hover:translate-y-0 group-hover:opacity-100">
            View →
          </span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <Stars rating={product.rating} />
          </div>
          <p className="text-right font-bold">
            {formatMoney(product.price)}
            {product.compareAtPrice && <span className="block text-xs font-normal text-slate-400 line-through">{formatMoney(product.compareAtPrice)}</span>}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
