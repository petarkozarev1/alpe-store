import { render, screen } from '@testing-library/react'
import LensesPage from '@/app/[locale]/lenses/page'

test('links the established lenses page to both indexable product pages', () => {
  render(<LensesPage params={{ locale: 'bg' }} />)

  expect(screen.getByRole('link', { name: /ALPÉ Daily/i })).toHaveAttribute(
    'href',
    '/product/alpe-daily',
  )
  expect(screen.getByRole('link', { name: /ALPÉ Evening/i })).toHaveAttribute(
    'href',
    '/product/alpe-evening',
  )
})
