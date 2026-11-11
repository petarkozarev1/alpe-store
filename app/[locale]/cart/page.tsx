'use client'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { fireTrackedEvent } from '@/components/analytics/MetaPixel'
import { googleCartParams, trackGoogleEvent } from '@/lib/googleAnalytics'
import { countPairs } from '@/lib/pricing'
import { displayedPairs } from '@/lib/order-lines'
import { regularPriceForPairs } from '@/lib/sale'
import { usePairPrice } from '@/components/pricing/PricingProvider'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { localizeContent } from '@/components/i18n/LocalizedContent'
import { localizeCartVariantLabel } from '@/lib/i18n/cart'

export default function CartPage() {
  const locale = useLocale()
  const { items, removeItem, setLinePairs, checkoutLocked, pairLimit } = useCartStore()
  const pairCount = countPairs(items)
  const bundleTotal = usePairPrice(pairCount)
  const separateTotal = regularPriceForPairs(pairCount)

  if (items.length === 0) {
    return localizeContent(locale, (
      <div className="max-w-content mx-auto px-6 md:px-10 py-32 flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold">Количката е празна</h1>
        <Link href="/shop" className="text-stone underline hover:text-onyx">
          Продължи пазаруването
        </Link>
      </div>
    ))
  }

  return localizeContent(locale, (
    <div className="max-w-content mx-auto px-6 md:px-10 py-16">
      <h1 className="text-3xl font-bold mb-10">Количка</h1>
      <div className="flex flex-col gap-5 mb-8">
        {items.map(item => (
          <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-6 py-5 border-b border-iron">
            <div className="font-semibold flex-1">{item.name} — {localizeCartVariantLabel(locale, item.variantLabel)}</div>
            <div className="flex items-center border border-iron rounded-lg overflow-hidden" role="group" aria-label="Quantity">
              <button
                className="w-8 h-8 flex items-center justify-center hover:bg-iron disabled:opacity-40"
                aria-label="Decrease quantity"
                disabled={checkoutLocked}
                onClick={() => displayedPairs(item) > 1 ? setLinePairs(item.productId, item.variantId, displayedPairs(item) - 1) : removeItem(item.productId, item.variantId)}
              >−</button>
              <span className="w-10 text-center" aria-live="polite">{displayedPairs(item)}</span>
              <button
                className="w-8 h-8 flex items-center justify-center hover:bg-iron disabled:opacity-40"
                aria-label="Increase quantity"
                disabled={checkoutLocked}
                onClick={() => setLinePairs(item.productId, item.variantId, displayedPairs(item) + 1)}
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
      {pairLimit === 'cap' && <p role="alert" className="text-sm text-red-700 mb-4">Може да поръчате до 10 чифта.</p>}
      <div className="flex justify-between items-center pt-4">
        <span className="text-xl font-bold">
          Общо: {separateTotal > bundleTotal + 0.001 && <span className="text-iron font-normal text-base mr-2">поотделно: €{separateTotal.toFixed(2)}</span>}€{bundleTotal.toFixed(2)}
        </span>
        <Link
          href="/checkout"
          onClick={() => {
            fireTrackedEvent('InitiateCheckout', {
              data: {
                content_ids: items.map(item => item.productId),
                content_type: 'product',
                contents: items.map(item => ({ id: item.productId, quantity: item.quantity })),
                currency: 'EUR',
                num_items: items.reduce((sum, item) => sum + item.quantity, 0),
                value: bundleTotal,
              },
              value: bundleTotal,
              currency: 'EUR',
              contentIds: items.map(item => item.productId),
              numItems: items.reduce((sum, item) => sum + item.quantity, 0),
            })
            trackGoogleEvent('begin_checkout', googleCartParams(items))
          }}
          className="bg-onyx text-linen px-8 py-4 rounded-xl font-semibold hover:bg-iron transition-colors"
        >
          Към плащане →
        </Link>
      </div>
    </div>
  ))
}
