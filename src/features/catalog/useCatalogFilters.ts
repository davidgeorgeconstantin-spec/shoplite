'use client';

import { useMemo, useState } from 'react';
import { useDebounced } from '@/hooks/useDebounced';
import type { Product } from '@/types';

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export function useCatalogFilters(products: Product[], initialCategory: string = 'all') {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const q = useDebounced(query.trim().toLowerCase(), 200);

  const results = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (!onlyInStock || p.stock > 0) &&
        (!q || p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)) || p.description.toLowerCase().includes(q)),
    );
    const sorted = [...filtered];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [products, category, onlyInStock, q, sort]);

  return { category, setCategory, query, setQuery, sort, setSort, onlyInStock, setOnlyInStock, results };
}
