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
          alt={evening ? t('Чифт AMPÉ Evening с оранжеви пластмасови стъкла') : t('Чифт AMPÉ Daily с жълти пластмасови стъкла')}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_55%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/55 to-onyx/10" />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-content flex-col justify-end px-6 pb-12 md:px-10">
          <p className="font-sans text-xs uppercase tracking-widest text-linen/80">{t('За стъклата')}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[0.95] text-linen md:text-7xl">
            AMPÉ Daily<br />AMPÉ Evening
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-linen/85">
            {t('AMPÉ Daily са жълти пластмасови стъкла за деня пред екрана. AMPÉ Evening са оранжеви пластмасови стъкла за вечерта и преди лягане. Лек филтър през деня, силен филтър вечер. Рамката е 22 г кристален ацетат.')}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" aria-pressed={!evening} onClick={() => setEvening(false)} className={`rounded-full px-4 py-2 font-sans text-sm ${evening ? 'bg-linen/20 text-linen' : 'bg-linen text-onyx'}`}>{locale === 'en' ? 'For every day' : 'За всеки ден'}</button>
            <button type="button" aria-pressed={evening} onClick={() => setEvening(true)} className={`rounded-full px-4 py-2 font-sans text-sm ${evening ? 'bg-linen text-onyx' : 'bg-linen/20 text-linen'}`}>{t('За вечер')}</button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-6 py-14 md:px-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <SectionNav locale={locale} label="Секции на страницата" items={nav} />
        <div className="min-w-0 space-y-20">
          <section id="duljini" className="scroll-mt-32">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Какво прави всяко пластмасово стъкло')}</p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">{t('Два филтъра, два момента от деня')}</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <article className="rounded-[28px] border border-iron/15 bg-cream p-5">
                <p className="font-sans text-[10px] uppercase tracking-widest text-stone">AMPÉ Daily · {locale === 'en' ? 'For every day' : 'За всеки ден'}</p>
                <h3 className="mt-2 font-serif text-3xl">{t('Жълти пластмасови стъкла')}</h3>
                <ul className="mt-4 space-y-3 font-sans text-sm leading-relaxed text-stone">
                  <li>{t('Лек филтър — до 99% при 450 nm. Пропускат 85% видима светлина: лек оттенък за целодневна работа пред екран.')}</li>
                  <li>{t('Създадени да бъдат по-приятни за очите при дълга работа.')}</li>
                </ul>
              </article>
              <article className="rounded-[28px] bg-iron p-5 text-linen">
                <p className="font-sans text-[10px] uppercase tracking-widest text-gold">AMPÉ Evening · {t('За вечер')}</p>
                <h3 className="mt-2 font-serif text-3xl">{t('Оранжеви пластмасови стъкла')}</h3>
                <ul className="mt-4 space-y-3 font-sans text-sm leading-relaxed text-linen/80">
                  <li>{t('Силен филтър: спират 99,29% от синята светлина в 380–500 nm и 100% от UV лъчите (UV400).')}</li>
                  <li>{t('Пропускат 54% видима светлина, категория 1. Създадени да помогнат за по-спокойна вечерна рутина.')}</li>
                </ul>
              </article>
            </div>
            <LensSpectrum
              caption={t('Диапазонът, в който мерим, и защо има значение.')}
              bands={[
                { from: 380, to: 500, label: t('AMPÉ Evening, 380–500 nm') },
                { from: 446, to: 477, label: t('чувствителност вечер, 446–477 nm') },
              ]}
              marks={[
                { nm: 450, label: '450', note: 'AMPÉ Daily' },
                { nm: 464, label: '464', note: t('връх в синия диапазон') },
              ]}
            />
            <p className="mt-3 font-sans text-xs text-stone">
              <Link href={href('/certifications')} className="underline decoration-gold underline-offset-4">{t('Измерванията на AMPÉ Daily и AMPÉ Evening са на страницата Доказано.')}</Link>
            </p>
          </section>

          <section id="laboratoria" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Измерените числа')}</h2>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-stone">
              {t('AMPÉ Evening е мерено по BS EN ISO 12312-1, ANSI Z80.3 и AS/NZS 1067.1. В доклада е отбелязано Measured by AHD TMS. Ето стойностите.')}
            </p>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Bars
                title={t('Дневни пластмасови стъкла')}
                code="AMPÉ Daily"
                rows={[
                  { label: t('Светлопропускливост (Tv)'), text: '85%', width: 85, note: t('Почти прозрачни') },
                  { label: t('Синя светлина'), text: t('до 99%'), width: 99, note: t('При пика от 450 nm') },
                  { label: t('За какво е'), text: locale === 'en' ? 'For every day' : 'За всеки ден', width: 0, note: t('Целодневна работа пред екран') },
                ]}
              />
              <Bars
                title={t('Вечерни пластмасови стъкла')}
                code="AMPÉ Evening"
                dark
                rows={[
                  { label: t('Светлопропускливост (Tv)'), text: '54%', width: 54, note: t('Видим оранжев оттенък') },
                  { label: t('UV блокиране'), text: '100%', width: 100, note: t('UV400, UVA + UVB = 0,00%') },
                  { label: t('Синя светлина'), text: t('99,29%'), width: 99.29, note: t('В диапазона 380–500 nm') },
                ]}
              />
            </div>
            <p className="mt-4 font-sans text-sm leading-relaxed text-stone">
              {t('Числата за AMPÉ Evening са от доклада, мерен по трите стандарта. „До 99% при 450 nm“ и 85% са публикуваните стойности за AMPÉ Daily.')}
            </p>
          </section>

          <section id="pokritia" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Покрития и UV400')}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ['UV400', t('AMPÉ Evening спира 100% от UV лъчите (UV400) — UVA + UVB = 0,00% в доклада. Създадени за вечерта, когато се носят и навън, преди лягане.')],
                [t('Антирефлексно покритие'), t('Дневните пластмасови стъкла имат антирефлексно покритие. Намалява блясъка от екрана и лампите — по-приятно при дълга работа пред екран.')],
                [t('Устойчиви на драскотини'), t('Пластмасовите стъкла са устойчиви на драскотини, за ежедневието.')],
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
                {t('22 г кристален ацетат — осезаемо по-лека от обикновена рамка. Създадена да се носи цял ден, с AMPÉ Daily пред екрана и с AMPÉ Evening вечер.')}
              </p>
            </div>
          </section>

          <section id="sravnenie" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Една до друга')}</h2>
            <div className="mt-6 overflow-x-auto rounded-[28px] border border-iron/15">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">{t('Сравнение на дневни и вечерни пластмасови стъкла')}</caption>
                <thead className="bg-sand">
                  <tr>
                    <th className="px-4 py-4 font-sans text-xs font-medium">{t('Показател')}</th>
                    <th className="px-4 py-4 font-sans text-xs font-medium">{t('Дневни пластмасови стъкла')}<span className="mt-1 block font-normal text-stone">AMPÉ Daily</span></th>
                    <th className="px-4 py-4 font-sans text-xs font-medium">{t('Вечерни пластмасови стъкла')}<span className="mt-1 block font-normal text-stone">AMPÉ Evening</span></th>
                  </tr>
                </thead>
                <tbody className="font-sans text-sm">
                  {[
                    [t('За какво е'), locale === 'en' ? 'For every day, at a screen' : 'За всеки ден, пред екран', t('За вечерта и преди лягане')],
                    [t('Пластмасови стъкла'), t('Жълти, почти прозрачни'), t('Оранжеви, видим оттенък')],
                    [t('Синя светлина'), t('до 99% при 450 nm'), t('99,29% в 380–500 nm')],
                    [t('Светлопропускливост (Tv)'), '85%', '54%'],
                    ['UV', '—', '100% UV400'],
                    [t('Филтърна категория'), t('Лек оттенък, за деня'), t('1 — За вечерта, не за пътя')],
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
            <h2 className="font-serif text-4xl">{t('Как се използват')}</h2>
            <ol className="mt-6 space-y-3">
              {[
                [t('През деня'), t('Използвай AMPÉ Daily, докато работиш пред екрана. Лек жълт филтър, създаден да бъде по-приятен за очите при дълга работа.')],
                [t('Вечерта'), t('Използвай AMPÉ Evening около 2–3 часа преди лягане. Силен оранжев филтър за вечерта и преди лягане, не за пътя. Много хора го правят като вечерна рутина. Носи ги няколко вечери подред — така се усеща най-добре. Може да помогне за по-спокойна вечер.')],
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
            <p className="mt-4 font-sans text-sm leading-relaxed text-stone">{t('При два чифта доставката е безплатна. Ако не са за теб, имаш 14 дни да ги върнеш.')}</p>
          </section>
        </div>
      </div>
    </main>
  )
}

function Bars({ title, code, rows, dark = false }: { title: string; code: string; dark?: boolean; rows: { label: string; text: string; width: number; note?: string }[] }) {
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
            {row.note ? <p className={`mt-1 font-sans text-xs ${dark ? 'text-linen/70' : 'text-stone'}`}>{row.note}</p> : null}
          </div>
        ))}
      </div>
    </article>
  )
}

function LensSpectrum({ caption, bands, marks }: { caption: string; bands: { from: number; to: number; label: string }[]; marks: { nm: number; label: string; note: string }[] }) {
  const x = (nm: number) => 16 + ((nm - 380) / 320) * 328
  return (
    <figure className="mt-6 rounded-[28px] border border-iron/15 bg-cream p-4">
      <svg viewBox="0 0 360 120" role="img" aria-label={caption} className="w-full">
        <defs>
          <linearGradient id="lenses-spectrum" x1="0" x2="1">
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
        <rect x="16" y="44" width="328" height="16" rx="8" fill="url(#lenses-spectrum)" />
        {marks.map((mark) => (
          <line key={mark.label} x1={x(mark.nm)} y1="30" x2={x(mark.nm)} y2="74" stroke="#2D0E04" strokeWidth="1.5" />
        ))}
        <text x="16" y="100" fill="#9B7B68" fontSize="11">380 nm</text>
        <text x="292" y="100" fill="#9B7B68" fontSize="11">700 nm</text>
      </svg>
      <ul className="mt-2 space-y-1 font-sans text-xs text-stone">
        {bands.map((band) => <li key={band.label}>{band.label}</li>)}
        {marks.map((mark) => <li key={mark.label}>{mark.label} nm — {mark.note}</li>)}
      </ul>
      <figcaption className="mt-2 font-sans text-xs leading-relaxed text-stone">{caption}</figcaption>
    </figure>
  )
}
