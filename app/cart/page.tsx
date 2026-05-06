'use client'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-content mx-auto px-6 md:px-10 py-32 flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold">Количката е празна</h1>
        <Link href="/shop" className="text-stone underline hover:text-onyx">
          Продължи пазаруването
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-content mx-auto px-6 md:px-10 py-16">
      <h1 className="text-3xl font-bold mb-10">Количка</h1>
      <div className="flex flex-col gap-5 mb-8">
        {items.map(item => (
          <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-6 py-5 border-b border-iron">
            <div className="font-semibold flex-1">{item.name} — {item.variantLabel}</div>
            <div className="flex items-center border border-iron rounded-lg overflow-hidden" role="group" aria-label="Quantity">
              <button
                className="w-8 h-8 flex items-center justify-center hover:bg-iron"
                aria-label="Decrease quantity"
                onClick={() => item.quantity > 1 ? updateQuantity(item.productId, item.variantId, item.quantity - 1) : removeItem(item.productId, item.variantId)}
              >−</button>
              <span className="w-10 text-center" aria-live="polite">{item.quantity}</span>
              <button
                className="w-8 h-8 flex items-center justify-center hover:bg-iron"
                aria-label="Increase quantity"
                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
              >+</button>
            </div>
            <div className="font-semibold w-20 text-right">€{(item.price * item.quantity).toFixed(2)}</div>
            <button
              onClick={() => removeItem(item.productId, item.variantId)}
              aria-label={`Remove ${item.name}`}
              className="text-stone hover:text-onyx text-xl"
            >×</button>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4">
        <span className="text-xl font-bold">Общо: €{getSubtotal().toFixed(2)}</span>
        <Link href="/checkout" className="bg-onyx text-linen px-8 py-4 rounded-xl font-semibold hover:bg-iron transition-colors">
          Към плащане →
        </Link>
      </div>
    </div>
  )
}
