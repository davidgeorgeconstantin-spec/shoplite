'use client';

import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { CATEGORIES } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import { cn } from '@/lib/cn';
import { ProductCard } from './ProductCard';
import { type SortKey, useCatalogFilters } from './useCatalogFilters';

export function Catalog() {
  const products = useProducts();
  const f = useCatalogFilters(products);

  return (
    <section>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <LayoutGroup id="categories">
          <div role="tablist" aria-label="Categories" className="flex flex-wrap gap-1 rounded-full bg-slate-100 p-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={f.category === c.id}
                onClick={() => f.setCategory(c.id)}
                className={cn('relative rounded-full px-4 py-2 text-sm font-semibold transition', f.category === c.id ? 'text-white' : 'text-slate-600 hover:text-slate-900')}
              >
                {f.category === c.id && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-slate-900" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className="relative">{c.label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={f.query}
            onChange={(e) => f.setQuery(e.target.value)}
            placeholder="Search coffee, gifts…"
            aria-label="Search products"
            className="w-56 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:w-64 focus:border-slate-900"
          />
          <select value={f.sort} onChange={(e) => f.setSort(e.target.value as SortKey)} aria-label="Sort" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low → high</option>
            <option value="price-desc">Price: high → low</option>
            <option value="rating">Top rated</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.onlyInStock} onChange={(e) => f.setOnlyInStock(e.target.checked)} className="accent-slate-900" /> In stock
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-500">{f.results.length} products</p>
      <motion.div layout className="mt-3 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {f.results.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
      {f.results.length === 0 && <p className="py-20 text-center text-slate-500">No products match your filters.</p>}
    </section>
  );
}
