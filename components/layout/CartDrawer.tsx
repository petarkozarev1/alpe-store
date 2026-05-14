'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store/cartStore'
import { firePixelCustomEvent, firePixelEvent } from '@/components/analytics/MetaPixel'

const FREE_SHIPPING_THRESHOLD = 50

const certItems = [
  {
    label: 'ISO 12312- 1',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    label: 'ANSI Z80.3',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    label: 'AS/NZS 1067',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    label: 'UV400',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ),
  },
]

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

  useEffect(() => {
    if (!isDrawerOpen) return
    try {
      const storeItems = useCartStore.getState().items
      const total = storeItems.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0)
      firePixelCustomEvent('ViewCart', {
        content_ids: storeItems.map((i: { productId: string }) => i.productId),
        value: total,
        currency: 'EUR',
        num_items: storeItems.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0),
      })
    } catch { /* never break UI */ }
  }, [isDrawerOpen])

  const subtotal = getSubtotal()
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

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
                        <div className="flex flex-col items-end gap-0.5">
                          {item.originalPrice && (
                            <span className="font-sans text-xs text-stone/50 line-through">
                              €{(item.originalPrice * item.quantity).toFixed(2)}
                            </span>
                          )}
                          <p className="font-serif text-[17px] font-medium text-onyx">
                            €{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {item.saving && (
                        <div className="mt-2 inline-flex items-center gap-1 bg-[#E8F4EC] rounded-full px-2.5 py-1">
                          <span className="font-sans text-[10px] font-semibold text-[#2d6a3a]">
                            Спестяваш €{item.saving}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      aria-label={`Премахни ${item.name} от количката`}
                      className="text-stone/40 hover:text-red-500 transition-colors mt-0.5 flex-shrink-0"
                    >
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Shipping progress + cert strip */}
            {items.length > 0 && (
              <div className="flex-shrink-0">
                {/* Shipping progress bar */}
                <div className="px-5 pb-4">
                  <div className="bg-[#E8F4EC] rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs text-iron">
                        {remaining > 0
                          ? `Добави €${remaining.toFixed(0)} за безплатна доставка`
                          : 'Получаваш безплатна доставка!'}
                      </span>
                      <span className="font-sans text-xs font-semibold text-iron">
                        {Math.round(shippingProgress)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4CAF50] rounded-full transition-all duration-500"
                        style={{ width: `${shippingProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Cert strip */}
                <div className="flex items-start justify-around px-4 py-3 border-t border-stone/10">
                  {certItems.map(cert => (
                    <div key={cert.label} className="flex flex-col items-center gap-1 text-stone/60">
                      <span className="text-stone/50">{cert.icon}</span>
                      <span className="font-sans text-[8px] font-semibold tracking-wide text-center uppercase leading-tight whitespace-pre-line">
                        {cert.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 pt-3 pb-6 border-t border-stone/20 flex flex-col gap-3 flex-shrink-0">
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-sm text-stone">Общо</span>
                  <span className="font-serif text-2xl font-medium text-onyx">
                    €{subtotal.toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => {
                    try {
                      firePixelEvent('InitiateCheckout', {
                        value: subtotal,
                        currency: 'EUR',
                        content_ids: items.map(item => item.productId),
                        num_items: items.reduce((sum, item) => sum + item.quantity, 0),
                      })
                    } catch { /* never break UI */ }
                    closeDrawer()
                  }}
                  className="w-full bg-onyx text-linen text-center py-[17px] rounded-lg font-sans font-medium text-[15px] hover:bg-iron transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  Към плащане
                </Link>

                <button
                  onClick={closeDrawer}
                  className="font-sans text-sm text-stone hover:text-onyx transition-colors text-center"
                >
                  Продължи пазаруването
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
