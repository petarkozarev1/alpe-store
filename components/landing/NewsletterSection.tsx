'use client'
import { useState } from 'react'
import { fireTrackedEvent } from '@/components/analytics/MetaPixel'
import type { Locale } from '@/lib/i18n/config'
import { translate } from '@/lib/i18n/translations'
import { localizedPath } from '@/lib/i18n/routing'

export default function NewsletterSection({ locale }: { locale: Locale }) {
  const t = (source: string) => translate(locale, source)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    try {
      fireTrackedEvent('Lead', {
        data: { content_name: 'newsletter_signup' },
        email,
      })
    } catch { /* never break UI */ }
  }

  return (
    <section className="w-full bg-onyx px-6 md:px-10 py-20">
      <div className="max-w-content mx-auto flex flex-col items-center text-center gap-6">

        <span className="font-sans text-[10px] uppercase tracking-widest text-stone">
          {t('Бъди в течение')}
        </span>

        <h2 className="font-serif text-[clamp(28px,5vw,52px)] text-linen font-medium leading-tight max-w-2xl">
          {t('Съвети за сън, ръководство за стъкла и')}{' '}
          <em className="text-gold not-italic italic">{t('ранен достъп.')}</em>
        </h2>

        <p className="font-sans text-sm text-stone max-w-md leading-relaxed">
          {t('Без излишна информация. Само полезни неща — директно в пощенската ти кутия, веднъж месечно.')}
        </p>

        {submitted ? (
          <p className="font-sans text-sm text-gold mt-2">{t('Благодарим! Ще те чуем скоро.')}</p>
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
              placeholder={t('Твоят имейл адрес')}
              className="flex-1 bg-transparent border border-stone/30 rounded-lg px-5 py-3.5 font-sans text-sm text-linen placeholder:text-stone/50 focus:outline-none focus:border-stone/60 transition-colors"
            />
            <button
              type="submit"
              className="bg-linen text-onyx font-sans font-medium text-sm px-7 py-3.5 rounded-lg hover:bg-parchment transition-colors whitespace-nowrap"
            >
              {t('Абонирай се')}
            </button>
          </form>
        )}

        <p className="font-sans text-[11px] text-stone/50">
          {t('С абонамента давате съгласие за получаване на маркетингови имейли от ALPÉ. Отпишете се по всяко време с едно кликване. Вижте нашата')}{' '}
          <a href={localizedPath('/privacy', locale)} className="underline underline-offset-2 hover:text-stone transition-colors">{t('Политика за поверителност')}</a>.
        </p>

      </div>
    </section>
  )
}
