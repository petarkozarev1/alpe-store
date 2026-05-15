import type { CartItem, Product } from '@/lib/types'

export const ALPE_GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-T37H3CM2'
export const ALPE_GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-R2N13KKLM9'

type DataLayerValue = string | number | boolean | null | DataLayerValue[] | { [key: string]: DataLayerValue }

declare global {
  interface Window {
    dataLayer?: Record<string, DataLayerValue>[]
    gtag?: (
      command: 'consent',
      action: 'default' | 'update',
      params: {
        ad_storage: 'granted' | 'denied'
        ad_user_data: 'granted' | 'denied'
        ad_personalization: 'granted' | 'denied'
        analytics_storage: 'granted' | 'denied'
      }
    ) => void
  }
}

function hasMarketingConsent() {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('alpe-cookie-consent') === 'all'
}

export function updateGoogleConsent(granted: boolean) {
  if (typeof window === 'undefined') return

  const value = granted ? 'granted' : 'denied'
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag(...args) {
      window.dataLayer?.push(args as unknown as Record<string, DataLayerValue>)
    }

  window.gtag('consent', 'update', {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  })
}

function pushDataLayer(event: string, params: Record<string, DataLayerValue> = {}) {
  if (typeof window === 'undefined' || !hasMarketingConsent()) return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
}

export function googleCartParams(items: CartItem[]) {
  return {
    currency: 'EUR',
    value: Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)),
    items: items.map(item => ({
      item_id: item.productId,
      item_name: item.name,
      item_variant: item.variantLabel,
      price: item.price,
      quantity: item.quantity,
    })),
  }
}

export function googleProductParams(product: Product, quantity = 1) {
  return {
    currency: 'EUR',
    value: product.price * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity,
      },
    ],
  }
}

export function trackGoogleEvent(event: string, params?: Record<string, DataLayerValue>) {
  pushDataLayer(event, params)
}
