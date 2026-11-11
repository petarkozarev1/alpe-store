'use client'

import { useEffect, useState } from 'react'
import { translate } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/i18n/config'

export default function SectionNav({
  locale,
  label,
  items,
}: {
  locale: Locale
  label: string
  items: { id: string; label: string }[]
}) {
  const [active, setActive] = useState(items[0]?.id ?? '')
  const t = (value: string) => translate(locale, value)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const nodes = items
      .map(item => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node))
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) setActive(visible.target.id)
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0.15, 0.4, 0.7] })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav aria-label={t(label)} className="sticky top-28 z-30 mb-8 lg:mb-0">
      <ol className="flex gap-2 overflow-x-auto bg-parchment/90 py-2 backdrop-blur lg:flex-col lg:overflow-visible lg:bg-transparent lg:py-0">
        {items.map((item, index) => {
          const current = active === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? 'true' : undefined}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 font-sans text-xs transition-colors ${
                  current ? 'bg-onyx text-linen' : 'text-iron hover:bg-sand'
                }`}
              >
                <span className="font-serif text-sm text-gold">{String(index + 1).padStart(2, '0')}</span>
                {t(item.label)}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
