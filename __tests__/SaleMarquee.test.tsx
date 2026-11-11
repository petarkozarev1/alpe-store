import { render, screen } from '@testing-library/react'
import SaleMarquee from '@/components/layout/SaleMarquee'

const text = 'Код BLACK15: −15% за 1 чифт (€50.99). Два чифта €89.99 · безплатна доставка за 2+ чифта'

test('shows one announcement at a time and fades when motion is reduced', () => {
  const { container } = render(<SaleMarquee text={text} />)

  expect(screen.getByRole('region', { name: text })).toBeInTheDocument()
  expect(container.querySelectorAll('.sale-marquee-line')).toHaveLength(1)
  expect(screen.getByText(/Код BLACK15/i)).toBeInTheDocument()
  expect(screen.queryByText(/безплатна доставка/i)).not.toBeInTheDocument()

  const css = container.querySelector('style')?.textContent ?? ''
  expect(css).toContain('translate3d(var(--sale-to, -100%), 0, 0)')
  expect(css).toContain('animation-play-state: paused')
  expect(css).toContain('prefers-reduced-motion: reduce')
  expect(css).toContain('sale-fade')
})
