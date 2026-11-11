'use client'

import Link from 'next/link'
import { useState } from 'react'
import { infoFaqGroups, infoFaqs } from '@/lib/data/info-faqs'
import { getPricingSnapshot } from '@/lib/sale'
import { translate } from '@/lib/i18n/translations'
import { localizedPath } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'

export default function FaqsView({ locale }: { locale: Locale }) {
  const t = (value: string) => translate(locale, value)
  const href = (path: string) => localizedPath(path, locale)
  const [group, setGroup] = useState<(typeof infoFaqGroups)[number]['id']>('all')
  const [open, setOpen] = useState(infoFaqs[0].question)
  const pricing = getPricingSnapshot()

  const livePrice = pricing.promo
    ? `${t('В момента в лентата:')} ${pricing.promo.code}, −${pricing.promo.percent}% ${t('за 1 чифт')} (€${pricing.promo.singlePairPrice.toFixed(2)}). ${t('Два чифта')} €${pricing.double.toFixed(2)}.`
    : t('В момента няма обявен период с публичен код. Два чифта са €119.98.')

  const shown = infoFaqs.filter((item) => group === 'all' || item.group === group)

  return (
    <main className="bg-parchment text-iron">
      <section className="mx-auto max-w-content px-6 pb-6 pt-28 md:px-10">
        <p className="font-sans text-xs uppercase tracking-widest text-stone">{t('Често задавани въпроси')}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-tight md:text-6xl">{t('Въпроси, с отговорите от сайта.')}</h1>
        <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-stone">
          {t('Отговорите повтарят публикуваните числа, цени и условия. Очилата не са медицинско изделие.')}
        </p>
        <div className="mt-6 flex flex-wrap gap-4 font-sans text-sm">
          <Link href={href('/certifications')} className="underline decoration-gold underline-offset-4">{t('Доказано')}</Link>
          <Link href={href('/lenses')} className="underline decoration-gold underline-offset-4">{t('Стъкла')}</Link>
          <Link href={href('/terms')} className="underline decoration-gold underline-offset-4">{t('Условия')}</Link>
          <Link href={href('/returns')} className="underline decoration-gold underline-offset-4">{t('Връщане')}</Link>
        </div>
      </section>

      <div className="sticky top-24 z-30 border-y border-iron/10 bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex max-w-content px-6 py-3 md:px-10">
          <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label={t('Филтър на въпросите')}>
            {infoFaqGroups.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={group === item.id}
                onClick={() => setGroup(item.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-sans text-sm ${group === item.id ? 'bg-onyx text-linen' : 'bg-sand text-iron'}`}
              >
                {t(item.label)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-content space-y-3 px-6 py-10 md:px-10">
        {shown.map((item) => {
          const expanded = open === item.question
          const answer = item.question.startsWith('Колко струва') ? `${t(item.answer)} ${livePrice}` : t(item.answer)
          return (
            <article key={item.question} className="rounded-[24px] border border-iron/15 bg-cream">
              <h2>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? '' : item.question)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-serif text-xl"
                >
                  {t(item.question)}
                  <span aria-hidden="true" className="font-sans text-stone">{expanded ? '–' : '+'}</span>
                </button>
              </h2>
              {expanded && <p className="px-5 pb-5 font-sans text-sm leading-relaxed text-stone">{answer}</p>}
            </article>
          )
        })}
      </section>
    </main>
  )
}
