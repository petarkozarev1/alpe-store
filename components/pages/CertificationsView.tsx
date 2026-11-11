'use client'

import Image from 'next/image'
import Link from 'next/link'
import CountUp from '@/components/info/CountUp'
import SectionNav from '@/components/info/SectionNav'
import { translate } from '@/lib/i18n/translations'
import { localizedPath } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'

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

const rows = [
  { label: 'Светлопропускливост (Tv)', day: '85%', dayNote: 'Почти прозрачни', night: '54%', nightNote: 'Видимо оранжев оттенък' },
  { label: 'UV блокиране', day: '100%', dayNote: 'UVA + UVB = 0.00%', night: '100%', nightNote: 'UVA + UVB = 0.00%' },
  { label: 'Синя светлина', day: 'до 99%', dayNote: 'Блокира вредния 450nm пик', night: '99.21%', nightNote: 'Синя светлина (475–650nm)' },
  { label: 'Филтърна категория', day: '0', dayNote: 'Подходящи за шофиране', night: '1', nightNote: 'За вечерна употреба' },
  { label: 'Разпознаване на светофар', day: 'PASS', dayNote: 'Безопасни за употреба на улицата', night: 'PASS', nightNote: 'Тествано и преминато' },
]

export default function CertificationsView({ locale }: { locale: Locale }) {
  const t = (value: string) => translate(locale, value)
  const href = (path: string) => localizedPath(path, locale)

  return (
    <main className="bg-parchment text-iron">
      <section className="relative min-h-[78vh] overflow-hidden">
        <Image
          src="/images/customers/01.jpg"
          alt={t('Клиент с очила AMPÉ')}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_62%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/55 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-content flex-col justify-end px-6 pb-16 md:px-10">
          <p className="font-sans text-xs uppercase tracking-widest text-linen/75">{t('Официална документация')}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight text-linen md:text-7xl">
            {t('Не казваме')}<br />{t('„EU сертифицирани”')}<br />{t('без причина.')}
          </h1>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-linen/80">
            {t('Лещите на AMPÉ са изпратени в независима лаборатория (AHD TMS) и тествани срещу три международни стандарта. Ето резултатите — без маркетинг, само числа.')}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-content px-6 py-16 md:px-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <SectionNav
          locale={locale}
          label="Секции на страницата"
          items={[
            { id: 'chisla', label: 'Числа' },
            { id: 'standarti', label: 'Стандарти' },
            { id: 'tablica', label: 'Таблица' },
            { id: 'lehti', label: 'Лещи' },
            { id: 'znachenie', label: 'Значение' },
          ]}
        />

        <div className="min-w-0">
          <section id="chisla" className="scroll-mt-32">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Резултати по леща')}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Stat value={100} suffix="%" label={t('И двете лещи · 100% UV')} note={t('UVA + UVB = 0.00%')} />
              <Stat value={99} suffix="%" prefix={t('до') + ' '} label={t('Дневни лещи · до 99%')} note={t('Блокира вредния 450nm пик')} />
              <Stat value={99.21} decimals={2} suffix="%" label={t('Вечерни лещи · 99.21%')} note={t('Синя светлина (475–650nm)')} />
              <Stat value={85} suffix="%" label={t('Дневни лещи · 85% Tv')} note={t('Светлопропускливост (Tv)')} />
            </div>
            <p className="mt-4 font-sans text-xs leading-relaxed text-stone">
              {t('Лабораторен доклад: AHD TMS · Стандарти: BS EN ISO 12312-1:2013+A1:2015, ANSI Z80.3-2015, AS/NZS 1067.1:2016')}
            </p>
          </section>

          <section id="standarti" className="scroll-mt-32 mt-20">
            <div className="overflow-hidden rounded-[28px] bg-iron p-6 text-linen md:p-8">
              <p className="font-sans text-[10px] uppercase tracking-widest text-linen/70">{t('Преминати стандарти')}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-6">
                {standards.map((standard, index) => (
                  <article key={standard.code} className={`rounded-2xl border border-linen/20 p-5 ${index === 0 ? 'md:col-span-6 md:grid md:grid-cols-[1fr_1.2fr] md:gap-8' : 'md:col-span-3'}`}>
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-gold">{t(standard.region)}</p>
                      <h2 className="mt-3 font-serif text-2xl leading-snug text-linen">{standard.code}</h2>
                    </div>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-linen/80 md:mt-0">{t(standard.what)}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="tablica" className="scroll-mt-32 mt-20">
            <h2 className="font-serif text-4xl text-iron">{t('Резултати по леща')}</h2>
            <div className="mt-6 overflow-x-auto rounded-[28px] border border-iron/15">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">{t('Сравнение на лабораторните редове за дневни и вечерни лещи')}</caption>
                <thead className="bg-sand">
                  <tr>
                    <th className="px-4 py-4 font-sans text-xs font-medium text-iron">{t('Показател')}</th>
                    <th className="px-4 py-4 font-sans text-xs font-medium text-iron">{t('Дневни лещи')}<span className="mt-1 block font-normal text-stone">jx-y8016</span></th>
                    <th className="px-4 py-4 font-sans text-xs font-medium text-iron">{t('Вечерни лещи')}<span className="mt-1 block font-normal text-stone">jx-y8008</span></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-t border-iron/10">
                      <th className="px-4 py-4 font-sans text-sm font-medium text-iron">{t(row.label)}</th>
                      <td className="px-4 py-4"><Cell value={t(row.day)} note={t(row.dayNote)} /></td>
                      <td className="px-4 py-4"><Cell value={t(row.night)} note={t(row.nightNote)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="lehti" className="scroll-mt-32 mt-20 grid gap-6 lg:grid-cols-2">
            <LensPanel
              code="jx-y8016"
              name={t('Дневни лещи')}
              tint={t('Почти прозрачни — лек жълтеникав оттенък')}
              tagline={t('За работния ден пред екрана')}
              image="/images/shop/shop-daily-1.png"
              alt={t('Чифт AMPÉ Daily с жълти стъкла')}
              href={href('/product/alpe-daily')}
              cta={t('Разгледай AMPÉ Daily →')}
              light
            />
            <LensPanel
              code="jx-y8008"
              name={t('Вечерни лещи')}
              tint={t('Оранжев филтър — блокира синьо-зелената светлина')}
              tagline={t('За вечерта и по-добър сън')}
              image="/images/shop/shop-evening-1.png"
              alt={t('Чифт AMPÉ Evening с оранжеви стъкла')}
              href={href('/product/alpe-evening')}
              cta={t('Разгледай AMPÉ Evening →')}
            />
            <figure className="lg:col-span-2 overflow-hidden rounded-[28px] border border-iron/15 bg-sand/40 p-6 md:grid md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-8">
              <SpectrumGraphic caption={t('Илюстрация на диапазоните от редовете по-горе. Не е отделно измерване.')} />
              <figcaption className="mt-4 font-sans text-sm leading-relaxed text-stone md:mt-0">
                {t('Илюстрация на диапазоните от редовете по-горе. Не е отделно измерване.')}
              </figcaption>
            </figure>
          </section>

          <section id="znachenie" className="scroll-mt-32 mt-20">
            <h2 className="font-serif text-4xl text-iron">{t('Какво означава това за теб?')}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ['Независимо тестване', 'Резултатите са от трета страна — лаборатория AHD TMS. Не е самодекларация. Не е маркетинг. Реален тест, реални числа.'],
                ['Три пазара, три стандарта', 'EU, американски и австралийски стандарт — всички преминати. Лещите отговарят на изискванията на три различни регулаторни рамки едновременно.'],
                ['7 нощи без риск', 'Сертификатите показват, че лещите работят. Но ако ти лично не усетиш разлика след 7 нощи — върни ги. Без въпроси.'],
              ].map(([title, body]) => (
                <details key={title} className="group rounded-[28px] border border-iron/15 bg-sand/40 open:bg-iron open:text-linen">
                  <summary className="cursor-pointer list-none p-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-serif text-2xl">{t(title)}</h3>
                    <span className="mt-4 inline-block font-sans text-[10px] uppercase tracking-widest text-stone group-open:hidden">{t('Отвори')}</span>
                    <span className="mt-4 hidden font-sans text-[10px] uppercase tracking-widest text-gold group-open:inline-block">{t('Затвори')}</span>
                  </summary>
                  <p className="px-6 pb-6 font-sans text-sm leading-relaxed text-linen/80">{t(body)}</p>
                </details>
              ))}
            </div>
            <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
              {['/images/customers/01.jpg', '/images/customers/02.jpg', '/images/customers/03.jpg', '/images/customers/04.jpg'].map((src) => (
                <div key={src} className="relative h-40 w-32 flex-none overflow-hidden rounded-2xl">
                  <Image src={src} alt={t('Клиент с очила AMPÉ')} fill sizes="128px" className="object-cover" />
                </div>
              ))}
            </div>
            <p className="mt-3 font-sans text-xs text-stone">{t('1000+ доволни клиенти')}</p>
          </section>

          <section className="mt-20 rounded-[28px] bg-onyx px-6 py-12 text-center text-linen">
            <p className="font-sans text-sm text-linen/75">{t('Достатъчно доказателства?')}</p>
            <h2 className="mt-2 font-serif text-4xl">{t('Вземи си чифт.')}</h2>
            <Link href={href('/shop')} className="mt-6 inline-block rounded-full bg-linen px-8 py-3 font-sans text-sm text-onyx hover:bg-sand">
              {t('Вземи си чифт →')}
            </Link>
            <p className="mt-4 font-sans text-xs text-linen/70">{t('Безплатна доставка за 2+ чифта')}</p>
          </section>
        </div>
      </div>
    </main>
  )
}

function Stat({ value, decimals = 0, suffix, prefix = '', label, note }: { value: number; decimals?: number; suffix: string; prefix?: string; label: string; note: string }) {
  return (
    <article className="rounded-[28px] border border-iron/15 bg-cream px-5 py-6">
      <p className="font-serif text-5xl text-iron">
        {prefix}<CountUp value={value} decimals={decimals} />{suffix}
      </p>
      <h2 className="mt-3 font-sans text-sm text-iron">{label}</h2>
      <p className="mt-1 font-sans text-xs text-stone">{note}</p>
    </article>
  )
}

function Cell({ value, note }: { value: string; note: string }) {
  return (
    <div>
      <p className={`font-serif text-xl ${value === 'PASS' ? 'text-gold' : 'text-iron'}`}>{value === 'PASS' ? '✓ PASS' : value}</p>
      <p className="mt-1 font-sans text-xs text-stone">{note}</p>
    </div>
  )
}

function LensPanel({ code, name, tint, tagline, image, alt, href, cta, light = false }: { code: string; name: string; tint: string; tagline: string; image: string; alt: string; href: string; cta: string; light?: boolean }) {
  return (
    <article className={`overflow-hidden rounded-[28px] ${light ? 'border border-iron/15 bg-sand/30' : 'bg-iron text-linen'}`}>
      <div className="relative h-56">
        <Image src={image} alt={alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
      </div>
      <div className="p-6">
        <p className={`font-sans text-[10px] uppercase tracking-widest ${light ? 'text-stone' : 'text-linen/70'}`}>{code}</p>
        <h2 className="mt-2 font-serif text-3xl">{name}</h2>
        <p className={`mt-2 font-sans text-sm ${light ? 'text-stone' : 'text-linen/80'}`}>{tagline}</p>
        <p className={`mt-2 font-sans text-sm ${light ? 'text-iron' : 'text-linen'}`}>{tint}</p>
        <Link href={href} className={`mt-5 inline-block font-sans text-sm underline decoration-gold underline-offset-4 ${light ? 'text-iron' : 'text-linen'}`}>{cta}</Link>
      </div>
    </article>
  )
}

function SpectrumGraphic({ caption }: { caption: string }) {
  return (
    <svg viewBox="0 0 560 140" role="img" aria-label={caption} className="w-full">
      <defs>
        <linearGradient id="cert-spectrum" x1="0" x2="1">
          <stop offset="0" stopColor="#7C3018" />
          <stop offset="0.35" stopColor="#C4A266" />
          <stop offset="0.7" stopColor="#E07A2F" />
          <stop offset="1" stopColor="#2D0E04" />
        </linearGradient>
      </defs>
      <rect x="24" y="58" width="512" height="18" rx="9" fill="url(#cert-spectrum)" />
      <line x1="168" y1="40" x2="168" y2="96" stroke="#2D0E04" strokeWidth="2" />
      <rect x="210" y="48" width="250" height="38" rx="8" fill="none" stroke="#7C3018" strokeWidth="1.5" />
      <text x="168" y="28" textAnchor="middle" fill="#7C3018" fontSize="13">450nm</text>
      <text x="335" y="124" textAnchor="middle" fill="#7C3018" fontSize="13">475–650nm</text>
    </svg>
  )
}
