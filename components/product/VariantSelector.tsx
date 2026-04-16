'use client'
import type { Variant } from '@/lib/types'

interface VariantSelectorProps {
  variants: Variant[]
  selected: string
  onChange: (variantId: string) => void
}

export default function VariantSelector({ variants, selected, onChange }: VariantSelectorProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      {variants.map(variant => (
        <button
          key={variant.id}
          onClick={() => variant.inStock && onChange(variant.id)}
          disabled={!variant.inStock}
          aria-pressed={selected === variant.id}
          className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
            selected === variant.id
              ? 'bg-brand-black text-white border-brand-black'
              : variant.inStock
              ? 'bg-white text-brand-black border-brand-border hover:border-brand-black'
              : 'bg-brand-gray-light text-brand-muted border-brand-border cursor-not-allowed line-through'
          }`}
        >
          {variant.label}
          {!variant.inStock && ' — Sold Out'}
        </button>
      ))}
    </div>
  )
}
