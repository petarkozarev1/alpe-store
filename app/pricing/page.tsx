import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Цени | ALPÉ',
  description: 'Прозрачни цени без изненади. Очила за синя светлина ALPÉ от €40.',
}

const tiers = [
  {
    name: 'Classic Дневни',
    price: '€40',
    description: 'Правоъгълна рамка, дневни лещи (65% блокиране). Идеални за офиса.',
    features: ['Дневни лещи', 'Classic рамка', 'UV400 + антирефлекс', '7 нощи проба'],
    cta: 'Вземи си чифт →',
    highlight: false,
  },
  {
    name: 'Classic Вечерни',
    price: '€60',
    description: 'Правоъгълна рамка, вечерни лещи (98% блокиране). За по-добър сън.',
    features: ['Вечерни лещи', 'Classic рамка', 'UV400 + антирефлекс', '7 нощи проба'],
    cta: 'Вземи си чифт →',
    highlight: true,
  },
  {
    name: 'Pro Комбо',
    price: '€80',
    description: 'Pro рамка с дневни и вечерни лещи. Пълна защита 24/7.',
    features: ['Дневни + Вечерни лещи', 'Pro рамка', 'UV400 + антирефлекс', '7 нощи проба'],
    cta: 'Вземи си чифт →',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">Прозрачни цени</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          Без скрити такси.<br />Без изненади.
        </h1>
        <p className="font-sans text-base text-stone max-w-xl leading-relaxed mb-12">
          Три варианта. Ясни цени. Безплатна доставка над €50 и 7 нощи проба без риск.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {tiers.map(tier => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 flex flex-col gap-4 ${tier.highlight ? 'bg-iron text-linen' : 'border border-iron/20'}`}
            >
              <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">{tier.name}</span>
              <p className={`font-serif text-4xl ${tier.highlight ? 'text-linen' : 'text-iron'}`}>{tier.price}</p>
              <p className="font-sans text-sm leading-relaxed text-stone">
                {tier.description}
              </p>
              <ul className="flex flex-col gap-2 flex-1">
                {tier.features.map(f => (
                  <li key={f} className="font-sans text-xs text-stone flex items-center gap-2">
                    <span className="text-gold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/#products"
                className={`inline-block text-center font-sans text-sm px-6 py-3 rounded-full transition-colors mt-4 ${
                  tier.highlight
                    ? 'bg-linen text-onyx hover:bg-parchment'
                    : 'bg-onyx text-linen hover:bg-iron'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="font-sans text-xs text-stone/60 text-center">
          Безплатна доставка над €50 · 7 нощи проба · EU сертифицирани лещи
        </p>
      </section>
    </main>
  )
}
