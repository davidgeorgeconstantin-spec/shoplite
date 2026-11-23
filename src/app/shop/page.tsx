import type { Metadata } from 'next';
import { Catalog } from '@/features/catalog/Catalog';

export const metadata: Metadata = { title: 'Shop' };

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight">Shop</h1>
      <Catalog />
    </div>
  );
}
