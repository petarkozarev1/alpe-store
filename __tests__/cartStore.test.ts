import { act, renderHook } from '@testing-library/react'
import { useCartStore } from '@/lib/store/cartStore'

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
