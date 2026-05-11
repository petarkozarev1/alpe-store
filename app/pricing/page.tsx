import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Цени | ALPÉ',
  description: 'Прозрачни цени без изненади. Очила за синя и зелена светлина ALPÉ от €44.99.',
}

const tiers = [
  {
    name: '1 чифт',
    price: '€44.99',
    originalPrice: null,
    saving: null,
    badge: null,
    description: 'Един чифт ALPÉ очила по твой избор — дневни или вечерни стъкла.',
    features: ['Избор: дневни или вечерни стъкла', 'UV400 + антирефлексно покритие', 'Филтър синя и зелена светлина'],
    highlight: false,
  },
  {
    name: '2 чифта',
    price: '€66.99',
    originalPrice: '€89.98',
    saving: '€23',
    badge: 'Най-популярни',
    description: 'Дневни + вечерни стъкла. Пълна защита от сутринта до лягане.',
    features: ['Дневни + вечерни стъкла', 'UV400 + антирефлексно покритие', 'Филтър синя и зелена светлина', 'Спестяваш €23'],
    highlight: true,
  },
  {
    name: '3 чифта',
    price: '€89.99',
    originalPrice: '€134.97',
    saving: '€45',
    badge: 'Най-изгодно',
    description: 'За целото семейство или офис. Максимална защита на най-добра цена.',
    features: ['3 чифта по избор', 'UV400 + антирефлексно покритие', 'Филтър синя и зелена светлина', 'Спестяваш €45'],
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
          Три варианта. Ясни цени. Безплатна доставка над €50.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {tiers.map(tier => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 flex flex-col gap-4 ${tier.highlight ? 'bg-iron text-linen' : 'border border-iron/20'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`font-sans text-[10px] uppercase tracking-widest ${tier.highlight ? 'text-linen/65' : 'text-stone/75'}`}>{tier.name}</span>
                {tier.badge && (
                  <span className={`font-sans text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${tier.highlight ? 'bg-linen/20 text-linen' : 'bg-onyx text-linen'}`}>
                    {tier.badge}
                  </span>
                )}
              </div>
              <div>
                <p className={`font-serif text-4xl ${tier.highlight ? 'text-linen' : 'text-iron'}`}>{tier.price}</p>
                {tier.originalPrice && (
                  <p className="font-sans text-xs text-stone/65 mt-1">поотделно: {tier.originalPrice}</p>
                )}
              </div>
              <p className={`font-sans text-sm leading-relaxed ${tier.highlight ? 'text-linen/80' : 'text-stone'}`}>
                {tier.description}
              </p>
              <ul className="flex flex-col gap-2 flex-1">
                {tier.features.map(f => (
                  <li key={f} className={`font-sans text-xs flex items-center gap-2 ${tier.highlight ? 'text-linen/80' : 'text-stone'}`}>
                    <span className="text-gold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/shop"
                className={`inline-block text-center font-sans text-sm px-6 py-3 rounded-full transition-colors mt-4 ${
                  tier.highlight
                    ? 'bg-linen text-onyx hover:bg-parchment'
                    : 'bg-onyx text-linen hover:bg-iron'
                }`}
              >
                Вземи си чифт →
              </Link>
            </div>
          ))}
        </div>

        <p className="font-sans text-xs text-stone/70 text-center">
          Безплатна доставка над €50 · EU сертифицирани стъкла
        </p>
      </section>
    </main>
  )
}
