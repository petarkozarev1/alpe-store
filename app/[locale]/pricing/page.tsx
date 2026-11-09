import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { localizeContent } from '@/components/i18n/LocalizedContent'
import Link from 'next/link'
import { createLocalizedPageMetadata } from '@/lib/seo'
import { getPricingSnapshot } from '@/lib/sale'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return createLocalizedPageMetadata(params.locale, {
  title: 'Цени',
  description: 'Прозрачни цени без изненади. Очила за синя и зелена светлина AMPÉ от €59.99.',
  path: '/pricing',
  })
}

export default function PricingPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const pricing = getPricingSnapshot()
  const doubleOnSale = pricing.double < pricing.regularDouble
  const tiers = [
    {
      name: '1 чифт',
      price: `€${pricing.single.toFixed(2)}`,
      originalPrice: null as string | null,
      hint: pricing.promo ? `Код ${pricing.promo.code}: €${pricing.promo.singlePairPrice.toFixed(2)}` : null,
      badge: null as string | null,
      description: 'Един чифт AMPÉ очила по твой избор — дневни или вечерни стъкла.',
      features: ['Избор: дневни или вечерни стъкла', 'UV400 + антирефлексно покритие', 'Филтър синя и зелена светлина', 'Доставка €4.99'],
      highlight: false,
    },
    {
      name: '2 чифта',
      price: `€${pricing.double.toFixed(2)}`,
      originalPrice: doubleOnSale ? `€${pricing.regularDouble.toFixed(2)}` : null,
      hint: doubleOnSale ? 'Вторият чифт на половин цена' : null,
      badge: 'Най-популярни',
      description: 'Дневни + вечерни стъкла. Пълна защита от сутринта до лягане.',
      features: ['Дневни + вечерни стъкла', 'UV400 + антирефлексно покритие', 'Филтър синя и зелена светлина', 'Безплатна доставка'],
      highlight: true,
    },
  ]
  return localizeContent(params.locale, (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">Прозрачни цени</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          Без скрити такси.<br />Без изненади.
        </h1>
        <p className="font-sans text-base text-stone max-w-xl leading-relaxed mb-12">
          Един чифт или два. Ясни цени. Безплатна доставка за 2 или повече чифта.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-3xl">
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
                {tier.hint && (
                  <p className={`font-sans text-xs mt-2 ${tier.highlight ? 'text-linen/80' : 'text-iron'}`}>{tier.hint}</p>
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
          Безплатна доставка за 2+ чифта · EU сертифицирани стъкла
        </p>
      </section>
    </main>
  ))
}
