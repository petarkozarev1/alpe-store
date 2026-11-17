import { fireEvent, render, screen } from '@testing-library/react'
import ProductPage from '@/components/shop/ProductPage'
import { useCartStore } from '@/lib/store/cartStore'
import type { InventorySnapshot } from '@/lib/stock'

jest.mock('@/components/analytics/MetaPixel', () => ({
  fireTrackedEvent: jest.fn(),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => <span />,
}))

const mockSnapshot: { current: InventorySnapshot } = {
  current: {
    daily: { code: 'daily', stock: 250, status: 'Очаква се' },
    evening: { code: 'evening', stock: 250, status: 'Очаква се' },
  },
}

jest.mock('@/components/inventory/useInventory', () => ({
  useInventory: () => mockSnapshot.current,
}))

class MockIntersectionObserver {
  observe = jest.fn()
  disconnect = jest.fn()
}

beforeEach(() => {
  useCartStore.setState({ items: [], isDrawerOpen: false })
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  })
  mockSnapshot.current = {
    daily: { code: 'daily', stock: 250, status: 'Очаква се' },
    evening: { code: 'evening', stock: 250, status: 'Очаква се' },
  }
})

test('shows Coming soon and does not add a pair while stock is expected', () => {
  render(<ProductPage />)
  const buttons = screen.getAllByRole('button', { name: 'Очаквайте скоро' })
  expect(buttons.length).toBeGreaterThan(0)
  buttons.forEach(button => expect(button).toBeDisabled())
  fireEvent.click(buttons[0])
  expect(useCartStore.getState().items).toHaveLength(0)
})

test('shows Sold out when the selected bundle needs more pairs than Notion has', () => {
  mockSnapshot.current = {
    daily: { code: 'daily', stock: 1, status: 'В наличност' },
    evening: { code: 'evening', stock: 4, status: 'Изчерпан' },
  }
  render(<ProductPage />)
  fireEvent.click(screen.getByRole('radio', { name: /2 чифта/ }))
  const soldOut = screen.getAllByRole('button', { name: 'Изчерпан' })
  expect(soldOut.length).toBeGreaterThan(0)
  soldOut.forEach(button => expect(button).toBeDisabled())
})

test('keeps the normal add-to-cart label when both pairs in a bundle are in stock', () => {
  mockSnapshot.current = {
    daily: { code: 'daily', stock: 5, status: 'В наличност' },
    evening: { code: 'evening', stock: 5, status: 'В наличност' },
  }
  render(<ProductPage />)
  fireEvent.click(screen.getByRole('radio', { name: /2 чифта/ }))
  fireEvent.click(screen.getAllByRole('button', { name: 'Вечерни' })[0])
  expect(screen.getByRole('button', { name: 'Добави в количката — €89.99 →' })).toBeEnabled()
})
