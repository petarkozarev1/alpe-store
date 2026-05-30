import { buildOrderEmailHtml, type OrderEmailModel } from '@/lib/email'

const codModel: OrderEmailModel = {
  orderRef: 'cod-1748567640-AX72',
  paymentMethod: 'cod',
  customerFirstName: 'Иван',
  productRows: [{ label: 'ALPÉ', sublabel: '🟠 Вечер · 2 чифта', amount: 66.99 }],
  subtotal: 66.99,
  discount: { code: 'WELCOME10', amount: 6.7 },
  shippingLabel: 'Спиди',
  shippingAmount: 0,
  codFee: 1,
  total: 61.29,
  deliveryTo: { name: 'Иван Иванов', line: 'Спиди офис Сердика, София', phone: '+359 88 123 4567' },
}

describe('buildOrderEmailHtml', () => {
  it('renders product rows, discount, COD fee and total', () => {
    const html = buildOrderEmailHtml(codModel)
    expect(html).toContain('ALPÉ')
    expect(html).toContain('🟠 Вечер · 2 чифта')
    expect(html).toContain('WELCOME10')
    expect(html).toContain('−€6.70')
    expect(html).toContain('Наложен платеж')
    expect(html).toContain('€61.29')
    expect(html).toContain('119.88 лв.')
    expect(html).toContain('cod-1748567640-AX72')
    expect(html).toContain('Иван Иванов')
  })

  it('omits the COD-fee row for card orders and shows free shipping', () => {
    const html = buildOrderEmailHtml({ ...codModel, paymentMethod: 'card', codFee: undefined })
    expect(html).not.toContain('Наложен платеж')
    expect(html).toContain('Безплатна')
  })
})
