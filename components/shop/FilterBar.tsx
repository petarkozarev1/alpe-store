'use client'

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

interface FilterBarProps {
  sort: SortOption
  onSortChange: (sort: SortOption) => void
}

export default function FilterBar({ sort, onSortChange }: FilterBarProps) {
  return (
    <div className="flex items-center justify-between mb-10 pb-5 border-b border-brand-border">
      <p className="text-sm text-brand-muted">All Products</p>
      <select
        value={sort}
        onChange={e => onSortChange(e.target.value as SortOption)}
        aria-label="Sort products"
        className="text-sm border border-brand-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-brand-black"
      >
        <option value="name-asc">Name: A–Z</option>
        <option value="name-desc">Name: Z–A</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  )
}
