'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { fireTrackedEvent } from '@/components/analytics/MetaPixel'
import type { Product } from '@/lib/types'
import AddToCartButton from './AddToCartButton'

export default function ProductDetailClient({ product }: { product: Product }) {
  const selectedVariant = product.variants.find((variant) => variant.inStock) ?? product.variants[0]

  useEffect(() => {
    fireTrackedEvent('ViewContent', {
      data: {
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'EUR',
      },
      value: product.price,
      currency: 'EUR',
      contentIds: [product.id],
    })
  }, [product.id, product.name, product.price])

  return (
    <div className="flex flex-col gap-6">
      {product.badge && (
        <span className="inline-block bg-onyx text-linen text-xs font-semibold px-3 py-1 rounded-full w-fit">
          {product.badge}
        </span>
      )}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
        <p className="text-stone mt-2">{product.subtitle}</p>
      </div>
      <p className="text-2xl font-bold">€{product.price.toFixed(2)}</p>

      {/* Cert trust strip */}
      <div className="flex items-center justify-between py-3 border-y border-iron/10 gap-4">
        <span className="font-sans text-xs text-stone/70">
          {product.facts.map((fact, index) => (
            <span key={fact}>
              {index > 0 && <span aria-hidden="true"> &nbsp;·&nbsp; </span>}
              ✓ {fact}
            </span>
          ))}
        </span>
        <Link href="/certifications" className="font-sans text-xs text-gold hover:underline underline-offset-2 decoration-gold/50 flex-shrink-0">
          Виж сертификата →
        </Link>
      </div>

      <p className="text-stone text-sm leading-relaxed">{product.description}</p>

      <AddToCartButton product={product} selectedVariant={selectedVariant} />
    </div>
  )
}
