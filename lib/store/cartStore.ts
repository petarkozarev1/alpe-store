import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CartItem } from '@/lib/types'
import { displayedPairTotal, displayedPairs, MAX_PAIRS, normalizeCartItems, parseLenses, variantIdFor } from '@/lib/order-lines'

interface CartStore {
  items: CartItem[]
  isDrawerOpen: boolean
  checkoutLocked: boolean
  pairLimit: 'cap' | null
  addItem: (item: CartItem) => boolean
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, qty: number) => boolean
  setLinePairs: (productId: string, variantId: string, pairs: number) => boolean
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
  pairLimit: null,

  addItem: (item) => {
    const draft = [...get().items, item]
    if (displayedPairTotal(draft) > MAX_PAIRS) {
      set({ pairLimit: 'cap' })
      return false
    }
    set({ items: normalizeCartItems(draft), pairLimit: null })
    return true
  },

  removeItem: (productId, variantId) => set((state) => ({
    items: state.items.filter(
      i => !(i.productId === productId && i.variantId === variantId)
    ),
    pairLimit: null,
  })),

  updateQuantity: (productId, variantId, qty) => {
    const draft = qty < 1
      ? get().items.filter(i => !(i.productId === productId && i.variantId === variantId))
      : get().items.map(i =>
          i.productId === productId && i.variantId === variantId ? { ...i, quantity: qty } : i
        )
    if (displayedPairTotal(draft) > MAX_PAIRS) {
      set({ pairLimit: 'cap' })
      return false
    }
    set({ items: normalizeCartItems(draft), pairLimit: null })
    return true
  },

  setLinePairs: (productId, variantId, pairs) => {
    if (pairs < 1) {
      set((state) => ({
        items: state.items.filter(i => !(i.productId === productId && i.variantId === variantId)),
        pairLimit: null,
      }))
      return true
    }
    const current = get().items.find(i => i.productId === productId && i.variantId === variantId)
    const others = displayedPairTotal(get().items) - (current ? displayedPairs(current) : 0)
    if (others + pairs > MAX_PAIRS) {
      set({ pairLimit: 'cap' })
      return false
    }
    set({
      pairLimit: null,
      items: normalizeCartItems(get().items.map(i => {
        if (i.productId !== productId || i.variantId !== variantId) return i
        const base = parseLenses(i.variantId)
        if (!base || !base.every(lens => lens === base[0])) return { ...i, quantity: pairs }
        return { ...i, variantId: variantIdFor(Array(pairs).fill(base[0])), quantity: 1 }
      })),
    })
    return true
  },

  setCheckoutLocked: (locked) => set({ checkoutLocked: locked }),
  clearCart: () => set({ items: [], pairLimit: null }),
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
