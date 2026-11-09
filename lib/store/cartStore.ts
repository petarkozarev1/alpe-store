import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CartItem } from '@/lib/types'
import { displayedPairs, MAX_PAIRS, normalizeCartItems, parseLenses, variantIdFor } from '@/lib/order-lines'

interface CartStore {
  items: CartItem[]
  isDrawerOpen: boolean
  checkoutLocked: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, qty: number) => void
  setLinePairs: (productId: string, variantId: string, pairs: number) => void
  setCheckoutLocked: (locked: boolean) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
  getItemCount: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartStore>()(persist<CartStore, [], [], Pick<CartStore, 'items'>>((set, get) => ({
  items: [],
  isDrawerOpen: false,
  checkoutLocked: false,

  addItem: (item) => set((state) => ({
    items: normalizeCartItems([...state.items, item]),
  })),

  removeItem: (productId, variantId) => set((state) => ({
    items: state.items.filter(
      i => !(i.productId === productId && i.variantId === variantId)
    ),
  })),

  updateQuantity: (productId, variantId, qty) => set((state) => ({
    items: normalizeCartItems(
      qty < 1
        ? state.items.filter(i => !(i.productId === productId && i.variantId === variantId))
        : state.items.map(i =>
            i.productId === productId && i.variantId === variantId ? { ...i, quantity: qty } : i
          ),
    ),
  })),

  setLinePairs: (productId, variantId, pairs) => set((state) => {
    const capped = Math.min(pairs, MAX_PAIRS)
    if (capped < 1) {
      return { items: state.items.filter(i => !(i.productId === productId && i.variantId === variantId)) }
    }
    return {
      items: normalizeCartItems(state.items.map(i => {
        if (i.productId !== productId || i.variantId !== variantId) return i
        const base = parseLenses(i.variantId)
        if (!base || !base.every(lens => lens === base[0])) return { ...i, quantity: capped }
        return { ...i, variantId: variantIdFor(Array(capped).fill(base[0])), quantity: 1 }
      })),
    }
  }),

  setCheckoutLocked: (locked) => set({ checkoutLocked: locked }),
  clearCart: () => set({ items: [] }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  getItemCount: () => get().items.reduce((sum, i) => sum + displayedPairs(i), 0),
  getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}), {
  name: 'alpe-cart',
  version: 2,
  storage: createJSONStorage(() => localStorage),
  partialize: state => ({ items: state.items }),
  merge: (persisted, current) => {
    const stored = persisted as { items?: CartItem[] } | undefined
    return { ...current, items: normalizeCartItems(stored?.items ?? []) }
  },
}))
