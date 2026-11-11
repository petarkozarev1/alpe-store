'use client'

import { createContext, useContext } from 'react'
import { getPricingSnapshot, priceFromPacks, type PricingSnapshot } from '@/lib/sale'

const PricingContext = createContext<PricingSnapshot | null>(null)

export function PricingProvider({
  snapshot,
  children,
}: {
  snapshot: PricingSnapshot
  children: React.ReactNode
}) {
  return <PricingContext.Provider value={snapshot}>{children}</PricingContext.Provider>
}

/** Prices from the server-evaluated sale window for this request. */
export function usePricingSnapshot(): PricingSnapshot {
  return useContext(PricingContext) ?? getPricingSnapshot()
}

export function usePairPrice(pairs: number): number {
  const snapshot = usePricingSnapshot()
  return priceFromPacks(pairs, snapshot.single, snapshot.double)
}
