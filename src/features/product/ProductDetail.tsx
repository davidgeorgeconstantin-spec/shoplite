'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Stars } from '@/components/ui/Stars';
import { useCart } from '@/features/cart/cartStore';
import { useFly } from '@/features/cart/flyStore';
import { ProductArt } from '@/features/catalog/ProductArt';
import { ProductCard } from '@/features/catalog/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { formatMoney } from '@/lib/money';
import { variantPrice } from '@/lib/pricing';
import { ColorPicker, SizePicker } from './VariantPicker';

export function ProductDetail({ productId }: { productId: string }) {
  const products = useProducts();
  const product = products.find((p) => p.id === productId)!;
  const [size, setSize] = useState(product.sizes?.[0] ?? '');
  const [color, setColor] = useState(product.colors?.[0]?.name ?? '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const artRef = useRef<HTMLDivElement>(null);
  const add = useCart((s) => s.add);
  const launch = useFly((s) => s.launch);

  const price = variantPrice(product.price, size || undefined);
  const soldOut = product.stock <= 0;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  function handleAdd() {
    add({ productId: product.id, size: size || undefined, color: color || undefined }, qty);
    if (artRef.current) launch(artRef.current, product.emoji, product.hue);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/shop/" className="hover:text-slate-900">Shop</Link> / <span className="capitalize">{product.category}</span> / <span className="text-slate-900">{product.name}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <motion.div ref={artRef} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 20 }}>
          <ProductArt emoji={product.emoji} hue={product.hue} size="lg" className="aspect-square rounded-[2rem]" />
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }} className="flex flex-col gap-6">
          {[
            <div key="title">
              <h1 className="text-4xl font-extrabold tracking-tight">{product.name}</h1>
              <div className="mt-2"><Stars rating={product.rating} /></div>
            </div>,
            <div key="price" className="flex items-baseline gap-3">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={price} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="text-3xl font-bold">
                  {formatMoney(price)}
                </motion.span>
              </AnimatePresence>
              {product.compareAtPrice && !size && <span className="text-slate-400 line-through">{formatMoney(product.compareAtPrice)}</span>}
            </div>,
            <p key="desc" className="text-lg leading-relaxed text-slate-600">{product.description}</p>,
            product.sizes ? <SizePicker key="size" id={product.id} sizes={product.sizes} value={size} onChange={setSize} /> : null,
            product.colors ? <ColorPicker key="color" colors={product.colors} value={color} onChange={setColor} /> : null,
            <div key="buy" className="flex flex-wrap items-center gap-4">
              <QuantityStepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(n, product.stock)))} max={product.stock} />
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={soldOut}
                onClick={handleAdd}
                className="relative h-12 min-w-48 overflow-hidden rounded-full bg-slate-900 px-8 font-semibold text-white disabled:bg-slate-300"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={soldOut ? 'sold' : added ? 'added' : 'add'} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="block">
                    {soldOut ? 'Sold out' : added ? '✓ Added to cart' : 'Add to cart'}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>,
            <p key="stock" className="text-sm text-slate-500">
              {soldOut ? 'Out of stock — check back soon.' : `${product.stock} in stock · Free shipping over 200 RON`}
            </p>,
          ]
            .filter(Boolean)
            .map((node, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                {node}
              </motion.div>
            ))}
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-bold">You may also like</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
