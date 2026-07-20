import { render, screen } from '@testing-library/react'
import ProductPage from '@/app/product/[slug]/page'

jest.mock('@/components/product/ImageGallery', () => function MockGallery() {
  return <div>Gallery</div>
})

jest.mock('@/components/product/ProductDetailClient', () => function MockDetails() {
  return <div>Details</div>
})

jest.mock('@/components/product/ComplementaryProductCard', () => function MockCrossSell() {
  return <div>Cross-sell</div>
})

test('renders visible and structured breadcrumbs for an indexable product', () => {
  const { container } = render(<ProductPage params={{ slug: 'alpe-daily' }} />)

  expect(screen.getByRole('navigation', { name: 'Навигация' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Начало' })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: 'Стъкла' })).toHaveAttribute('href', '/lenses')
  expect(screen.getByText('ALPÉ Daily')).toHaveAttribute('aria-current', 'page')

  const schemas = Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
    .map((script) => JSON.parse(script.textContent || '{}'))
  const breadcrumbs = schemas.find((schema) => schema['@type'] === 'BreadcrumbList')

  expect(breadcrumbs?.itemListElement).toEqual([
    expect.objectContaining({ position: 1, item: 'https://www.alpewear.com' }),
    expect.objectContaining({ position: 2, item: 'https://www.alpewear.com/lenses' }),
    expect.objectContaining({
      position: 3,
      item: 'https://www.alpewear.com/product/alpe-daily',
    }),
  ])
})

test('renders product-specific information already used by the shop', () => {
  const { unmount } = render(<ProductPage params={{ slug: 'alpe-daily' }} />)

  expect(screen.getByText(/кехлибарено-жълта оцветка филтрира 65%/i)).toBeInTheDocument()
  expect(screen.getByText(/работа с дизайн, редактиране на снимки и видеоразговори/i)).toBeInTheDocument()

  unmount()
  render(<ProductPage params={{ slug: 'alpe-evening' }} />)

  expect(screen.getByText(/оранжев цвят блокира 98% от синята светлина/i)).toBeInTheDocument()
  expect(screen.getByText(/след залез слънце и поне 2 часа преди лягане/i)).toBeInTheDocument()
})
