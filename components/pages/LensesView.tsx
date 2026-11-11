'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import CompareSlider from '@/components/info/CompareSlider'
import LazyVideo from '@/components/info/LazyVideo'
import { translate } from '@/lib/i18n/translations'
import { localizedPath } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'

const dayPoints = [
  '65% блокиране на синя светлина',
  'Частичен филтър за зелена светлина',
  'Антирефлексно покритие',
  'UV400 защита',
  'Устойчиви на драскотини',
]

const eveningPoints = [
  '98% блокиране на синя светлина',
  '98% блокиране на зелена светлина (500–560nm)',
  'Максимален мелатонинов ефект',
  'UV400 защита',
  'Лека рамка',
]

export default function LensesView({ locale }: { locale: Locale }) {
  const t = (value: string) => translate(locale, value)
  const href = (path: string) => localizedPath(path, locale)
  const [mix, setMix] = useState(12)
  const evening = mix >= 50
  const points = evening ? eveningPoints : dayPoints

  return (
    <main className="bg-parchment text-iron">
      <section className="mx-auto grid max-w-content items-center gap-10 px-6 pb-8 pt-28 md:px-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-stone">{t('✓ EU сертифицирана технология')}</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-iron md:text-6xl">
            {t('Стъклата, които правят')}<br />{t('разликата.')}
          </h1>
          <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-stone">
            {t('Не всички очила за синя светлина са еднакви. Лещите на AMPÉ са тествани и сертифицирани в ЕС — не просто маркетинг.')}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['UV400 защита', 'Антирефлексно покритие', 'Лека рамка'].map((chip) => (
              <span key={chip} className="rounded-full border border-iron/20 px-3 py-1 font-sans text-xs text-iron">{t(chip)}</span>
            ))}
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[32px] bg-sand">
          <Image
            key={evening ? 'evening' : 'day'}
            src={evening ? '/images/shop/shop-evening-1.png' : '/images/shop/shop-daily-1.png'}
            alt={evening ? t('Чифт AMPÉ Evening с оранжеви стъкла') : t('Чифт AMPÉ Daily с жълти стъкла')}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </div>
      </section>

      <section id="izbor" className="mx-auto max-w-content px-6 py-12 md:px-10">
        <div className="rounded-[32px] border border-iron/15 bg-cream p-5 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Ден или вечер')}</p>
              <h2 className="mt-2 font-serif text-4xl text-iron">{evening ? t('Вечерни стъкла') : t('Дневни стъкла')}</h2>
            </div>
            <div className="flex rounded-full bg-sand p-1" role="group" aria-label={t('Ден или вечер')}>
              <button type="button" aria-pressed={!evening} onClick={() => setMix(12)} className={`rounded-full px-4 py-2 font-sans text-sm ${evening ? 'text-iron' : 'bg-onyx text-linen'}`}>{t('Ден')}</button>
              <button type="button" aria-pressed={evening} onClick={() => setMix(88)} className={`rounded-full px-4 py-2 font-sans text-sm ${evening ? 'bg-onyx text-linen' : 'text-iron'}`}>{t('Вечер')}</button>
            </div>
          </div>
          <label className="mt-6 block">
            <span className="sr-only">{t('Премести плъзгача от дневни към вечерни лещи')}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={mix}
              onChange={(event) => setMix(Number(event.target.value))}
              aria-valuetext={evening ? t('Вечерни стъкла') : t('Дневни стъкла')}
              className="w-full accent-iron"
              style={{ background: 'linear-gradient(90deg, #F3D48A, #E07A2F)' }}
            />
          </label>
          <p className="mt-2 font-sans text-xs text-stone">{t('Плъзгачът сменя дневните и вечерните лещи. Не е лабораторна скала.')}</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{evening ? t('За вечерта') : t('За работния ден')}</p>
              {evening && <p className="mt-3 inline-flex rounded-full bg-gold/30 px-3 py-1 font-sans text-[10px] uppercase tracking-widest text-iron">Restocking</p>}
              <p className="mt-4 font-sans text-base leading-relaxed text-iron">
                {evening
                  ? t('По-силен оранжев филтър. Блокират 98% от синята и зелената светлина. Тялото ти знае, че е края на деня и заспиваш без усилие.')
                  : t('Лек жълтеникав оттенък, почти незабележим. Блокират 65% от синята и зелената светлина. Достатъчно, за да не болят очите до 17:00.')}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {points.map((point) => (
                  <li key={point} className="rounded-full bg-sand px-3 py-1 font-sans text-xs text-iron">✓ {t(point)}</li>
                ))}
              </ul>
            </div>
            <div className="relative h-56 overflow-hidden rounded-3xl" style={{ background: evening ? '#7C3018' : '#F5DFC5' }}>
              <div className="absolute inset-x-8 top-1/2 h-16 -translate-y-1/2 rounded-full" style={{ background: evening ? '#E07A2F' : '#F3D48A', opacity: 0.9 }} />
              <p className={`absolute bottom-4 left-4 font-serif text-5xl ${evening ? 'text-linen' : 'text-iron'}`}>{evening ? '98%' : '65%'}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={href('/product/alpe-daily')} className="font-sans text-sm font-semibold text-iron underline decoration-gold underline-offset-4">{t('Разгледай AMPÉ Daily →')}</Link>
            <Link href={href('/product/alpe-evening')} className="font-sans text-sm font-semibold text-iron underline decoration-gold underline-offset-4">{t('Разгледай AMPÉ Evening →')}</Link>
          </div>
        </div>
      </section>

      <section id="sravnenie" className="mx-auto max-w-content px-6 py-8 md:px-10">
        <h2 className="font-serif text-4xl">{t('Две специално създадени лещи')}</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <caption className="sr-only">{t('Сравнение на дневни и вечерни стъкла')}</caption>
            <thead>
              <tr className="border-b border-iron/20">
                <th className="py-3 font-sans text-xs font-medium text-stone">{t('Показател')}</th>
                <th className="py-3 font-sans text-xs font-medium text-iron">{t('Дневни стъкла')}</th>
                <th className="py-3 font-sans text-xs font-medium text-iron">{t('Вечерни стъкла')}</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm">
              <tr className="border-b border-iron/10">
                <th className="py-4 font-medium">{t('Синя светлина')}</th>
                <td>{t('65% блокиране на синя светлина')}</td>
                <td>{t('98% блокиране на синя светлина')}</td>
              </tr>
              <tr className="border-b border-iron/10">
                <th className="py-4 font-medium">{t('Зелена светлина')}</th>
                <td>{t('Частичен филтър за зелена светлина')}</td>
                <td>{t('98% блокиране на зелена светлина (500–560nm)')}</td>
              </tr>
              <tr className="border-b border-iron/10">
                <th className="py-4 font-medium">{t('Оттенък')}</th>
                <td>{t('Почти прозрачни — лек жълтеникав оттенък')}</td>
                <td>{t('Оранжев филтър — блокира синьо-зелената светлина')}</td>
              </tr>
              <tr>
                <th className="py-4 font-medium">UV</th>
                <td>{t('UV400 защита')}</td>
                <td>{t('UV400 защита')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-[#B8906A] py-16 text-linen">
        <div className="mx-auto grid max-w-content gap-8 px-6 md:px-10 lg:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden rounded-[28px]">
            <LazyVideo src="/videos/pdp/01.mp4" poster="/videos/pdp/01.jpg" label={t('Клиент с очила AMPÉ')} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-sans text-[10px] uppercase tracking-widest text-linen/75">{t('Как работи')}</p>
            <h2 className="mt-3 whitespace-pre-line font-serif text-5xl">{t('Лесно.\nПросто работи.')}</h2>
            <ol className="mt-8 space-y-6">
              {[
                ['01', 'Сложи ги', 'Използвайте дневните очила по време на работа и вечерните поне 2 часа преди лягане. Очите ви ще усетят разликата веднага. По-малко напрежение, повече спокойствие.'],
                ['02', 'Филтрирай', 'Лещите филтрират синята и зелената светлина цял ден — без пауза, без умора.'],
                ['03', 'Почини си', 'Тялото усеща, че денят е към края си. Заспиваш по-лесно, спиш по-дълбоко.'],
              ].map(([n, title, body]) => (
                <li key={n} className="grid grid-cols-[auto_1fr] gap-4">
                  <span className="font-serif text-2xl text-gold">{n}</span>
                  <div>
                    <h3 className="font-serif text-2xl">{t(title)}</h3>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-linen/80">{t(body)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="razlika" className="mx-auto max-w-content px-6 py-16 md:px-10">
        <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Защо AMPÉ?')}</p>
        <h2 className="mt-2 whitespace-pre-line font-serif text-4xl md:text-5xl">{t('Умора вчера.\nЯснота днес.')}</h2>
        <div className="mt-6">
          <CompareSlider
            beforeSrc="/images/before.png"
            afterSrc="/images/after.png"
            beforeAlt={t('Преди')}
            afterAlt={t('След')}
            beforeLabel={t('Преди')}
            afterLabel={t('След')}
            label={t('Плъзни, за да сравниш преди и след')}
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-content gap-10 px-6 pb-20 md:px-10 lg:grid-cols-2">
        <article className="overflow-hidden rounded-[28px] bg-sand/50">
          <div className="relative h-64">
            <Image src="/images/how-it-works-selfie.jpg" alt={t('Клиент с очила AMPÉ')} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-[center_28%]" />
          </div>
          <div className="p-6">
            <h2 className="font-serif text-3xl">{t('Дневни + вечерни стъкла')}</h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-stone">{t('Дневни + вечерни стъкла. Пълна защита от сутринта до лягане.')}</p>
          </div>
        </article>
        <article className="flex flex-col justify-between rounded-[28px] bg-onyx p-8 text-linen">
          <div>
            <h2 className="font-serif text-4xl">{t('Вземи си чифт.')}</h2>
            <p className="mt-4 font-sans text-sm text-linen/75">{t('Безплатна доставка за 2+ чифта')}</p>
          </div>
          <Link href={href('/shop')} className="mt-8 inline-block w-fit rounded-full bg-linen px-8 py-3 font-sans text-sm text-onyx">{t('Вземи си чифт →')}</Link>
        </article>
      </section>
    </main>
  )
}
