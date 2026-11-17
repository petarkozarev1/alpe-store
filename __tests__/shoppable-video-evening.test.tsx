import { fireEvent, render, screen } from '@testing-library/react'
import ShoppableVideoModal from '@/components/product/ShoppableVideoModal'

jest.mock('@/components/analytics/MetaPixel', () => ({
  fireTrackedEvent: jest.fn(),
}))

jest.mock('@/components/inventory/useInventory', () => ({
  useInventory: () => ({
    daily: { code: 'daily', stock: 250, status: 'В наличност' },
    evening: { code: 'evening', stock: 250, status: 'Очаква се' },
  }),
}))

test('keeps Evening selectable and disables checkout while it is coming soon', () => {
  render(<ShoppableVideoModal locale="bg" index={0} onClose={() => {}} onIndex={() => {}} />)
  const evening = screen.getByRole('button', { name: /Вечерни/ })
  expect(evening).toBeEnabled()
  fireEvent.click(evening)
  expect(screen.getByRole('button', { name: 'Очаквайте скоро' })).toBeDisabled()
})
