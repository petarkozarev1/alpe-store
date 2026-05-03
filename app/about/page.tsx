import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Нашата история | ALPÉ',
  description: 'ALPÉ е основана от хора, които познават умората от екрана. Научете повече за нашата мисия.',
}

export default function AboutPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">Нашата история</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          Започна с главоболие<br />в 14:00 ч.
        </h1>
        <div className="max-w-2xl flex flex-col gap-6 font-sans text-sm text-stone leading-relaxed">
          <p>
            Осем часа пред екрана. После още два. После опит да заспиш, докато главата продължава да бумти.
            Познато ли е? За нас беше ежедневие — докато не решихме да направим нещо по въпроса.
          </p>
          <p>
            ALPÉ е основана в България от хора, които работят дигитално и познаваха умората отвътре.
            Не исках да правим поредния продукт с хубава опаковка и празни обещания. Исках нещо,
            което реално работи — с EU сертификати, не с маркетинг.
          </p>
          <p>
            Днес над 1000 клиенти в България носят ALPÉ всеки ден. Голяма част от тях ни пишат,
            че за пръв път от години заспиват без проблем. Това е причината да продължаваме.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-6">
            {[
              { num: '1000+', label: 'доволни клиенти' },
              { num: 'EU', label: 'сертифицирани лещи' },
              { num: '7', label: 'нощи гаранция' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-3xl text-iron">{s.num}</p>
                <p className="font-sans text-xs text-stone/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/#products"
            className="inline-block font-sans text-sm bg-onyx text-linen px-8 py-3 rounded-full hover:bg-iron transition-colors"
          >
            Вземи си чифт →
          </Link>
        </div>
      </section>
    </main>
  )
}
