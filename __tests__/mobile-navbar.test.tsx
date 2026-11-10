import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '@/components/i18n/LocaleProvider'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import Navbar from '@/components/layout/Navbar'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: {
      div: ({ children, ...props }: { children?: React.ReactNode }) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  }
})

function renderNav(locale: 'bg' | 'en' = 'bg') {
  return render(
    <LocaleProvider locale={locale}>
      <Navbar />
    </LocaleProvider>,
  )
}

test('the mobile language control is one switch that flips to English', () => {
  render(
    <LocaleProvider locale="bg">
      <LanguageSwitcher variant="toggle" />
    </LocaleProvider>,
  )
  const toggle = screen.getByRole('switch', { name: 'Език: български. Превключи на английски' })
  expect(toggle).toHaveAttribute('aria-checked', 'false')
  expect(toggle).toHaveAttribute('href', '/en')
  expect(toggle).toHaveTextContent('bg')
  expect(toggle.className).not.toMatch(/border|rounded|bg-linen/)
  expect(screen.queryByRole('link', { name: 'en' })).not.toBeInTheDocument()
})

test('the order button stays on desktop and the cream wordmark is shared', () => {
  renderNav()
  const orders = screen.getAllByRole('link', { name: 'Поръчай сега' })
  expect(orders).toHaveLength(1)
  expect(orders[0].parentElement?.className).toContain('hidden')
  expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  expect(screen.getAllByRole('link', { name: 'Switch to English' })).toHaveLength(1)
  const marks = screen.getAllByRole('img', { name: 'AMPÉ' })
  expect(marks).toHaveLength(2)
  for (const mark of marks) {
    expect(mark).toHaveAttribute('src', '/brand/ampe-wordmark-cream-on-transparent.svg')
  }
})

test('english keeps a single desktop shop button and checks the language switch', () => {
  renderNav('en')
  const toggle = screen.getByRole('switch', { name: 'Language: English. Switch to Bulgarian' })
  expect(toggle).toHaveAttribute('aria-checked', 'true')
  expect(toggle).toHaveAttribute('href', '/')
  expect(toggle).toHaveTextContent('en')
  expect(screen.getAllByRole('link', { name: 'Shop now' })).toHaveLength(1)
  expect(screen.getAllByRole('link', { name: 'Switch to Bulgarian' })).toHaveLength(1)
})
