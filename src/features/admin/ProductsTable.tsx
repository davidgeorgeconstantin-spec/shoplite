'use client';

import { motion } from 'motion/react';
import { useInventory } from '@/features/catalog/inventoryStore';
import { ProductArt } from '@/features/catalog/ProductArt';
import { useProducts } from '@/hooks/useProducts';
import { cn } from '@/lib/cn';

export function ProductsTable() {
  const products = useProducts();
  const update = useInventory((s) => s.update);
  const reset = useInventory((s) => s.reset);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">Edit price and stock — changes are saved in your browser and shown in the shop instantly.</p>
        <button onClick={reset} className="text-sm font-semibold text-slate-500 hover:text-slate-900">Reset demo data</button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price (RON)</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <motion.tr key={p.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="border-t border-slate-100">
                <td className="flex items-center gap-3 px-4 py-2.5">
                  <ProductArt emoji={p.emoji} hue={p.hue} size="sm" className="h-10 w-10 rounded-lg [&>span]:text-xl" />
                  <span className="font-semibold">{p.name}</span>
                </td>
                <td className="px-4 capitalize text-slate-500">{p.category}</td>
                <td className="px-4">
                  <input type="number" min={1} value={p.price} onChange={(e) => update(p.id, { price: Math.max(1, Number(e.target.value)) })} className="w-24 rounded-lg border border-slate-200 px-2 py-1.5" aria-label={`Price of ${p.name}`} />
                </td>
                <td className="px-4">
                  <input type="number" min={0} value={p.stock} onChange={(e) => update(p.id, { stock: Math.max(0, Number(e.target.value)) })} className="w-20 rounded-lg border border-slate-200 px-2 py-1.5" aria-label={`Stock of ${p.name}`} />
                </td>
                <td className="px-4">
                  <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', p.stock === 0 ? 'bg-rose-100 text-rose-700' : p.stock < 10 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700')}>
                    {p.stock === 0 ? 'Out of stock' : p.stock < 10 ? 'Low stock' : 'In stock'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
