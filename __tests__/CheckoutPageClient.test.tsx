import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckoutPageClient from '@/components/checkout/CheckoutPageClient'
import { useCartStore } from '@/lib/store/cartStore'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    fill: _fill,
    sizes: _sizes,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean
    sizes?: string
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ''} />
  ),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const cartItem = {
  productId: 'ALPÉ-evening',
  variantId: 'ALPÉ-evening-bundle-1',
  name: 'ALPÉ',
  variantLabel: 'Вечер · 1 чифт',
  price: 44.99,
  quantity: 1,
  image: '/images/shop/shop-evening-1.png',
  slug: 'ALPÉ-glasses',
}

beforeEach(() => {
  useCartStore.setState({ items: [cartItem] })
  jest.restoreAllMocks()
})

test('shows normal pricing and promo input for a P2G visitor', () => {
  render(<CheckoutPageClient />)

  expect(screen.queryByText(/P2G отстъпка/)).not.toBeInTheDocument()
  expect(screen.getByPlaceholderText('Код за отстъпка')).toBeInTheDocument()
  expect(screen.getByText('€49.98', { exact: false })).toBeInTheDocument()
  expect(screen.getByRole('radio', { name: /^Карта/ })).toBeChecked()
  expect(screen.getByRole('radio', { name: /^Наложен платеж/ })).not.toBeChecked()
})

test('submits product identifiers and COD without browser prices', async () => {
  const user = userEvent.setup()
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      paymentMethod: 'cod',
      orderId: 'ALPE-order-1',
      url: '#cod-success',
    }),
  })
  global.fetch = fetchMock
  render(<CheckoutPageClient />)

  await user.type(screen.getByPlaceholderText('имейл@example.com'), 'test@example.com')
  await user.type(screen.getByPlaceholderText('Иван'), 'Test')
  await user.type(screen.getByPlaceholderText('Иванов'), 'Customer')
  await user.type(screen.getByPlaceholderText('+359 88 123 4567'), '+359881234567')
  await user.type(screen.getByPlaceholderText('София'), 'Sofia')
  await user.type(screen.getByPlaceholderText('ул. Витоша 1, ет. 3'), 'Test address 1')
  await user.type(screen.getByPlaceholderText('1000'), '1000')
  await user.click(screen.getByRole('radio', { name: /^Наложен платеж/ }))
  await user.click(screen.getByRole('button', { name: /Потвърди поръчка/i }))

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
  const [, request] = fetchMock.mock.calls[0]
  const body = JSON.parse(String(request?.body))

  expect(body.paymentMethod).toBe('cod')
  expect(body.items).toEqual([{
    productId: 'ALPÉ-evening',
    variantId: 'ALPÉ-evening-bundle-1',
    quantity: 1,
  }])
  expect(body.items[0]).not.toHaveProperty('price')
  expect(body).not.toHaveProperty('discount')
})
