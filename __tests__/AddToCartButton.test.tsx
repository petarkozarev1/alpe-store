import { fireEvent, render, screen } from '@testing-library/react'
import AddToCartButton from '@/components/product/AddToCartButton'
import { useCartStore } from '@/lib/store/cartStore'
import type { Product, Variant } from '@/lib/types'

jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
}))

const product: Product = {
  id: 'alpe-daily',
  slug: 'alpe-daily',
  name: 'ALPÉ Daily',
  subtitle: 'Daily lenses',
  description: 'Screen glasses',
  price: 44.99,
  images: ['/images/shop/shop-daily-1.png'],
  variants: [],
}

const selectedVariant: Variant = {
  id: 'daily-clear',
  label: 'Daily Clear',
  inStock: true,
}

beforeEach(() => {
  localStorage.clear()
  useCartStore.setState({ items: [], isDrawerOpen: false })
  window.fbq = jest.fn()
})

test('fires AddToCart when an in-stock product is added after consent', () => {
  localStorage.setItem('alpe-cookie-consent', 'all')

  render(<AddToCartButton product={product} selectedVariant={selectedVariant} />)
  fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }))

  expect(window.fbq).toHaveBeenCalledWith('track', 'AddToCart', {
    content_name: 'ALPÉ Daily',
    content_ids: ['alpe-daily'],
    content_type: 'product',
    value: 44.99,
    currency: 'EUR',
  })
})
