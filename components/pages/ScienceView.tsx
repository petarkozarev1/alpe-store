'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { translate } from '@/lib/i18n/translations'
import { localizedPath } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'
import { steps, testimonialContent, withoutItems, withItems } from '@/lib/data/content'

const facts = [
  {
    title: 'Синята светлина блокира мелатонина',
    body: 'Мелатонинът е хормонът, който казва на тялото ти "лягай си". Синята светлина от екраните го потиска с до 50% — дори след 20 минути гледане вечерта. Резултатът: лежиш в леглото, но мозъкът ти е буден.',
    image: '/images/how-it-works-rest.jpg',
  },
  {
    title: 'Очите не са направени за екрани',
    body: 'Когато гледаш екран, мигаш 3 пъти по-малко от нормалното. Това изсушава очите и причинява умора. Лещите с антирефлексно покритие намаляват тоя стрес значително.',
    image: '/images/how-it-works-filter.jpg',
  },
  {
    title: 'EU сертификацията е строга',
    body: 'EU стандартите за оптични филтри (EN ISO 12312) изискват независими лабораторни тестове. Не е достатъчно да напишеш "блокира синя светлина" на кутията — трябва да го докажеш. Лещите на AMPÉ са преминали тези тестове.',
    image: '/images/glasses-duo.png',
  },
  {
    title: '7 нощи са достатъчни',
    body: 'Повечето хора усещат разлика в умората на очите още след 3-4 дни. Качеството на съня се подобрява след около седмица.',
    image: '/images/customers/05.jpg',
  },
]

export default function ScienceView({ locale }: { locale: Locale }) {
  const t = (value: string) => translate(locale, value)
  const href = (path: string) => localizedPath(path, locale)
  const progress = useReadingProgress()

  return (
    <main className="bg-parchment text-iron">
      <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-sand" aria-hidden="true">
        <div className="h-full bg-gold" style={{ width: `${progress * 100}%` }} />
      </div>

      <section className="mx-auto grid max-w-content items-end gap-10 px-6 pb-12 pt-28 md:px-10 lg:grid-cols-[1.1fr_0.7fr]">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-stone">{t('Науката зад AMPÉ')}</p>
          <h1 className="mt-4 font-serif text-6xl leading-[0.95] text-iron md:text-7xl">
            {t('Не е магия.')}<br />{t('Просто физика.')}
          </h1>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-stone">
            {t('Синята светлина е реална. Умората е реална. Решението е просто — ако знаеш как работи.')}
          </p>
        </div>
        <div className="relative h-72 overflow-hidden rounded-full">
          <Image src="/images/how-it-works-selfie.jpg" alt={t('Клиент с очила AMPÉ')} fill priority sizes="40vw" className="object-cover object-[center_28%]" />
        </div>
      </section>

      <section id="stupki" className="scroll-mt-28 bg-iron py-16 text-linen">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <h2 className="whitespace-pre-line font-serif text-5xl">{t('Лесно.\nПросто работи.')}</h2>
          <ol className="mt-10 grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <li key={step.number} className="overflow-hidden rounded-[28px] bg-onyx">
                <div className="relative h-64">
                  <Image src={step.image} alt={t(step.title)} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-gold">{t('Стъпка')} {step.number}</p>
                  <h3 className="mt-2 font-serif text-3xl">{t(step.title)}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-linen/80">{t(step.description)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="shema" className="mx-auto max-w-content px-6 py-16 md:px-10">
        <div className="grid items-center gap-8 rounded-[32px] bg-sand/50 p-6 md:grid-cols-2 md:p-10">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Схема')}</p>
            <h2 className="mt-2 font-serif text-4xl">{t('Екран, филтър, почивка')}</h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-stone">{t('Схема за ориентация. Не добавя числа извън текстовете на страницата.')}</p>
          </div>
          <FlowDiagram label={t('Схема: екран, филтър, почивка')} nodes={[t('Екран'), t('Филтрирай'), t('Стъкла'), t('Почини си')]} />
        </div>
      </section>

      <section id="fakti" className="mx-auto max-w-content space-y-16 px-6 py-8 md:px-10">
        {facts.slice(0, 3).map((fact, index) => (
          <article key={fact.title} className="grid items-center gap-8 lg:grid-cols-2">
            <div className={`relative h-80 overflow-hidden rounded-[28px] ${index % 2 ? 'lg:order-2' : ''}`}>
              <Image src={fact.image} alt={t(fact.title)} fill sizes="(min-width: 1024px) 45vw, 100vw" className={fact.image.endsWith('.png') ? 'object-contain bg-sand' : 'object-cover'} />
            </div>
            <div className={index % 2 ? 'lg:order-1' : ''}>
              <p className="font-serif text-5xl text-gold/70">0{index + 1}</p>
              <h2 className="mt-2 font-serif text-4xl">{t(fact.title)}</h2>
              <p className="mt-4 font-sans text-base leading-relaxed text-stone">{t(fact.body)}</p>
              {index === 2 && (
                <Link href={href('/certifications')} className="mt-5 inline-block font-sans text-sm underline decoration-gold underline-offset-4">{t('Доказано')} →</Link>
              )}
            </div>
          </article>
        ))}
        <aside className="grid gap-6 overflow-hidden rounded-[28px] border-l-4 border-gold bg-sand/60 md:grid-cols-[220px_1fr]">
          <div className="relative min-h-48">
            <Image src={facts[3].image} alt={t(facts[3].title)} fill sizes="220px" className="object-cover" />
          </div>
          <div className="p-6 md:p-8">
            <h2 className="font-serif text-3xl">{t(facts[3].title)}</h2>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-iron">{t(facts[3].body)}</p>
          </div>
        </aside>
      </section>

      <section className="mx-auto grid max-w-content gap-6 px-6 py-12 md:px-10 lg:grid-cols-2">
        <div className="rounded-[28px] border border-iron/15 p-6">
            <h2 className="font-serif text-3xl">{t('Умора вчера.')}</h2>
          <ul className="mt-4 space-y-3">
            {withoutItems.map((item) => (
              <li key={item} className="font-sans text-sm text-stone">– {t(item)}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[28px] bg-iron p-6 text-linen">
          <h2 className="font-serif text-3xl">{t('Яснота днес.')}</h2>
          <ul className="mt-4 space-y-3">
            {withItems.map((item) => (
              <li key={item} className="font-sans text-sm text-linen/85">✓ {t(item)}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-content items-center gap-8 px-6 py-12 md:px-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative h-80 overflow-hidden rounded-[28px]">
          <Image src="/images/customers/02.jpg" alt={t(testimonialContent.author)} fill sizes="40vw" className="object-cover" />
        </div>
        <blockquote>
          <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t(testimonialContent.badge)}</p>
          <p className="mt-4 font-serif text-3xl leading-snug text-iron">„{t(testimonialContent.quote)}“</p>
          <footer className="mt-4 font-sans text-sm text-stone">{t(testimonialContent.author)}</footer>
        </blockquote>
      </section>

      <section className="mx-auto max-w-content px-6 pb-20 md:px-10">
        <Link href={href('/shop')} className="inline-block rounded-full bg-onyx px-8 py-3 font-sans text-sm text-linen hover:bg-iron">{t('Вземи си чифт →')}</Link>
      </section>
    </main>
  )
}

function useReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement
      const max = root.scrollHeight - root.clientHeight
      setProgress(max > 0 ? root.scrollTop / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}

function FlowDiagram({ label, nodes }: { label: string; nodes: string[] }) {
  return (
    <svg viewBox="0 0 760 110" role="img" aria-label={label} className="w-full">
      {nodes.map((node, index) => {
        const x = 8 + index * 190
        return (
          <g key={node}>
            <rect x={x} y={27} width="156" height="56" rx="18" fill={index === nodes.length - 1 ? '#7C3018' : '#FFF0E0'} stroke="#7C3018" />
            <text x={x + 78} y={60} textAnchor="middle" fill={index === nodes.length - 1 ? '#EDE4D6' : '#7C3018'} fontSize="16">{node}</text>
            {index < nodes.length - 1 && (
              <path d={`M${x + 156} 55 H${x + 184}`} stroke="#C4A266" strokeWidth="2" markerEnd="url(#flow-arrow)" />
            )}
          </g>
        )
      })}
      <defs>
        <marker id="flow-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#C4A266" />
        </marker>
      </defs>
    </svg>
  )
}
