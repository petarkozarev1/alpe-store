import { create } from 'zustand'
import type { CartItem } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  isDrawerOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, qty: number) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
  getItemCount: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isDrawerOpen: false,

  addItem: (item) => set((state) => {
    const existing = state.items.find(
      i => i.productId === item.productId && i.variantId === item.variantId
    )
    if (existing) {
      return {
        items: state.items.map(i =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      }
    }
    return { items: [...state.items, item] }
  }),

  removeItem: (productId, variantId) => set((state) => ({
    items: state.items.filter(
      i => !(i.productId === productId && i.variantId === variantId)
    ),
  })),

  updateQuantity: (productId, variantId, qty) => set((state) => ({
    items: state.items.map(i =>
      i.productId === productId && i.variantId === variantId
        ? { ...i, quantity: qty }
        : i
    ),
  })),

  clearCart: () => set({ items: [] }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}))
