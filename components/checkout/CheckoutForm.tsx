'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/cartStore'

const FIELDS = [
  { id: 'firstName',  label: 'Име',            type: 'text',  placeholder: 'Иван' },
  { id: 'lastName',   label: 'Фамилия',         type: 'text',  placeholder: 'Иванов' },
  { id: 'email',      label: 'Имейл',           type: 'email', placeholder: 'ivan@example.com' },
  { id: 'phone',      label: 'Телефон',         type: 'tel',   placeholder: '+359 88 123 4567' },
  { id: 'address',    label: 'Адрес',           type: 'text',  placeholder: 'ул. Витоша 1' },
  { id: 'city',       label: 'Град',            type: 'text',  placeholder: 'София' },
  { id: 'postalCode', label: 'Пощенски код',    type: 'text',  placeholder: '1000' },
  { id: 'country',    label: 'Държава',         type: 'text',  placeholder: 'България' },
] as const

type FormData = Record<typeof FIELDS[number]['id'], string>

export default function CheckoutForm() {
  const items = useCartStore(s => s.items)
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '', country: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!items.length) {
      setError('Количката ти е празна. Добави продукт преди да поръчаш.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            name: `${i.name} — ${i.variantLabel}`,
            price: i.price,
            quantity: i.quantity,
            image: i.image.startsWith('/')
              ? `${process.env.NEXT_PUBLIC_SITE_URL}${i.image}`
              : i.image,
          })),
          email: form.email,
          shipping: {
            name: `${form.firstName} ${form.lastName}`,
            phone: form.phone,
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
            country: form.country,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Грешка при свързване с платежната система')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при плащане. Моля опитай отново.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2">Данни за доставка</h2>
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
            className="w-full border border-iron/40 rounded-xl px-4 py-3 text-sm bg-parchment focus:outline-none focus:ring-2 focus:ring-onyx"
          />
        </div>
      ))}
      {error && (
        <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-onyx text-linen py-4 rounded-xl font-semibold hover:bg-iron transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Пренасочване към плащане...' : 'Към плащане →'}
      </button>
    </form>
  )
}
