import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Медии | ALPÉ',
  description: 'Медийна информация за ALPÉ. Лого, факти, и контакт за журналисти.',
}

const brandFacts = [
  'ALPÉ е Bulgarian бранд за очила за синя светлина, основан 2025 г.',
  'Над 1000 клиенти в България.',
  'EU сертифицирани лещи (EN ISO 12312).',
  'Лещите блокират до 99% от вредната синя светлина.',
  '7-нощна гаранция за връщане без въпроси.',
  'Безплатна доставка за поръчки над €50.',
]

export default function PressPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">За медиите</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          Медийна информация
        </h1>
        <p className="font-sans text-base text-stone max-w-xl leading-relaxed mb-12">
          Ако пишете за ALPÉ, ето всичко, което ви трябва. За допълнителни материали — свържете се с нас.
        </p>

        <div className="grid md:grid-cols-2 gap-12 max-w-3xl">
          <div>
            <h2 className="font-serif text-xl text-iron mb-4">Ключови факти</h2>
            <ul className="flex flex-col gap-3">
              {brandFacts.map(f => (
                <li key={f} className="font-sans text-sm text-stone flex items-start gap-2">
                  <span className="text-gold mt-0.5">·</span> {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl text-iron mb-4">Контакт за медии</h2>
            <div className="flex flex-col gap-4 font-sans text-sm text-stone">
              <div>
                <p className="text-stone/60 text-xs uppercase tracking-widest mb-1">Имейл</p>
                <a href="mailto:press@alpe.bg" className="text-iron hover:text-gold transition-colors">
                  press@alpe.bg
                </a>
              </div>
              <div>
                <p className="text-stone/60 text-xs uppercase tracking-widest mb-1">Лого и материали</p>
                <p>Изпратете имейл и ще ви изпратим пълния медиен пакет в рамките на 24 часа.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
