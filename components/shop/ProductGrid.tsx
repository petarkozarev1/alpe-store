'use client'
import { useState, useMemo } from 'react'
import ProductCard from './ProductCard'
import FilterBar, { type SortOption } from './FilterBar'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [sort, setSort] = useState<SortOption>('name-asc')

  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sort === 'name-asc') return a.name.localeCompare(b.name)
      if (sort === 'name-desc') return b.name.localeCompare(a.name)
      if (sort === 'price-asc') return a.price - b.price
      return b.price - a.price
    })
  }, [products, sort])

  return (
    <div>
      <FilterBar sort={sort} onSortChange={setSort} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sorted.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
