import { render, screen } from '@testing-library/react'
import LensesPage from '@/app/[locale]/lenses/page'

test('links the established plastic lenses page to both indexable product pages', () => {
  render(<LensesPage params={{ locale: 'bg' }} />)

  expect(screen.getByRole('link', { name: /AMPÉ Daily/i })).toHaveAttribute(
    'href',
    '/product/alpe-daily',
  )
  expect(screen.getByRole('link', { name: /AMPÉ Evening/i })).toHaveAttribute(
    'href',
    '/product/alpe-evening',
  )
})
