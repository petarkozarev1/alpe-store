export type P2GPaymentStatus = 'Awaiting payment' | 'Paid' | 'Cancelled'

export interface P2GOrder {
  pageId: string
  orderId: string
  paymentMethod: 'card' | 'cod'
  paymentStatus: P2GPaymentStatus
  affiliateId?: string
  paidAmountCents: number
  p2gReported: boolean
  paidAt?: string
}
