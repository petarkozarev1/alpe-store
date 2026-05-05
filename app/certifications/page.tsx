import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Сертификати | ALPÉ',
  description: 'Официални лабораторни тестове на лещите ALPÉ. BS EN ISO 12312-1, ANSI Z80.3, AS/NZS 1067.1 — всички преминати.',
}

const standards = [
  {
    code: 'BS EN ISO 12312-1:2013+A1:2015',
    region: 'Европа · Великобритания',
    what: 'Най-строгият стандарт за очила за синя светлина на EU пазара. Изисква независими лабораторни тестове за светлопропускливост, UV блокиране и разпознаване на светофар.',
  },
  {
    code: 'ANSI Z80.3-2015',
    region: 'САЩ',
    what: 'Американски оптичен стандарт, управляван от American National Standards Institute. Тества безопасността и оптичните характеристики на некоригиращи лещи.',
  },
  {
    code: 'AS/NZS 1067.1:2016',
    region: 'Австралия · Нова Зеландия',
    what: 'Австралийско-новозеландски стандарт за слънчеви очила и очила за лека защита. Включва строги тестове за UV блокиране и светлопропускливост.',
  },
]

const lenses = [
  {
    code: 'jx-y8016',
    name: 'Дневни лещи',
    tagline: 'За работния ден пред екрана',
    tint: 'Почти прозрачни — лек жълтеникав оттенък',
    color: 'light',
    specs: [
      { label: 'Светлопропускливост (Tv)', value: '85%', note: 'Почти прозрачни' },
      { label: 'UV блокиране', value: '100%', note: 'UVA + UVB = 0.00%' },
      { label: 'Синя светлина (до 99%)', value: 'до 99%', note: 'Блокира вредния 450nm пик' },
      { label: 'Филтърна категория', value: '0', note: 'Подходящи за шофиране' },
      { label: 'Разпознаване на светофар', value: 'PASS', note: 'Безопасни за употреба на улицата' },
    ],
    standards: ['BS EN ISO 12312-1', 'ANSI Z80.3', 'AS/NZS 1067.1'],
  },
  {
    code: 'jx-y8008',
    name: 'Вечерни лещи',
    tagline: 'За вечерта и по-добър сън',
    tint: 'Оранжев филтър — блокира синьо-зелената светлина',
    color: 'dark',
    specs: [
      { label: 'Светлопропускливост (Tv)', value: '54%', note: 'Видимо оранжев оттенък' },
      { label: 'UV блокиране', value: '100%', note: 'UVA + UVB = 0.00%' },
      { label: 'Синя светлина (475–650nm)', value: '99.21%', note: 'Максимална мелатонинова защита' },
      { label: 'Филтърна категория', value: '1', note: 'За вечерна употреба' },
      { label: 'Разпознаване на светофар', value: 'PASS', note: 'Тествано и преминато' },
    ],
    standards: ['BS EN ISO 12312-1', 'ANSI Z80.3', 'AS/NZS 1067.1'],
  },
]

export default function CertificationsPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">

      {/* Hero */}
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-16">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">Официална документация</span>
        <h1 className="font-serif text-4xl md:text-6xl text-iron mt-4 mb-6 leading-tight">
          Не казваме<br />&bdquo;EU сертифицирани&rdquo;<br />без причина.
        </h1>
        <p className="font-sans text-base text-stone max-w-xl leading-relaxed">
          Лещите на ALPÉ са изпратени в независима лаборатория (AHD TMS) и тествани срещу три международни стандарта. Ето резултатите — без маркетинг, само числа.
        </p>
      </section>

      {/* Standards strip */}
      <section className="bg-iron">
        <div className="max-w-content mx-auto px-6 md:px-10 py-12">
          <p className="font-sans text-[10px] uppercase tracking-widest text-stone/60 mb-8">Преминати стандарти</p>
          <div className="grid md:grid-cols-3 gap-8">
            {standards.map((s) => (
              <div key={s.code} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-gold text-sm">✓</span>
                  <span className="font-sans text-xs font-medium text-linen tracking-wide">{s.code}</span>
                </div>
                <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">{s.region}</span>
                <p className="font-sans text-xs text-stone leading-relaxed mt-1">{s.what}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lens specs */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-20">
        <p className="font-sans text-[10px] uppercase tracking-widest text-stone/60 mb-10">Резултати по леща</p>
        <div className="grid md:grid-cols-2 gap-8">
          {lenses.map((lens) => (
            <div
              key={lens.code}
              className={`rounded-2xl overflow-hidden ${lens.color === 'dark' ? 'bg-iron' : 'border border-iron/20'}`}
            >
              {/* Lens header */}
              <div className={`px-8 pt-8 pb-6 border-b ${lens.color === 'dark' ? 'border-stone/20' : 'border-iron/10'}`}>
                <span className={`font-sans text-[10px] uppercase tracking-widest ${lens.color === 'dark' ? 'text-stone/60' : 'text-stone/50'}`}>
                  {lens.code}
                </span>
                <h2 className={`font-serif text-2xl mt-2 mb-1 ${lens.color === 'dark' ? 'text-linen' : 'text-iron'}`}>
                  {lens.name}
                </h2>
                <p className={`font-sans text-xs ${lens.color === 'dark' ? 'text-stone' : 'text-stone'}`}>
                  {lens.tint}
                </p>
              </div>

              {/* Specs table */}
              <div className="px-8 py-6 flex flex-col gap-4">
                {lens.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between items-start gap-4">
                    <div>
                      <p className={`font-sans text-xs ${lens.color === 'dark' ? 'text-stone/70' : 'text-stone/70'}`}>
                        {spec.label}
                      </p>
                      <p className={`font-sans text-[10px] mt-0.5 ${lens.color === 'dark' ? 'text-stone/40' : 'text-stone/40'}`}>
                        {spec.note}
                      </p>
                    </div>
                    <span className={`font-serif text-lg flex-shrink-0 ${
                      spec.value === 'PASS' ? 'text-gold' : lens.color === 'dark' ? 'text-linen' : 'text-iron'
                    }`}>
                      {spec.value === 'PASS' ? '✓ PASS' : spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Standards passed */}
              <div className={`px-8 pb-8 pt-2`}>
                <p className={`font-sans text-[10px] uppercase tracking-widest mb-3 ${lens.color === 'dark' ? 'text-stone/40' : 'text-stone/40'}`}>
                  Преминати стандарти
                </p>
                <div className="flex flex-wrap gap-2">
                  {lens.standards.map((std) => (
                    <span
                      key={std}
                      className={`font-sans text-[10px] px-3 py-1 rounded-full border ${
                        lens.color === 'dark'
                          ? 'border-stone/30 text-stone/70'
                          : 'border-iron/20 text-stone/60'
                      }`}
                    >
                      ✓ {std}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What this means */}
      <section className="bg-sand/30">
        <div className="max-w-content mx-auto px-6 md:px-10 py-16">
          <h2 className="font-serif text-2xl text-iron mb-8">Какво означава това за теб?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Независимо тестване',
                body: 'Резултатите са от трета страна — лаборатория AHD TMS. Не е самодекларация. Не е маркетинг. Реален тест, реални числа.',
              },
              {
                title: 'Три пазара, три стандарта',
                body: 'EU, американски и австралийски стандарт — всички преминати. Лещите отговарят на изискванията на три различни регулаторни рамки едновременно.',
              },
              {
                title: '7 нощи без риск',
                body: 'Сертификатите показват, че лещите работят. Но ако ти лично не усетиш разлика след 7 нощи — върни ги. Без въпроси.',
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-lg text-iron mb-2">{item.title}</h3>
                <p className="font-sans text-sm text-stone leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-16 text-center">
        <p className="font-sans text-sm text-stone mb-2">Достатъчно доказателства?</p>
        <h2 className="font-serif text-3xl text-iron mb-8">Вземи си чифт.</h2>
        <Link
          href="/#products"
          className="inline-block font-sans text-sm bg-onyx text-linen px-8 py-3 rounded-full hover:bg-iron transition-colors"
        >
          Вземи си чифт →
        </Link>
        <p className="font-sans text-xs text-stone/60 mt-4">
          Безплатна доставка над €50
        </p>
        <p className="font-sans text-xs text-stone/40 mt-6 max-w-sm mx-auto">
          Лабораторен доклад: AHD TMS · Стандарти: BS EN ISO 12312-1:2013+A1:2015, ANSI Z80.3-2015, AS/NZS 1067.1:2016
        </p>
      </section>

    </main>
  )
}
