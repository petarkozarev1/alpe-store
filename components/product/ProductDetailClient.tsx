'use client'
import { useState } from 'react'
import type { Product } from '@/lib/types'
import VariantSelector from './VariantSelector'
import AddToCartButton from './AddToCartButton'

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.find(v => v.inStock)?.id ?? product.variants[0].id
  )

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId)!

  return (
    <div className="flex flex-col gap-6">
      {product.badge && (
        <span className="inline-block bg-brand-black text-white text-xs font-semibold px-3 py-1 rounded-full w-fit">
          {product.badge}
        </span>
      )}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
        <p className="text-brand-muted mt-2">{product.subtitle}</p>
      </div>
      <p className="text-2xl font-bold">${product.price}</p>
      <p className="text-brand-muted text-sm leading-relaxed">{product.description}</p>

      <div>
        <p className="text-sm font-semibold mb-3">Size</p>
        <VariantSelector
          variants={product.variants}
          selected={selectedVariantId}
          onChange={setSelectedVariantId}
        />
      </div>

      <AddToCartButton product={product} selectedVariant={selectedVariant} />
    </div>
  )
}
