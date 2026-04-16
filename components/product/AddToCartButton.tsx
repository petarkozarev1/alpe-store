'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
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
          ? 'bg-green-600 text-white'
          : selectedVariant.inStock
          ? 'bg-brand-black text-white hover:bg-neutral-800'
          : 'bg-brand-gray-light text-brand-muted cursor-not-allowed'
      }`}
    >
      {added ? 'Added ✓' : selectedVariant.inStock ? 'Add to Cart' : 'Sold Out'}
    </motion.button>
  )
}
