import { isEveningPurchasable } from '@/lib/preview-stock'

export type Lens = 'evening' | 'daily'
export type BundleCount = 1 | 2

export interface ShopSelection {
  lens: Lens
  bundle: BundleCount
  slots: Lens[]
}

export function getInitialShopSelection(bundle?: string): ShopSelection {
  if (bundle === 'daily-evening') {
    if (!isEveningPurchasable()) {
      return {
        lens: 'daily',
        bundle: 2,
        slots: ['daily', 'daily'],
      }
    }
    return {
      lens: 'daily',
      bundle: 2,
      slots: ['daily', 'evening'],
    }
  }

  return {
    lens: 'daily',
    bundle: 1,
    slots: ['daily'],
  }
}
