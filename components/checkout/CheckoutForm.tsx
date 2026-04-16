'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/cartStore'

const FIELDS = [
  { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'Jane' },
  { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Smith' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'jane@example.com' },
  { id: 'address', label: 'Address', type: 'text', placeholder: '123 Main Street' },
  { id: 'city', label: 'City', type: 'text', placeholder: 'New York' },
  { id: 'postalCode', label: 'Postal Code', type: 'text', placeholder: '10001' },
  { id: 'country', label: 'Country', type: 'text', placeholder: 'United States' },
] as const

type FormData = Record<typeof FIELDS[number]['id'], string>

export default function CheckoutForm() {
  const clearCart = useCartStore(s => s.clearCart)
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', address: '', city: '', postalCode: '', country: '',
  })
  const [placed, setPlaced] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Order placed:', form)
    clearCart()
    setPlaced(true)
  }

  if (placed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center" aria-hidden="true">
          <span className="text-green-600 text-3xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold">Order Placed!</h2>
        <p className="text-brand-muted">Thank you for your order. We&apos;ll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2">Contact &amp; Shipping</h2>
      {FIELDS.map(field => (
        <div key={field.id}>
          <label htmlFor={field.id} className="block text-sm font-medium mb-1.5">{field.label}</label>
          <input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={form[field.id]}
            onChange={e => setForm(prev => ({ ...prev, [field.id]: e.target.value }))}
            required
            className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black"
          />
        </div>
      ))}
      <button
        type="submit"
        className="mt-4 w-full bg-brand-black text-white py-4 rounded-xl font-semibold hover:bg-neutral-800 transition-colors"
      >
        Place Order →
      </button>
    </form>
  )
}
