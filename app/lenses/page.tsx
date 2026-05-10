import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Стъкла | ALPÉ',
  description: 'Дневни и вечерни лещи за синя светлина. EU сертифицирани. Блокират до 99% от синята светлина.',
}

export default function LensesPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">✓ EU сертифицирана технология</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          Стъклата, които правят<br />разликата.
        </h1>
        <p className="font-sans text-base text-stone max-w-xl leading-relaxed mb-12">
          Не всички очила за синя светлина са еднакви. Лещите на ALPÉ са тествани и сертифицирани в ЕС — не просто маркетинг.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-sand/40 rounded-2xl p-8 flex flex-col gap-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">За работния ден</span>
            <h2 className="font-serif text-2xl text-iron">Дневни стъкла</h2>
            <p className="font-sans text-sm text-stone leading-relaxed">
              Лек жълтеникав оттенък, почти незабележим. Блокират 65% от синята и зелената светлина. Достатъчно, за да не болят очите до 17:00.
            </p>
            <ul className="flex flex-col gap-2 mt-2">
              {['65% блокиране на синя светлина', 'Частичен филтър за зелена светлина', 'Антирефлексно покритие', 'UV400 защита', 'Устойчиви на драскотини'].map(f => (
                <li key={f} className="font-sans text-xs text-stone flex items-center gap-2">
                  <span className="text-gold">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-iron rounded-2xl p-8 flex flex-col gap-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">За вечерта</span>
            <h2 className="font-serif text-2xl text-linen">Вечерни стъкла</h2>
            <p className="font-sans text-sm text-stone leading-relaxed">
              По-силен оранжев филтър. Блокират 98% от синята и зелената светлина. Тялото ти знае, че е края на деня и заспиваш без усилие.
            </p>
            <ul className="flex flex-col gap-2 mt-2">
              {['98% блокиране на синя светлина', '98% блокиране на зелена светлина (500–560nm)', 'Максимален мелатонинов ефект', 'UV400 защита', 'Лека рамка'].map(f => (
                <li key={f} className="font-sans text-xs text-stone flex items-center gap-2">
                  <span className="text-gold">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block font-sans text-sm bg-onyx text-linen px-8 py-3 rounded-full hover:bg-iron transition-colors"
          >
            Вземи си чифт →
          </Link>
          <p className="font-sans text-xs text-stone/60 mt-4">Безплатна доставка над €50</p>
        </div>
      </section>
    </main>
  )
}
