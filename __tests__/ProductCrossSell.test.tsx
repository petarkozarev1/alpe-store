import { render, screen } from '@testing-library/react'
import ComplementaryProductCard from '@/components/product/ComplementaryProductCard'
import { products } from '@/lib/data/products'

jest.mock('next/image', () => function MockImage({ fill, ...props }: any) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} />
})

test('links the complementary product and the preselected Daily + Evening bundle', () => {
  const evening = products.find((product) => product.slug === 'alpe-evening')!

  render(<ComplementaryProductCard product={evening} />)

  expect(screen.getByRole('heading', { name: 'ALPÉ Evening' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /вземи daily \+ evening/i })).toHaveAttribute(
    'href',
    '/shop?bundle=daily-evening',
  )
  expect(screen.getByRole('link', { name: /разгледай alpé evening/i })).toHaveAttribute(
    'href',
    '/product/alpe-evening',
  )
})
