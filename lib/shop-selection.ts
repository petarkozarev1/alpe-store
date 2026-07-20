export type Lens = 'evening' | 'daily'
export type BundleCount = 1 | 2 | 3

export interface ShopSelection {
  lens: Lens
  bundle: BundleCount
  slots: Lens[]
}

export function getInitialShopSelection(bundle?: string): ShopSelection {
  if (bundle === 'daily-evening') {
    return {
      lens: 'daily',
      bundle: 2,
      slots: ['daily', 'evening'],
    }
  }

  return {
    lens: 'evening',
    bundle: 1,
    slots: ['evening'],
  }
}
