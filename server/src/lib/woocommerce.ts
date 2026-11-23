import type { Product } from '../shared/types.js';

interface WooProduct {
  id: number;
  slug: string;
  name: string;
  price: string;
  regular_price: string;
  short_description: string;
  stock_quantity: number | null;
  average_rating: string;
  categories: { slug: string }[];
  tags: { name: string }[];
}

/** Maps a WooCommerce REST product (wp-json/wc/v3/products) to our Product type. */
export function mapWooProduct(w: WooProduct): Product {
  const price = Number(w.price) || 0;
  const regular = Number(w.regular_price) || 0;
  return {
    id: `woo-${w.id}`,
    slug: w.slug,
    name: w.name,
    category: 'home',
    price,
    compareAtPrice: regular > price ? regular : undefined,
    description: w.short_description.replace(/<[^>]+>/g, '').trim(),
    emoji: '📦',
    hue: (w.id * 37) % 360,
    stock: w.stock_quantity ?? 0,
    rating: Number(w.average_rating) || 0,
    tags: w.tags.map((t) => t.name.toLowerCase()),
  };
}

/** Reads products from a WooCommerce store using read-only REST API keys (kept in .env, never in code). */
export async function fetchWooProducts(baseUrl: string, key: string, secret: string): Promise<Product[]> {
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/wp-json/wc/v3/products?per_page=50`, { headers: { Authorization: `Basic ${auth}` } });
  if (!res.ok) throw new Error(`WooCommerce responded ${res.status}`);
  return ((await res.json()) as WooProduct[]).map(mapWooProduct);
}
