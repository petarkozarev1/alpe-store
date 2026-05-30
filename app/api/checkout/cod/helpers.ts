export interface CodProduct { name: string; variantLabel: string; price: number; quantity: number; image?: string }

export function computeCodTotal(o: { items: CodProduct[]; discountAmount: number; shippingAmount: number; codFee: number }): number {
  const subtotal = o.items.reduce((s, i) => s + i.price * i.quantity, 0)
  return +(subtotal - o.discountAmount + o.shippingAmount + o.codFee).toFixed(2)
}

export function makeCodOrderId(): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `cod-${Date.now()}-${rand}`
}
