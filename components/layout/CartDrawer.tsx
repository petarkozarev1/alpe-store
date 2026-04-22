'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store/cartStore'

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, getSubtotal } = useCartStore()

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-onyx/60 z-40"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-parchment z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-iron">
              <h2 className="font-bold text-lg">Cart ({items.reduce((s, i) => s + i.quantity, 0)})</h2>
              <button
                onClick={closeDrawer}
                aria-label="Close cart"
                className="text-stone hover:text-onyx transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-stone">
                  <p>Your cart is empty.</p>
                  <button onClick={closeDrawer} className="text-onyx underline text-sm">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-linen flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-stone text-xs">{item.variantLabel}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* Qty controls */}
                        <div className="flex items-center border border-iron rounded-lg overflow-hidden" role="group" aria-label="Quantity">
                          <button
                            className="w-8 h-8 flex items-center justify-center text-sm hover:bg-iron"
                            aria-label="Decrease quantity"
                            onClick={() => item.quantity > 1
                              ? updateQuantity(item.productId, item.variantId, item.quantity - 1)
                              : removeItem(item.productId, item.variantId)
                            }
                          >−</button>
                          <span className="w-8 text-center text-sm" aria-live="polite">{item.quantity}</span>
                          <button
                            className="w-8 h-8 flex items-center justify-center text-sm hover:bg-iron"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          >+</button>
                        </div>
                        <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="text-stone hover:text-onyx transition-colors self-start text-lg leading-none mt-0.5"
                    >×</button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-iron flex flex-col gap-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full bg-onyx text-linen text-center py-4 rounded-xl font-semibold hover:bg-iron transition-colors"
                >
                  Checkout →
                </Link>
                <button onClick={closeDrawer} className="text-center text-sm text-stone hover:text-onyx">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
