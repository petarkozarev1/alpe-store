import { checkoutSessionSignature } from '@/lib/checkout-session'

const base = {
  items: [{ productId: 'AMPÉ-daily', variantId: 'AMPÉ-daily-bundle-1', quantity: 1, price: 59.99 }],
  appliedCode: null as string | null,
  deliveryType: 'office',
  deliveryId: 'pigeon',
  country: 'България',
  paymentMethod: 'card',
  name: 'Иван Иванов',
  phone: '+359881234567',
  street: 'ул. Витоша 1',
  office: 'Pigeon НДК',
}

describe('checkout session signature', () => {
  it('changes when the name, phone, street, or office changes', () => {
    const signed = checkoutSessionSignature(base)
    expect(checkoutSessionSignature({ ...base, name: 'Мария Иванова' })).not.toBe(signed)
    expect(checkoutSessionSignature({ ...base, phone: '+359888888888' })).not.toBe(signed)
    expect(checkoutSessionSignature({ ...base, street: 'ул. Шипка 5' })).not.toBe(signed)
    expect(checkoutSessionSignature({ ...base, office: 'Спиди Сердика' })).not.toBe(signed)
    expect(checkoutSessionSignature(base)).toBe(signed)
  })
})
