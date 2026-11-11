'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import SectionNav from '@/components/info/SectionNav'
import { translate } from '@/lib/i18n/translations'
import { localizedPath } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'

const nav = [
  { id: 'duljini', label: 'Дължини' },
  { id: 'laboratoria', label: 'Лаборатория' },
  { id: 'pokritia', label: 'Покрития' },
  { id: 'ramka', label: 'Рамка' },
  { id: 'sravnenie', label: 'Сравнение' },
  { id: 'koga', label: 'Кога' },
]

export default function LensesView({ locale }: { locale: Locale }) {
  const t = (value: string) => translate(locale, value)
  const href = (path: string) => localizedPath(path, locale)
  const [evening, setEvening] = useState(false)

  return (
    <main className="bg-parchment text-iron">
      <section id="stakla" className="relative min-h-[70vh] overflow-hidden">
        <Image
          src={evening ? '/images/shop/shop-evening-1.png' : '/images/shop/shop-daily-1.png'}
          alt={evening ? t('Чифт AMPÉ Evening с оранжеви стъкла') : t('Чифт AMPÉ Daily с жълти стъкла')}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_55%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/55 to-onyx/10" />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-content flex-col justify-end px-6 pb-12 md:px-10">
          <p className="font-sans text-xs uppercase tracking-widest text-linen/80">{t('Две лещи. Два кода.')}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[0.95] text-linen md:text-7xl">
            JX-Y8016<br />JX-Y8008
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-linen/85">
            {t('Жълтите са за деня, оранжевите за вечерта. Числата от AHD TMS и описанието на продукта стоят едно до друго. Очилата не са медицинско изделие.')}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" aria-pressed={!evening} onClick={() => setEvening(false)} className={`rounded-full px-4 py-2 font-sans text-sm ${evening ? 'bg-linen/20 text-linen' : 'bg-linen text-onyx'}`}>{t('Дневни лещи')}</button>
            <button type="button" aria-pressed={evening} onClick={() => setEvening(true)} className={`rounded-full px-4 py-2 font-sans text-sm ${evening ? 'bg-linen text-onyx' : 'bg-linen/20 text-linen'}`}>{t('Вечерни лещи')}</button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-6 py-14 md:px-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <SectionNav locale={locale} label="Секции на страницата" items={nav} />
        <div className="min-w-0 space-y-20">
          <section id="duljini" className="scroll-mt-32">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Какво хваща всяка леща')}</p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">{t('Диапазоните, които публикуваме')}</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <article className="rounded-[28px] border border-iron/15 bg-cream p-5">
                <p className="font-sans text-[10px] uppercase tracking-widest text-stone">JX-Y8016 · {t('Дневни лещи')}</p>
                <h3 className="mt-2 font-serif text-3xl">{t('Жълти, почти прозрачни')}</h3>
                <ul className="mt-4 space-y-3 font-sans text-sm leading-relaxed text-stone">
                  <li>{t('Лаборатория: до 99% при пика от 450 nm. Пропуска 85% видима светлина. Категория 0.')}</li>
                  <li>{t('На продукта: 65% блокиране на синя светлина и частичен филтър за зелена светлина.')}</li>
                  <li>{t('Изследванията сочат връх на меланопсина около 479 nm и силен диапазон 446–477 nm. Това е за светлината, не за тази леща.')}</li>
                </ul>
              </article>
              <article className="rounded-[28px] bg-iron p-5 text-linen">
                <p className="font-sans text-[10px] uppercase tracking-widest text-gold">JX-Y8008 · {t('Вечерни лещи')}</p>
                <h3 className="mt-2 font-serif text-3xl">{t('Оранжев филтър')}</h3>
                <ul className="mt-4 space-y-3 font-sans text-sm leading-relaxed text-linen/80">
                  <li>{t('Лаборатория: 99.21% в 475–650 nm. Пропуска 54% видима светлина. Категория 1.')}</li>
                  <li>{t('На продукта: 98% блокиране на синя светлина в 415–455 nm и 98% блокиране на зелена светлина (500–560nm).')}</li>
                  <li>{t('При лабораторна светлина 555 nm също спира мелатонина в началото. Затова зеленият ред е отделен.')}</li>
                </ul>
              </article>
            </div>
            <LensSpectrum caption={t('Скала 380–700 nm. Лентите са диапазоните, които публикуваме.')} />
            <p className="mt-3 font-sans text-xs text-stone">
              <Link href={href('/certifications')} className="underline decoration-gold underline-offset-4">{t('Изследванията са на страницата Доказано.')}</Link>
            </p>
          </section>

          <section id="laboratoria" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Числата от AHD TMS')}</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Bars
                title={t('Дневни лещи')}
                code="jx-y8016"
                rows={[
                  { label: t('Светлопропускливост (Tv)'), text: '85%', width: 85 },
                  { label: t('UV блокиране'), text: '100%', width: 100 },
                  { label: t('Синя светлина'), text: t('до 99%'), width: 99 },
                ]}
              />
              <Bars
                title={t('Вечерни лещи')}
                code="jx-y8008"
                dark
                rows={[
                  { label: t('Светлопропускливост (Tv)'), text: '54%', width: 54 },
                  { label: t('UV блокиране'), text: '100%', width: 100 },
                  { label: t('Синя светлина (475–650nm)'), text: '99.21%', width: 99.21 },
                ]}
              />
            </div>
            <p className="mt-4 font-sans text-sm leading-relaxed text-stone">
              {t('И двете лещи: UVA + UVB = 0.00%. Светофарът е PASS. Пълните PDF-и не са качени тук.')}
            </p>
          </section>

          <section id="pokritia" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Покрития и UV400')}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ['UV400', t('На продукта пишем UV400. В лабораторията е 100% UV и при двете лещи.')],
                [t('Антирефлексно покритие'), t('Дневните имат антирефлексно покритие. Намалява блясъка от екрана и лампите.')],
                [t('Устойчиви на драскотини'), t('Лещите са устойчиви на драскотини, за ежедневието.')],
              ].map(([title, body]) => (
                <article key={title} className="rounded-[24px] border border-iron/15 bg-cream p-5">
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="ramka" className="scroll-mt-32 grid items-center gap-6 rounded-[28px] bg-sand/50 p-5 md:grid-cols-[220px_1fr] md:p-8">
            <div className="relative h-48 overflow-hidden rounded-2xl bg-sand">
              <Image src="/images/glasses-duo2.png" alt={t('Двойка очила AMPÉ — дневни и вечерни')} fill sizes="220px" className="object-contain" />
            </div>
            <div>
              <h2 className="font-serif text-4xl">{t('22 г кристален ацетат')}</h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-stone">
                {t('22 г кристален ацетат — осезаемо по-лека от обикновена пластмасова рамка. Рамката е за носене 8+ часа.')}
              </p>
            </div>
          </section>

          <section id="sravnenie" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Една до друга')}</h2>
            <div className="mt-6 overflow-x-auto rounded-[28px] border border-iron/15">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">{t('Сравнение на дневни и вечерни стъкла')}</caption>
                <thead className="bg-sand">
                  <tr>
                    <th className="px-4 py-4 font-sans text-xs font-medium">{t('Показател')}</th>
                    <th className="px-4 py-4 font-sans text-xs font-medium">{t('Дневни лещи')}<span className="mt-1 block font-normal text-stone">jx-y8016</span></th>
                    <th className="px-4 py-4 font-sans text-xs font-medium">{t('Вечерни лещи')}<span className="mt-1 block font-normal text-stone">jx-y8008</span></th>
                  </tr>
                </thead>
                <tbody className="font-sans text-sm">
                  {[
                    [t('Продуктово описание, синя'), t('65% блокиране на синя светлина'), t('98% блокиране на синя светлина')],
                    [t('Продуктово описание, зелена'), t('Частичен филтър за зелена светлина'), t('98% блокиране на зелена светлина (500–560nm)')],
                    [t('Лаборатория, синя'), t('до 99%'), '99.21%'],
                    [t('Лаборатория, Tv'), '85%', '54%'],
                    [t('Категория'), '0', '1'],
                    [t('Оттенък'), t('Почти прозрачни — лек жълтеникав оттенък'), t('Оранжев филтър — блокира синьо-зелената светлина')],
                    ['UV', t('UV400 защита'), t('UV400 защита')],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-iron/10">
                      <th className="px-4 py-4 font-medium">{row[0]}</th>
                      <td className="px-4 py-4">{row[1]}</td>
                      <td className="px-4 py-4">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href={href('/product/alpe-daily')} className="font-sans text-sm underline decoration-gold underline-offset-4">{t('Разгледай AMPÉ Daily →')}</Link>
              <Link href={href('/product/alpe-evening')} className="font-sans text-sm underline decoration-gold underline-offset-4">{t('Разгледай AMPÉ Evening →')}</Link>
            </div>
          </section>

          <section id="koga" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Кога коя леща')}</h2>
            <ol className="mt-6 space-y-3">
              {[
                [t('През деня'), t('Дневните, JX-Y8016. Категория 0, подходящи за шофиране. За работа пред екран, включително дизайн и видеоразговори.')],
                [t('След залез'), t('Вечерните, JX-Y8008, поне 2 часа преди сън. Категория 1. Светофарът е PASS. Наличността е на продуктовата страница.')],
              ].map(([title, body], index) => (
                <li key={title} className="grid grid-cols-[auto_1fr] gap-4 rounded-[24px] bg-sand/40 p-5">
                  <span className="font-serif text-3xl text-iron">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-serif text-2xl">{title}</h3>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-stone">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </main>
  )
}

function Bars({ title, code, rows, dark = false }: { title: string; code: string; dark?: boolean; rows: { label: string; text: string; width: number }[] }) {
  return (
    <article className={`rounded-[28px] p-5 ${dark ? 'bg-iron text-linen' : 'border border-iron/15 bg-cream'}`}>
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className={`font-sans text-xs ${dark ? 'text-linen/70' : 'text-stone'}`}>{code}</p>
      <div className="mt-4 space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex justify-between font-sans text-sm"><span>{row.label}</span><span className="font-serif text-xl">{row.text}</span></div>
            <div className={`mt-1 h-2 overflow-hidden rounded-full ${dark ? 'bg-linen/20' : 'bg-sand'}`}>
              <div className={`h-full rounded-full ${dark ? 'bg-gold' : 'bg-iron'}`} style={{ width: `${row.width}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

function LensSpectrum({ caption }: { caption: string }) {
  const x = (nm: number) => 16 + ((nm - 380) / 320) * 328
  const bands = [
    { from: 446, to: 477, label: '446–477 nm' },
    { from: 475, to: 650, label: '475–650 nm' },
    { from: 500, to: 560, label: '500–560 nm' },
  ]
  return (
    <figure className="mt-6 rounded-[28px] border border-iron/15 bg-cream p-4">
      <svg viewBox="0 0 360 120" role="img" aria-label={caption} className="w-full">
        <defs>
          <linearGradient id="lens-spectrum" x1="0" x2="1">
            <stop offset="0" stopColor="#6B4C9A" />
            <stop offset="0.22" stopColor="#3D6CB5" />
            <stop offset="0.4" stopColor="#3E8C4A" />
            <stop offset="0.62" stopColor="#E0A030" />
            <stop offset="0.82" stopColor="#C45A2A" />
            <stop offset="1" stopColor="#8C2F2A" />
          </linearGradient>
        </defs>
        {bands.map((band) => (
          <rect key={band.label} x={x(band.from)} y="36" width={Math.max(2, x(band.to) - x(band.from))} height="28" rx="4" fill="#2D0E04" opacity="0.18" />
        ))}
        <rect x="16" y="44" width="328" height="16" rx="8" fill="url(#lens-spectrum)" />
        <line x1={x(450)} y1="30" x2={x(450)} y2="74" stroke="#2D0E04" strokeWidth="1.5" />
        <line x1={x(479)} y1="30" x2={x(479)} y2="74" stroke="#2D0E04" strokeWidth="1.5" />
        <text x="16" y="100" fill="#9B7B68" fontSize="11">380 nm</text>
        <text x="292" y="100" fill="#9B7B68" fontSize="11">700 nm</text>
      </svg>
      <figcaption className="font-sans text-xs leading-relaxed text-stone">{caption} 450 nm · 479 nm · 446–477 nm · 475–650 nm · 500–560 nm.</figcaption>
    </figure>
  )
}
