'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store/cartStore'

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, getSubtotal } = useCartStore()

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isDrawerOpen])

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-onyx z-40"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280, mass: 0.9 }}
            role="dialog"
            aria-modal="true"
            aria-label="Количка"
            className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-parchment z-50 flex flex-col shadow-[-8px_0_48px_rgba(45,14,4,0.18)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-[22px] border-b border-stone/20 flex-shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl font-medium text-onyx">
                  Количка
                </h2>
                <span className="w-5 h-5 rounded-full bg-onyx text-linen text-[10px] font-sans font-medium flex items-center justify-center">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Затвори количката"
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone hover:bg-stone/10 hover:text-onyx transition-all duration-150 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-0">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-stone py-16">
                  <div className="w-14 h-14 rounded-full bg-stone/10 flex items-center justify-center">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                  </div>
                  <p className="font-sans text-sm">Количката ви е празна.</p>
                  <button
                    onClick={closeDrawer}
                    className="font-sans text-sm text-onyx border-b border-onyx/40 hover:border-onyx transition-colors pb-px"
                  >
                    Продължи пазаруването
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex gap-4 items-start py-5 border-b border-stone/10 last:border-none last:pb-0 first:pt-0"
                  >
                    {/* Image */}
                    <div className="relative w-[72px] h-[72px] rounded-[10px] overflow-hidden bg-linen flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-[15px] font-medium text-onyx mb-0.5">{item.name}</p>
                      <p className="font-sans text-xs text-stone mb-3">{item.variantLabel}</p>
                      <div className="flex items-center justify-between">
                        {/* Qty stepper */}
                        <div
                          className="flex items-center border border-stone/25 rounded-lg overflow-hidden"
                          role="group"
                          aria-label="Количество"
                        >
                          <button
                            className="w-8 h-8 flex items-center justify-center text-sm text-onyx hover:bg-stone/10 transition-colors"
                            aria-label="Намали количеството"
                            onClick={() =>
                              item.quantity > 1
                                ? updateQuantity(item.productId, item.variantId, item.quantity - 1)
                                : removeItem(item.productId, item.variantId)
                            }
                          >
                            −
                          </button>
                          <span
                            className="w-8 text-center font-sans text-sm font-medium text-onyx"
                            aria-live="polite"
                          >
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center text-sm text-onyx hover:bg-stone/10 transition-colors"
                            aria-label="Увеличи количеството"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <p className="font-serif text-[17px] font-medium text-onyx">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      aria-label={`Премахни ${item.name} от количката`}
                      className="text-stone/50 hover:text-onyx transition-colors text-xl leading-none mt-0.5 flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 pt-4 pb-6 border-t border-stone/20 flex flex-col gap-3 flex-shrink-0">

                {/* Subtotal */}
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-sm text-stone">Общо</span>
                  <span className="font-serif text-2xl font-medium text-onyx">
                    €{getSubtotal().toFixed(2)}
                  </span>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full bg-onyx text-linen text-center py-[17px] rounded-lg font-sans font-medium text-[15px] hover:bg-iron transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  Към плащане
                </Link>

                {/* Continue shopping */}
                <button
                  onClick={closeDrawer}
                  className="font-sans text-sm text-stone hover:text-onyx transition-colors text-center"
                >
                  Продължи пазаруването
                </button>

                {/* Certification strip */}
                <div className="flex items-center justify-center gap-4 pt-2 border-t border-stone/10 mt-1">
                  {[
                    { label: 'ISO 12312-1' },
                    { label: 'ANSI Z80.3' },
                    { label: 'AS/NZS 1067' },
                    { label: 'UV400' },
                  ].map((cert, i, arr) => (
                    <div key={cert.label} className="flex items-center gap-4">
                      <span className="font-sans text-[9px] font-semibold tracking-wider text-gold uppercase">
                        {cert.label}
                      </span>
                      {i < arr.length - 1 && (
                        <span className="w-px h-4 bg-stone/20 block" />
                      )}
                    </div>
                  ))}
                </div>

              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
