import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Рамки | ALPÉ',
  description: 'Леки и издръжливи рамки за очила ALPÉ. Classic и Pro модели за всеки стил.',
}

export default function FramesPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">Дизайн + функция</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          Слагаш ги и<br />забравяш за тях.
        </h1>
        <p className="font-sans text-base text-stone max-w-xl leading-relaxed mb-12">
          Рамките на ALPÉ са проектирани да изчезват — така светло, че спираш да ги усещаш след първите 10 минути.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="border border-iron/20 rounded-2xl p-8 flex flex-col gap-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">Класика</span>
            <h2 className="font-serif text-2xl text-iron">Classic</h2>
            <p className="font-serif text-3xl text-iron">€40</p>
            <p className="font-sans text-sm text-stone leading-relaxed">
              Минималистична правоъгълна рамка. Подхожда на всеки. Перфектна за офис и ежедневие.
            </p>
            <ul className="flex flex-col gap-2 mt-2">
              {['Лека TR90 пластмаса', 'Пружинни панти', 'Универсален размер', 'Черен, кестеняв, прозрачен'].map(f => (
                <li key={f} className="font-sans text-xs text-stone flex items-center gap-2">
                  <span className="text-gold">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-iron rounded-2xl p-8 flex flex-col gap-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">Премиум</span>
            <h2 className="font-serif text-2xl text-linen">Pro</h2>
            <p className="font-serif text-3xl text-linen">€79</p>
            <p className="font-sans text-sm text-stone leading-relaxed">
              По-широка рамка, метални детайли, по-дебел филтър. За тези, които прекарват 10+ часа пред екран.
            </p>
            <ul className="flex flex-col gap-2 mt-2">
              {['Титаниев сплав + TR90', 'Регулируеми накрайници', 'Широко зрително поле', 'Черен, сребрист, златист'].map(f => (
                <li key={f} className="font-sans text-xs text-stone flex items-center gap-2">
                  <span className="text-gold">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/#products"
            className="inline-block font-sans text-sm bg-onyx text-linen px-8 py-3 rounded-full hover:bg-iron transition-colors"
          >
            Вземи си чифт →
          </Link>
          <p className="font-sans text-xs text-stone/60 mt-4">7 нощи проба · Безплатна доставка над €50</p>
        </div>
      </section>
    </main>
  )
}
