import { render, screen } from '@testing-library/react'
import SaleMarquee from '@/components/layout/SaleMarquee'

const text = 'Код BLACK15: −15% за 1 чифт (€50.99). Два чифта €89.99 · безплатна доставка за 2+ чифта'

test('loops two identical groups and pauses for reduced motion', () => {
  const { container } = render(<SaleMarquee text={text} />)

  expect(screen.getByRole('region', { name: text })).toBeInTheDocument()
  expect(container.querySelectorAll('.sale-marquee-group')).toHaveLength(2)
  expect(container.querySelectorAll('.sale-marquee-item')).toHaveLength(12)

  const css = container.querySelector('style')?.textContent ?? ''
  expect(css).toContain('translate3d(-50%, 0, 0)')
  expect(css).toContain('animation-play-state: paused')
  expect(css).toContain('prefers-reduced-motion: reduce')
  expect(css).toContain('animation: none')
})
