import { render, screen } from '@testing-library/react'
import CheckoutSuccessPage from '@/app/checkout/success/page'

jest.mock('../components/analytics/PurchasePixelFire', () => ({
  __esModule: true,
  default: () => <div data-testid="purchase-pixel" />,
}))

jest.mock('../lib/stripe', () => ({
  getStripe: jest.fn(),
}))

test('shows COD as awaiting collection without firing the purchase pixel', async () => {
  const page = await CheckoutSuccessPage({
    searchParams: Promise.resolve({
      order_id: 'ALPE-order-1',
      payment: 'cod',
    }),
  })

  render(page)

  expect(screen.getByText('Плащането се извършва при получаване.'))
    .toBeInTheDocument()
  expect(screen.queryByTestId('purchase-pixel')).not.toBeInTheDocument()
})
