'use client'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { localizeContent } from '@/components/i18n/LocalizedContent'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { fireTrackedEvent } from '@/components/analytics/MetaPixel'
import { useInventory } from '@/components/inventory/useInventory'
import { useCartStore } from '@/lib/store/cartStore'
import { variantIdFor } from '@/lib/order-lines'
import { offerButtonText, offerState, type StockCode } from '@/lib/stock'
import type { Product, Variant } from '@/lib/types'

function stockCode(product: Product, variant: Variant): StockCode {
  const id = `${product.id} ${product.slug} ${variant.id}`.toLowerCase()
  return id.includes('evening') ? 'evening' : 'daily'
}

interface AddToCartButtonProps {
  product: Product
  selectedVariant: Variant
}

export default function AddToCartButton({ product, selectedVariant }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false)
  const { addItem, openDrawer } = useCartStore()
  const locale = useLocale()
  const code = stockCode(product, selectedVariant)
  const offer = offerState(useInventory(), {
    daily: code === 'daily' ? 1 : 0,
    evening: code === 'evening' ? 1 : 0,
  })
  const canBuy = selectedVariant.inStock && offer === 'available'
  const buyLocale = locale === 'en' ? 'en' : 'bg'

  const handleAdd = () => {
    if (!canBuy) return
    addItem({
      productId: product.id,
      variantId: selectedVariant.id === 'daily' || selectedVariant.id === 'evening'
        ? variantIdFor([selectedVariant.id])
        : selectedVariant.id,
      name: product.name,
      variantLabel: selectedVariant.label,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      slug: product.slug,
    })
    fireTrackedEvent('AddToCart', {
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
      numItems: 1,
    })
    openDrawer()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return localizeContent(locale, (
    <motion.button
      whileHover={{ scale: 0.97 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleAdd}
      disabled={!canBuy}
      aria-disabled={!canBuy}
      className={`w-full py-4 rounded-xl font-semibold text-base transition-colors ${
        added
          ? 'bg-gold text-onyx'
          : canBuy
          ? 'bg-onyx text-linen hover:bg-iron'
          : 'bg-iron text-stone cursor-not-allowed'
      }`}
    >
      {added ? 'Добавено ✓' : offerButtonText(canBuy ? 'available' : offer === 'coming_soon' ? 'coming_soon' : 'sold_out', buyLocale, 'Добави в количката')}
    </motion.button>
  ))
}
