/** Fields that must match the open Stripe session. Editing any of them drops it. */
export function checkoutSessionSignature(input: {
  items: Array<{ productId: string; variantId: string; quantity: number; price: number }>
  appliedCode: string | null
  deliveryType: string
  deliveryId: string
  country: string
  paymentMethod: string
  name: string
  phone: string
  street: string
  office: string
}): string {
  return JSON.stringify({
    lines: input.items.map(item => [item.productId, item.variantId, item.quantity, item.price]),
    appliedCode: input.appliedCode,
    deliveryType: input.deliveryType,
    deliveryId: input.deliveryId,
    country: input.country,
    paymentMethod: input.paymentMethod,
    name: input.name,
    phone: input.phone,
    street: input.street,
    office: input.office,
  })
}
