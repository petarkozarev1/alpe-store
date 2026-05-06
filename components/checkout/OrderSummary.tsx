'use client'
import { useCartStore } from '@/lib/store/cartStore'

export default function OrderSummary() {
  const { items, getSubtotal } = useCartStore()
  const subtotal = getSubtotal()

  return (
    <div className="bg-iron rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="font-bold text-lg">Обобщение на поръчката</h3>
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
            <span>{item.name} × {item.quantity}</span>
            <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <hr className="border-iron" />
      <div className="flex justify-between text-sm text-stone">
        <span>Доставка</span>
        <span>Безплатна</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Общо</span>
        <span>€{subtotal.toFixed(2)}</span>
      </div>
    </div>
  )
}
