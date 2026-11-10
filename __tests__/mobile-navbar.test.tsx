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

test('mobile language toggle shows both locales and the menu does not', () => {
  render(
    <LocaleProvider locale="bg">
      <LanguageSwitcher variant="toggle" />
    </LocaleProvider>,
  )
  const group = screen.getByRole('group', { name: 'Език' })
  expect(group).toHaveTextContent('bg')
  expect(group).toHaveTextContent('en')
  expect(screen.getByRole('link', { name: 'bg' })).toHaveAttribute('aria-current', 'true')
  expect(screen.getByRole('link', { name: 'en' })).toHaveAttribute('href', '/en')
})

test('the order button stays on desktop and the language toggle sits on the mobile bar', () => {
  renderNav()
  const orders = screen.getAllByRole('link', { name: 'Поръчай сега' })
  expect(orders).toHaveLength(1)
  expect(orders[0].parentElement?.className).toContain('hidden')
  expect(screen.getByRole('group', { name: 'Език' })).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Switch to English' })).toHaveLength(1)
})

test('english keeps a single desktop shop button and marks EN current', () => {
  renderNav('en')
  expect(screen.getByRole('link', { name: 'en' })).toHaveAttribute('aria-current', 'true')
  expect(screen.getAllByRole('link', { name: 'Shop now' })).toHaveLength(1)
  expect(screen.getAllByRole('link', { name: 'Switch to Bulgarian' })).toHaveLength(1)
})
