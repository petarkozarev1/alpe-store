import { render, screen } from '@testing-library/react'
import ShoppableVideoModal from '@/components/product/ShoppableVideoModal'

jest.mock('@/components/analytics/MetaPixel', () => ({
  fireTrackedEvent: jest.fn(),
}))

jest.mock('@/lib/preview-stock', () => ({
  isEveningPurchasable: () => false,
}))

test('keeps Evening out of stock when the production gate is closed', () => {
  render(<ShoppableVideoModal locale="bg" index={0} onClose={() => {}} onIndex={() => {}} />)
  const evening = screen.getByRole('button', { name: /Вечер/ })
  expect(evening).toBeDisabled()
  expect(screen.getByText('Временно изчерпано')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Добави в количката/ })).toBeEnabled()
})
