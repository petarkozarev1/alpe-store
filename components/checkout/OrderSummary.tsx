'use client'
import { useCartStore } from '@/lib/store/cartStore'

export default function OrderSummary() {
  const { items, getSubtotal } = useCartStore()
  const subtotal = getSubtotal()

  return (
    <div className="bg-brand-gray-light rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="font-bold text-lg">Order Summary</h3>
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
            <span>{item.name} × {item.quantity}</span>
            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <hr className="border-brand-border" />
      <div className="flex justify-between text-sm text-brand-muted">
        <span>Shipping</span>
        <span>Free</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
    </div>
  )
}
