'use client'
import { useState } from 'react'
import { firePixelCustomEvent } from '@/components/analytics/MetaPixel'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    try {
      firePixelCustomEvent('NewsletterSignup', {
        content_name: 'newsletter_signup',
      })
    } catch { /* never break UI */ }
  }

  return (
    <section className="w-full bg-onyx px-6 md:px-10 py-20">
      <div className="max-w-content mx-auto flex flex-col items-center text-center gap-6">

        <span className="font-sans text-[10px] uppercase tracking-widest text-stone">
          Бъди в течение
        </span>

        <h2 className="font-serif text-[clamp(28px,5vw,52px)] text-linen font-medium leading-tight max-w-2xl">
          Съвети за сън, ръководство за стъкла и{' '}
          <em className="text-gold not-italic italic">ранен достъп.</em>
        </h2>

        <p className="font-sans text-sm text-stone max-w-md leading-relaxed">
          Без излишна информация. Само полезни неща — директно в пощенската ти кутия, веднъж месечно.
        </p>

        {submitted ? (
          <p className="font-sans text-sm text-gold mt-2">Благодарим! Ще те чуем скоро.</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Твоят имейл адрес"
              className="flex-1 bg-transparent border border-stone/30 rounded-lg px-5 py-3.5 font-sans text-sm text-linen placeholder:text-stone/50 focus:outline-none focus:border-stone/60 transition-colors"
            />
            <button
              type="submit"
              className="bg-linen text-onyx font-sans font-medium text-sm px-7 py-3.5 rounded-lg hover:bg-parchment transition-colors whitespace-nowrap"
            >
              Абонирай се
            </button>
          </form>
        )}

        <p className="font-sans text-[11px] text-stone/50">
          С абонамента давате съгласие за получаване на маркетингови имейли от ALPÉ. Отпишете се по всяко време с едно кликване. Вижте нашата{' '}
          <a href="/privacy" className="underline underline-offset-2 hover:text-stone transition-colors">Политика за поверителност</a>.
        </p>

      </div>
    </section>
  )
}
