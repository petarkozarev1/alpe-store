import { render, screen, fireEvent } from '@testing-library/react'
import ShoppableVideoModal from '@/components/product/ShoppableVideoModal'
import { useCartStore } from '@/lib/store/cartStore'

jest.mock('@/components/analytics/MetaPixel', () => ({
  fireTrackedEvent: jest.fn(),
}))

beforeEach(() => {
  useCartStore.setState({ items: [], isDrawerOpen: false, pairLimit: null })
})

test('adds a single Daily pair from the video modal and opens the cart', () => {
  const onClose = jest.fn()
  render(<ShoppableVideoModal locale="bg" index={0} onClose={onClose} onIndex={() => {}} />)

  expect(screen.getByRole('dialog')).toBeInTheDocument()
  expect(document.querySelector('video')?.getAttribute('src')).toBe('/videos/pdp/01.mp4')
  fireEvent.click(screen.getByRole('button', { name: /Добави в количката — €59\.99/ }))
  expect(onClose).toHaveBeenCalled()
  expect(useCartStore.getState().isDrawerOpen).toBe(true)
  expect(useCartStore.getState().items[0]).toMatchObject({
    variantId: 'AMPÉ-daily-bundle-1',
    price: 59.99,
    quantity: 1,
  })
})

test('clip 05 starts at 7 seconds and a double pack uses the pair price', () => {
  render(<ShoppableVideoModal locale="bg" index={4} onClose={() => {}} onIndex={() => {}} />)
  expect(document.querySelector('video')?.getAttribute('src')).toBe('/videos/pdp/05.mp4#t=7')
  fireEvent.click(screen.getByRole('radio', { name: /2 чифта/ }))
  fireEvent.click(screen.getByRole('button', { name: /Добави в количката — €89\.99/ }))
  expect(useCartStore.getState().items[0]).toMatchObject({
    variantId: 'AMPÉ-daily-daily-bundle-2',
    price: 89.99,
  })
})
