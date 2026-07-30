export interface CheckoutItemInput {
  productId: string
  variantId: string
  quantity: number
}

export type PaymentMethod = 'card' | 'cod'
export type OrderStatus = 'Awaiting payment' | 'Paid' | 'Cancelled'

export interface QuotedOrderItem extends CheckoutItemInput {
  name: string
  unitAmountCents: number
  pairsPerUnit: number
}

export interface OrderQuote {
  items: QuotedOrderItem[]
  subtotalCents: number
  discountCents: number
  shippingCents: number
  totalCents: number
  totalPairs: number
}
