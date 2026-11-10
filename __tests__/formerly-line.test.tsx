import { render } from '@testing-library/react'
import FormerlyLine from '@/components/layout/FormerlyLine'
import { SHOW_FORMERLY_ALPE, formerlyLine } from '@/lib/brand'

test('the formerly ALPÉ line is switched off in both locales', () => {
  expect(SHOW_FORMERLY_ALPE).toBe(false)
  expect(formerlyLine('bg')).toBeNull()
  expect(formerlyLine('en')).toBeNull()

  for (const locale of ['bg', 'en'] as const) {
    const { container } = render(<FormerlyLine locale={locale} />)
    expect(container).toBeEmptyDOMElement()
    expect(container.textContent).not.toMatch(/преди ALPÉ|formerly ALPÉ/)
  }
})
