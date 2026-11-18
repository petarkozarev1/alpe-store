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
  const [code] = useState('NEWSLETTER10')

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
      <div className="max-w-content mx-auto flex flex-col items-center text-center gap-5">

        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold">
          {t('Абонирай се за новините')}
        </span>

        <h2 className="font-serif text-[clamp(28px,4.5vw,48px)] text-linen font-medium leading-tight max-w-xl">
          {t('Получи 10% отстъпка')}{' '}
          <em className="text-gold not-italic italic">{t('за първата поръчка.')}</em>
        </h2>

        <p className="font-sans text-sm text-stone max-w-md leading-relaxed">
          {t('Абонирай се за списъка и ще получиш еднократен код за 10% отстъпка.')}
        </p>
        <p className="font-sans text-[10px] text-stone/35 max-w-sm leading-snug">
          {t('Кодът не се комбинира с активни промоции.')}
        </p>

        {submitted ? (
          <div className="mt-2 flex flex-col items-center gap-3">
            <p className="font-sans text-sm text-linen">{t('Готово! Ето твоят код:')}</p>
            <div className="rounded-lg border border-gold/40 bg-gold/10 px-6 py-3">
              <span className="font-mono text-lg tracking-wider text-gold">{code}</span>
            </div>
            <p className="font-sans text-xs text-stone max-w-xs">
              {t('Валиден за 1 или 2 чифта, ако няма по-голяма отстъпка. Не се комбинира с други промоции.')}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-1"
          >
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('Твоят имейл адрес')}
              className="flex-1 bg-transparent border border-stone/30 rounded-lg px-5 py-3.5 font-sans text-sm text-linen placeholder:text-stone/50 focus:outline-none focus:border-gold/50 transition-colors"
            />
            <button
              type="submit"
              className="bg-linen text-onyx font-sans font-medium text-sm px-7 py-3.5 rounded-lg hover:bg-parchment transition-colors whitespace-nowrap"
            >
              {t('Абонирай се')}
            </button>
          </form>
        )}

        <p className="font-sans text-[11px] text-stone/40 max-w-md">
          {t('С абонамента давате съгласие за получаване на маркетингови имейли от AMPÉ. Отпишете се по всяко време. Вижте нашата')}{' '}
          <a href={localizedPath('/privacy', locale)} className="underline underline-offset-2 hover:text-stone transition-colors">{t('Политика за поверителност')}</a>.
        </p>

      </div>
    </section>
  )
}
