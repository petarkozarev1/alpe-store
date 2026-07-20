import { render, screen } from '@testing-library/react'
import ProductDetailClient from '@/components/product/ProductDetailClient'
import { getProductBySlug } from '@/lib/data/products'

jest.mock('@/components/analytics/MetaPixel', () => ({
  fireTrackedEvent: jest.fn(),
}))

jest.mock('@/components/product/AddToCartButton', () => function MockAddToCartButton() {
  return <button>Добави в количката</button>
})

test('shows only real Daily product information with euro pricing and no size or color selector', () => {
  const product = getProductBySlug('alpe-daily')!

  render(<ProductDetailClient product={product} />)

  expect(screen.getByText('€44.99')).toBeInTheDocument()
  expect(screen.getByText(/65% филтър на синята светлина/)).toBeInTheDocument()
  expect(screen.getAllByText(/UV400 защита/).length).toBeGreaterThan(0)
  expect(screen.queryByText('Size')).not.toBeInTheDocument()
  expect(screen.queryByText('Black')).not.toBeInTheDocument()
  expect(screen.queryByText('Tortoise')).not.toBeInTheDocument()
})
