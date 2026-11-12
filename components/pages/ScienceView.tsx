'use client'

import Image from 'next/image'
import Link from 'next/link'
import SectionNav from '@/components/info/SectionNav'
import { steps, testimonialContent } from '@/lib/data/content'
import { translate } from '@/lib/i18n/translations'
import { localizedPath } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'

const nav = [
  { id: 'pat', label: 'Пътят' },
  { id: 'leshti', label: 'Пластмасовите стъкла' },
  { id: 'den', label: 'Денят' },
  { id: 'ochakvai', label: 'Какво да очакваш' },
  { id: 'iztochnici', label: 'Източници' },
]

const stepCopy = [
  'През деня носи AMPÉ Daily, докато работиш пред екрана. Вечерта използвай AMPÉ Evening около 2–3 часа преди лягане.',
  'Жълтите пластмасови стъкла са лек филтър за деня пред екрана. Оранжевите са силен филтър за вечерта и преди лягане.',
  'Носи ги няколко вечери подред — така се усеща най-добре. Много хора ги използват като вечерна рутина. Може да помогне за по-спокойна вечер.',
]

const sources = [
  ['Brainard et al., 2001. Journal of Neuroscience.', 'https://pubmed.ncbi.nlm.nih.gov/11487664/', '10.1523/JNEUROSCI.21-16-06405.2001'],
  ['Bailes and Lucas, 2013. Proceedings of the Royal Society B.', 'https://pubmed.ncbi.nlm.nih.gov/23554393/', '10.1098/rspb.2012.2987'],
  ['Gooley et al., 2010. Science Translational Medicine.', 'https://pubmed.ncbi.nlm.nih.gov/20463367/', '10.1126/scitranslmed.3000741'],
  ['Shechter et al., 2018. Journal of Psychiatric Research.', 'https://pubmed.ncbi.nlm.nih.gov/29101797/', '10.1016/j.jpsychires.2017.10.015'],
  ['Bigalke et al., 2021. Sleep Health.', 'https://pubmed.ncbi.nlm.nih.gov/33707105/', '10.1016/j.sleh.2021.02.004'],
  ['Lawrenson, Hull and Downie, 2017. Ophthalmic and Physiological Optics.', 'https://pubmed.ncbi.nlm.nih.gov/29044670/', '10.1111/opo.12406'],
  ['Luna-Rangel et al., 2025. Frontiers in Neurology.', 'https://pubmed.ncbi.nlm.nih.gov/41341515/', '10.3389/fneur.2025.1699303'],
]

export default function ScienceView({ locale }: { locale: Locale }) {
  const t = (value: string) => translate(locale, value)
  const href = (path: string) => localizedPath(path, locale)

  return (
    <main className="bg-parchment text-iron">
      <section id="nachalo" className="relative min-h-[70vh] overflow-hidden">
        <Image src="/images/science-hero.jpg" alt={t('Жълти пластмасови стъкла AMPÉ в ръка')} fill priority sizes="100vw" quality={75} className="object-cover object-[38%_center] md:object-[center_100%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/55 to-onyx/15" />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-content flex-col justify-end px-6 pb-12 md:px-10">
          <p className="font-sans text-xs uppercase tracking-widest text-linen/80">{t('Как работи')}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[0.95] text-linen md:text-7xl">{t('От екрана до вечерта.')}</h1>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-linen/85">
            {t('Екраните и лампите вечер излъчват много синя светлина. За тялото този сигнал значи, че още е ден. AMPÉ Daily и AMPÉ Evening са създадени да филтрират тази светлина: жълти пластмасови стъкла за деня пред екрана и оранжеви за вечерта, преди лягане.')}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-content px-6 py-14 md:px-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <SectionNav locale={locale} label="Секции на страницата" items={nav} />
        <div className="min-w-0 space-y-20">
          <section id="pat" className="scroll-mt-32">
            <h2 className="font-serif text-4xl md:text-5xl">{t('Защо синята светлина вечер има значение')}</h2>
            <Pathway label={t('Схема: светлина, око, сигнал „още е ден“, филтър')} nodes={[t('Светлина'), t('Окото'), t('„Още е ден“'), t('Филтър')]} />
            <div className="mt-6 grid gap-4">
              {[
                ['Синята светлина вечер', 'През деня синята светлина е естествена — има я в слънцето. Вечерта екраните, телефоните и лампите продължават да я излъчват. Окото приема този сигнал като „още е ден“, точно когато вечерта би трябвало да се успокояваш.'],
                ['Защо го усещаш', 'Затова след дълга вечер пред екрана много хора се чувстват все още будни, макар да са уморени. Не е въпрос на воля — светлината просто казва на тялото грешния час.'],
                ['Къде се намесва AMPÉ', 'Пластмасовите стъкла стоят пред окото и филтрират част от тази светлина, преди да стигне до теб. AMPÉ Daily е лек жълт филтър за деня пред екрана. AMPÉ Evening е силен оранжев филтър за вечерта: спира 99,29% от синята светлина в диапазона 380–500 nm и 100% от UV лъчите (UV400).'],
              ].map(([title, body]) => (
                <article key={title} className="rounded-[24px] border border-iron/15 bg-cream p-5">
                  <h3 className="font-serif text-2xl">{t(title)}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t(body)}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="leshti" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Два чифта, два момента')}</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <article className="overflow-hidden rounded-[28px] bg-sand/40">
                <div className="relative h-52">
                  <Image src="/images/shop/shop-daily-1.png" alt={t('Чифт AMPÉ Daily с жълти пластмасови стъкла')} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-2xl">AMPÉ Daily · {locale === 'en' ? 'For every day' : 'За всеки ден'}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('Жълти пластмасови стъкла за всеки ден и за целодневна работа пред екран. Лек филтър — до 99% при 450 nm — създаден да бъде по-приятен за очите при дълга работа пред екран. Рамката е 22 г кристален ацетат, за да ги носиш спокойно цял ден.')}</p>
                </div>
              </article>
              <article className="overflow-hidden rounded-[28px] bg-iron text-linen">
                <div className="relative h-52">
                  <Image src="/images/shop/shop-evening-1.png" alt={t('Чифт AMPÉ Evening с оранжеви пластмасови стъкла')} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-2xl">AMPÉ Evening · {t('За вечер')}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-linen/80">{t('Оранжеви пластмасови стъкла за вечерта и преди лягане. Силен филтър: спират 99,29% от синята светлина в 380–500 nm и 100% от UV лъчите (UV400). Категория 1, лек оттенък. Създадени да помогнат за по-спокойна вечерна рутина.')}</p>
                </div>
              </article>
            </div>
            <Link href={href('/lenses')} className="mt-4 inline-block font-sans text-sm underline decoration-gold underline-offset-4">{t('Към За стъклата')}</Link>
          </section>

          <section id="den" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Един ден')}</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => {
                const title = index === 0 ? 'Използвай ги' : step.title
                return (
                <li key={step.title} className="overflow-hidden rounded-[28px] border border-iron/15 bg-cream">
                  <div className="relative h-44">
                    <Image src={step.image} alt={t(title)} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
                  </div>
                  <div className="p-5">
                    <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Стъпка')} {step.number}</p>
                    <h3 className="mt-2 font-serif text-3xl">{t(title)}</h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t(stepCopy[index])}</p>
                  </div>
                </li>
                )
              })}
            </ol>
          </section>

          <section id="ochakvai" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Какво да очакваш')}</h2>
            <div className="mt-6 grid gap-4">
              {[
                ['Първите дни', 'Жълтите и оранжевите пластмасови стъкла имат видим оттенък — повечето хора свикват за кратко. Рамката е 22 г кристален ацетат, създадена за носене цял ден.'],
                ['С няколко вечери', 'Използвай AMPÉ Evening 2–3 часа преди лягане и го прави няколко вечери подред. Много хора усещат по-спокойна вечер, когато това стане рутина. AMPÉ Daily е за деня — по-приятно за очите при дълга работа пред екран.'],
                ['Ако не са за теб', 'Имаш 14 дни да ги върнеш, без неприятности. При два чифта доставката е безплатна — Daily и Evening заедно покриват целия ден. Очилата не са медицинско изделие; създадени са за комфорт пред екрана и за вечерна рутина.'],
              ].map(([title, body]) => (
                <article key={title} className="rounded-[24px] bg-sand/40 p-5">
                  <h3 className="font-serif text-2xl">{t(title)}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t(body)}</p>
                </article>
              ))}
            </div>
            <blockquote className="mt-6 grid items-center gap-6 rounded-[28px] border border-iron/15 p-5 md:grid-cols-[180px_1fr]">
              <div className="relative h-40 overflow-hidden rounded-2xl">
                <Image src="/images/customers/06.jpg" alt={t('Калоян Б., София')} fill sizes="180px" className="object-cover object-[center_40%]" />
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Калоян, с неговите думи')}</p>
                <p className="mt-2 font-serif text-2xl leading-snug">„{t(testimonialContent.quote)}“</p>
                <footer className="mt-2 font-sans text-sm text-stone">{t('Калоян Б., София')}</footer>
              </div>
            </blockquote>
          </section>

          <section id="iztochnici" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Източници')}</h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-stone">{t('Ако искаш да прочетеш повече за това как светлината влияе вечер.')}</p>
            <ol className="mt-5 space-y-3 font-sans text-sm leading-relaxed">
              {sources.map(([label, url, doi], index) => (
                <li key={url} className="border-b border-iron/10 pb-3">
                  [{index + 1}] {label} DOI {doi}.{' '}
                  <a href={url} className="underline decoration-gold underline-offset-4" target="_blank" rel="noreferrer">{url}</a>
                </li>
              ))}
            </ol>
            <p className="mt-4 font-sans text-sm text-stone">
              <Link href={href('/certifications')} className="underline decoration-gold underline-offset-4">{t('Измерванията на AMPÉ Daily и AMPÉ Evening са на страницата Доказано.')}</Link>
            </p>
          </section>
        </div>
      </div>
      <style>{`
        @keyframes path-dash { to { stroke-dashoffset: -24; } }
        .path-dash { stroke-dasharray: 6 6; animation: path-dash 1.4s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .path-dash { animation: none; }
        }
      `}</style>
    </main>
  )
}

function Pathway({ label, nodes }: { label: string; nodes: string[] }) {
  return (
    <figure className="mt-6 rounded-[28px] bg-[#B8906A] p-4 text-linen">
      <svg viewBox="0 0 760 110" role="img" aria-label={label} className="w-full">
        {nodes.map((node, index) => {
          const x = 8 + index * 190
          return (
            <g key={node}>
              <rect x={x} y={27} width="150" height="56" rx="18" fill={index === nodes.length - 1 ? '#2D0E04' : '#FFF0E0'} />
              <text x={x + 75} y={60} textAnchor="middle" fill={index === nodes.length - 1 ? '#EDE4D6' : '#7C3018'} fontSize="16">{node}</text>
              {index < nodes.length - 1 && (
                <path className="path-dash" d={`M${x + 150} 55 H${x + 184}`} stroke="#EDE4D6" strokeWidth="2" fill="none" />
              )}
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
