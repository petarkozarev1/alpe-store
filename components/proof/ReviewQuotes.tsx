'use client'

import { DRAFT_REVIEWS, reviewProductLabel, type DraftReview } from '@/lib/reviews'

function Quote({ review, locale }: { review: DraftReview; locale: 'bg' | 'en' }) {
  return (
    <figure className="rounded-2xl border border-iron/10 bg-cream px-4 py-4">
      <div className="text-sm tracking-wide text-gold" aria-label={locale === 'en' ? '5 stars' : '5 звезди'}>★★★★★</div>
      <blockquote className="mt-2 font-serif text-base italic leading-snug text-iron">
        {locale === 'en' ? review.en : review.bg}
      </blockquote>
      <figcaption className="mt-3 font-sans text-xs text-stone">
        <span className="font-semibold text-iron">{review.name}</span>
        {' · '}{review.city}{' · '}{reviewProductLabel(review.product, locale)}
      </figcaption>
    </figure>
  )
}

export function ReviewQuotes({ locale = 'bg', limit = 3 }: { locale?: string; limit?: number }) {
  const lang = locale === 'en' ? 'en' : 'bg'
  return (
    <div className="grid gap-3">
      {DRAFT_REVIEWS.slice(0, limit).map(review => (
        <Quote key={review.id} review={review} locale={lang} />
      ))}
    </div>
  )
}

export function ReviewSection({ locale = 'bg' }: { locale?: string }) {
  const lang = locale === 'en' ? 'en' : 'bg'
  return (
    <section className="bg-parchment py-14 md:py-20">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-gold">1000+</p>
        <h2 className="mt-2 font-serif text-3xl text-iron md:text-4xl">
          {lang === 'en' ? 'What customers say' : 'Какво казват клиентите'}
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {DRAFT_REVIEWS.map(review => (
            <Quote key={review.id} review={review} locale={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}
