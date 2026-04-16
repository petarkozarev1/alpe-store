import CheckoutForm from '@/components/checkout/CheckoutForm'
import OrderSummary from '@/components/checkout/OrderSummary'

export const metadata = { title: 'Checkout — Raydiant' }

export default function CheckoutPage() {
  return (
    <div className="max-w-content mx-auto px-6 md:px-10 py-16">
      <h1 className="text-3xl font-bold mb-12">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <CheckoutForm />
        <OrderSummary />
      </div>
    </div>
  )
}
