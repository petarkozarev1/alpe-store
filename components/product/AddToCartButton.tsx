'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { firePixelEvent } from '@/components/analytics/MetaPixel'
import { useCartStore } from '@/lib/store/cartStore'
import type { Product, Variant } from '@/lib/types'

interface AddToCartButtonProps {
  product: Product
  selectedVariant: Variant
}

export default function AddToCartButton({ product, selectedVariant }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false)
  const { addItem, openDrawer } = useCartStore()

  const handleAdd = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      variantLabel: selectedVariant.label,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      slug: product.slug,
    })
    firePixelEvent('AddToCart', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'EUR',
    })
    openDrawer()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.button
      whileHover={{ scale: 0.97 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleAdd}
      disabled={!selectedVariant.inStock}
      aria-disabled={!selectedVariant.inStock}
      className={`w-full py-4 rounded-xl font-semibold text-base transition-colors ${
        added
          ? 'bg-gold text-white'
          : selectedVariant.inStock
          ? 'bg-onyx text-white hover:bg-iron'
          : 'bg-iron text-stone cursor-not-allowed'
      }`}
    >
      {added ? 'Added ✓' : selectedVariant.inStock ? 'Add to Cart' : 'Sold Out'}
    </motion.button>
  )
}
