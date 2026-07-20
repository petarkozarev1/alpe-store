import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ProductPage from '@/components/shop/ProductPage'
import { fireTrackedEvent } from '@/components/analytics/MetaPixel'
import { useCartStore } from '@/lib/store/cartStore'

jest.mock('@/components/analytics/MetaPixel', () => ({
  fireTrackedEvent: jest.fn(),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, fill: _fill, priority: _priority, ...props }: any) => <img alt={alt} {...props} />,
}))

const mockFireTrackedEvent = fireTrackedEvent as jest.MockedFunction<typeof fireTrackedEvent>

class MockIntersectionObserver {
  observe = jest.fn()
  disconnect = jest.fn()
}

beforeEach(() => {
  mockFireTrackedEvent.mockClear()
  useCartStore.setState({ items: [], isDrawerOpen: false })
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  })
})

test('tracks ViewContent when the shop product page renders', async () => {
  render(<ProductPage />)

  await waitFor(() => {
    expect(mockFireTrackedEvent).toHaveBeenCalledWith('ViewContent', {
      data: {
        content_name: 'ALPÉ Glasses',
        content_ids: ['ALPÉ-glasses'],
        content_type: 'product',
        value: 44.99,
        currency: 'EUR',
      },
      value: 44.99,
      currency: 'EUR',
      contentIds: ['ALPÉ-glasses'],
    })
  })
})

test('tracks AddToCart and opens the drawer from the shop CTA', async () => {
  render(<ProductPage />)

  mockFireTrackedEvent.mockClear()
  fireEvent.click(screen.getByRole('button', { name: 'Добави в количката — €44.99 →' }))

  expect(mockFireTrackedEvent).toHaveBeenCalledWith('AddToCart', {
    data: {
      content_name: 'ALPÉ',
      content_ids: ['ALPÉ-evening'],
      content_type: 'product',
      value: 44.99,
      currency: 'EUR',
    },
    value: 44.99,
    currency: 'EUR',
    contentIds: ['ALPÉ-evening'],
    numItems: 1,
  })
  expect(useCartStore.getState().isDrawerOpen).toBe(true)
})

test('caps shop image quality at the optimized value', () => {
  const { container } = render(<ProductPage />)
  const optimizedImages = Array.from(container.querySelectorAll('img[quality]'))

  expect(optimizedImages.length).toBeGreaterThan(0)
  expect(optimizedImages.every((image) => image.getAttribute('quality') === '85')).toBe(true)
})
