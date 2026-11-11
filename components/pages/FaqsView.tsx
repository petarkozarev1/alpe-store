'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { faqs, faqSectionContent, testimonialContent } from '@/lib/data/content'
import { translate } from '@/lib/i18n/translations'
import { localizedPath } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'

const filters = [
  { id: 'all', label: 'Всички' },
  { id: 'effect', label: 'Ефект' },
  { id: 'wear', label: 'Носене' },
  { id: 'color', label: 'Цветове' },
  { id: 'rx', label: 'Диоптър' },
] as const

const tags = ['effect', 'wear', 'color', 'rx'] as const

const related = [
  { href: '/certifications', label: 'Доказано', text: 'Лещите на AMPÉ са изпратени в независима лаборатория (AHD TMS) и тествани срещу три международни стандарта. Ето резултатите — без маркетинг, само числа.' },
  { href: '/lenses', label: 'Стъкла', text: 'Не всички очила за синя светлина са еднакви. Лещите на AMPÉ са тествани и сертифицирани в ЕС — не просто маркетинг.' },
  { href: '/science', label: 'Как работи', text: 'Синята светлина е реална. Умората е реална. Решението е просто — ако знаеш как работи.' },
]

export default function FaqsView({ locale }: { locale: Locale }) {
  const t = (value: string) => translate(locale, value)
  const href = (path: string) => localizedPath(path, locale)
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const [open, setOpen] = useState(0)

  return (
    <main className="bg-parchment text-iron">
      <section className="mx-auto grid max-w-content gap-8 px-6 pb-6 pt-28 md:px-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-stone">{t(faqSectionContent.badge)}</p>
          <h1 className="mt-4 whitespace-pre-line font-serif text-5xl leading-tight md:text-6xl">{t(faqSectionContent.headline)}</h1>
        </div>
        <svg viewBox="0 0 160 160" aria-hidden="true" className="h-36 w-36 text-gold">
          <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="80" y="104" textAnchor="middle" fontSize="84" fill="#7C3018" fontFamily="Georgia, serif">?</text>
        </svg>
      </section>

      <div className="sticky top-24 z-30 border-y border-iron/10 bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex max-w-content gap-2 overflow-x-auto px-6 py-3 md:px-10" role="tablist" aria-label={t('Филтър на въпросите')}>
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              onClick={() => {
                setFilter(item.id)
                const next = tags.findIndex(tag => item.id === 'all' || tag === item.id)
                setOpen(next)
              }}
              className={`rounded-full px-4 py-2 font-sans text-sm ${filter === item.id ? 'bg-onyx text-linen' : 'bg-sand text-iron'}`}
            >
              {t(item.label)}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto grid max-w-content gap-10 px-6 py-12 md:px-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const expanded = open === index
            const shown = filter === 'all' || tags[index] === filter
            return (
              <article key={faq.question} hidden={!shown} className="rounded-[24px] border border-iron/15 bg-cream">
                <h2>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <span className="font-serif text-xl text-iron">{t(faq.question)}</span>
                    <span aria-hidden="true" className="font-serif text-2xl text-gold">{expanded ? '–' : '+'}</span>
                  </button>
                </h2>
                <p hidden={!expanded} className="px-5 pb-5 font-sans text-sm leading-relaxed text-stone">{t(faq.answer)}</p>
              </article>
            )
          })}
          <p className="pt-6 font-sans text-sm text-stone">{t('Имате друг въпрос?')}</p>
          <Link href={href('/contact')} className="inline-block rounded-full bg-onyx px-8 py-3 font-sans text-sm text-linen">{t('Свържете се с нас')}</Link>
        </div>
        <aside className="h-fit rounded-[28px] bg-iron p-6 text-linen lg:sticky lg:top-44">
          <p className="font-sans text-[10px] uppercase tracking-widest text-gold">{t(testimonialContent.badge)}</p>
          <p className="mt-4 font-serif text-2xl leading-snug">„{t(testimonialContent.quote)}“</p>
          <p className="mt-4 font-sans text-xs text-linen/70">{t(testimonialContent.author)}</p>
          <div className="relative mt-5 h-36 overflow-hidden rounded-2xl">
            <Image src="/images/customers/06.jpg" alt={t(testimonialContent.author)} fill sizes="280px" className="object-cover" />
          </div>
        </aside>
      </section>

      <section className="mx-auto grid max-w-content gap-4 px-6 pb-20 md:px-10 md:grid-cols-3">
        {related.map((item) => (
          <Link key={item.href} href={href(item.href)} className="rounded-[28px] border border-iron/15 p-6 transition-colors hover:bg-sand/50">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t(item.label)}</p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-iron">{t(item.text)}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}
