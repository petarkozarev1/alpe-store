import { render, screen } from '@testing-library/react'
import CertificationsPage from '@/app/[locale]/certifications/page'
import LensesPage from '@/app/[locale]/lenses/page'
import SciencePage from '@/app/[locale]/science/page'
import FaqsPage from '@/app/[locale]/faqs/page'

const cyrillic = /[А-Яа-я]/

test('keeps the published lab rows on the certifications page', () => {
  render(<CertificationsPage params={{ locale: 'bg' }} />)
  expect(screen.getByText('BS EN ISO 12312-1:2013+A1:2015')).toBeInTheDocument()
  expect(screen.getByText('ANSI Z80.3-2015')).toBeInTheDocument()
  expect(screen.getByText('AS/NZS 1067.1:2016')).toBeInTheDocument()
  expect(screen.getAllByText(/99[,.]29%/).length).toBeGreaterThan(0)
  expect(screen.queryByText(/99[,.]21%/)).not.toBeInTheDocument()
  expect(screen.queryByText(/PASS/)).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /Ето числата/ })).toBeInTheDocument()
  expect(screen.getAllByText('AMPÉ Daily').length).toBeGreaterThan(0)
  expect(screen.getAllByText('AMPÉ Evening').length).toBeGreaterThan(0)
  expect(screen.getAllByText(/не е медицинско изделие/i).length).toBeGreaterThan(0)
  expect(screen.getByRole('link', { name: 'https://pubmed.ncbi.nlm.nih.gov/11487664/' })).toHaveAttribute('href', 'https://pubmed.ncbi.nlm.nih.gov/11487664/')
})

test('keeps both plastic lens product links visible', () => {
  render(<LensesPage params={{ locale: 'bg' }} />)
  expect(screen.getByRole('link', { name: /AMPÉ Daily/i })).toHaveAttribute('href', '/product/alpe-daily')
  expect(screen.getByRole('link', { name: /AMPÉ Evening/i })).toHaveAttribute('href', '/product/alpe-evening')
  expect(screen.getByText('65% блокиране на синя светлина')).toBeInTheDocument()
  expect(screen.getByText('98% блокиране на синя светлина')).toBeInTheDocument()
})

test('keeps the science facts and the how-it-works steps', () => {
  render(<SciencePage params={{ locale: 'bg' }} />)
  expect(screen.getByRole('heading', { name: 'Защо синята светлина вечер има значение' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Използвай ги' })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'Сложи ги' })).not.toBeInTheDocument()
  expect(screen.getAllByText(/99,29% от синята светлина/).length).toBeGreaterThan(0)
  expect(screen.getByRole('link', { name: 'https://pubmed.ncbi.nlm.nih.gov/11487664/' })).toHaveAttribute('href', 'https://pubmed.ncbi.nlm.nih.gov/11487664/')
  expect(screen.queryByText(/до 50%/)).not.toBeInTheDocument()
})

test('renders every FAQ question', () => {
  render(<FaqsPage params={{ locale: 'bg' }} />)
  expect(screen.getByText('Наистина ли работят тези очила?')).toBeInTheDocument()
  expect(screen.getByText('Работят ли с диоптрични стъкла?')).toBeInTheDocument()
})

test('english info pages do not leave Bulgarian copy untranslated', () => {
  const { container, unmount } = render(<CertificationsPage params={{ locale: 'en' }} />)
  expect(container.textContent).not.toMatch(cyrillic)
  unmount()
  const lenses = render(<LensesPage params={{ locale: 'en' }} />)
  expect(lenses.container.textContent).not.toMatch(cyrillic)
  lenses.unmount()
  const science = render(<SciencePage params={{ locale: 'en' }} />)
  expect(science.container.textContent).not.toMatch(cyrillic)
  science.unmount()
  const faqs = render(<FaqsPage params={{ locale: 'en' }} />)
  expect(faqs.container.textContent).not.toMatch(cyrillic)
})
