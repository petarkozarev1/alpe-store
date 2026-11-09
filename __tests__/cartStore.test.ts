import { act, renderHook } from '@testing-library/react'
import { useCartStore } from '@/lib/store/cartStore'
import { priceForPairs } from '@/lib/sale'

const mockItem = {
  productId: 'p1',
  variantId: 'v1',
  name: 'Test Product',
  variantLabel: '30ml',
  price: 49,
  quantity: 1,
  image: '/img.png',
  slug: 'test-product',
}

beforeEach(() => {
  useCartStore.setState({ items: [], isDrawerOpen: false })
})

test('addItem adds a new item', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(mockItem))
  expect(result.current.items).toHaveLength(1)
  expect(result.current.items[0].quantity).toBe(1)
})

test('adding the same pair pack twice rewrites the label to 2 чифта', () => {
  const { result } = renderHook(() => useCartStore())
  const pair = {
    ...mockItem,
    variantId: 'AMPÉ-daily-bundle-1',
    variantLabel: '🟡 За всеки ден · 1 чифт',
    price: 59.99,
  }
  act(() => result.current.addItem(pair))
  act(() => result.current.addItem(pair))
  expect(result.current.items).toHaveLength(1)
  expect(result.current.items[0].quantity).toBe(1)
  expect(result.current.items[0].variantId).toBe('AMPÉ-daily-daily-bundle-2')
  expect(result.current.items[0].variantLabel).toContain('2 чифта')
  expect(result.current.items[0].price).toBe(priceForPairs(2))
})

test('setLinePairs keeps the label on the real pair count', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem({
    ...mockItem,
    variantId: 'AMPÉ-daily-bundle-1',
    variantLabel: '🟡 За всеки ден · 1 чифт',
  }))
  const line = result.current.items[0]
  act(() => result.current.setLinePairs(line.productId, line.variantId, 2))
  expect(result.current.items[0].variantLabel).toContain('2 чифта')
  expect(result.current.items[0].quantity).toBe(1)
  expect(result.current.getItemCount()).toBe(2)
})

test('addItem increments quantity for existing item', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(mockItem))
  act(() => result.current.addItem(mockItem))
  expect(result.current.items).toHaveLength(1)
  expect(result.current.items[0].quantity).toBe(2)
})

test('removeItem removes an item', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(mockItem))
  act(() => result.current.removeItem('p1', 'v1'))
  expect(result.current.items).toHaveLength(0)
})

test('updateQuantity changes item quantity', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(mockItem))
  act(() => result.current.updateQuantity('p1', 'v1', 5))
  expect(result.current.items[0].quantity).toBe(5)
})

test('clearCart empties items', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(mockItem))
  act(() => result.current.clearCart())
  expect(result.current.items).toHaveLength(0)
})

test('openDrawer and closeDrawer toggle isDrawerOpen', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.openDrawer())
  expect(result.current.isDrawerOpen).toBe(true)
  act(() => result.current.closeDrawer())
  expect(result.current.isDrawerOpen).toBe(false)
})

test('getItemCount returns total quantity', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(mockItem))
  act(() => result.current.addItem({ ...mockItem, variantId: 'v2' }))
  expect(result.current.getItemCount()).toBe(2)
})

test('getSubtotal returns sum of price * quantity', () => {
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(mockItem))
  act(() => result.current.updateQuantity('p1', 'v1', 3))
  expect(result.current.getSubtotal()).toBe(147)
})

test('persists items but not drawer UI state', () => {
  localStorage.clear()
  const { result } = renderHook(() => useCartStore())
  act(() => result.current.addItem(mockItem))
  act(() => result.current.openDrawer())

  const stored = JSON.parse(localStorage.getItem('alpe-cart') ?? '{}')
  expect(stored.state.items).toHaveLength(1)
  expect(stored.state.isDrawerOpen).toBeUndefined()
})
