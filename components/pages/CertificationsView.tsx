'use client'

import Image from 'next/image'
import Link from 'next/link'
import CountUp from '@/components/info/CountUp'
import LazyVideo from '@/components/info/LazyVideo'
import SectionNav from '@/components/info/SectionNav'
import { translate } from '@/lib/i18n/translations'
import { localizedPath } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/config'

const nav = [
  { id: 'svetlina', label: 'Светлина' },
  { id: 'laboratoria', label: 'Лаборатория' },
  { id: 'sertifikati', label: 'Сертификати' },
  { id: 'tehnologia', label: 'Пластмасови стъкла и рамка' },
  { id: 'prouchvania', label: 'Проучвания' },
  { id: 'den', label: 'Денят' },
  { id: 'metod', label: 'Метод' },
  { id: 'vuprosi', label: 'Въпроси' },
  { id: 'iztochnici', label: 'Източници' },
]

const standards = [
  {
    code: 'BS EN ISO 12312-1:2013+A1:2015',
    region: 'Европа · Великобритания',
    what: 'Европейският стандарт за очила със светлинен филтър. Гледа колко светлина минава, UV и дали светофарът се разпознава.',
  },
  {
    code: 'ANSI Z80.3-2015',
    region: 'САЩ',
    what: 'Американският стандарт за пластмасови стъкла без диоптър. Проверява дали са оптически безопасни.',
  },
  {
    code: 'AS/NZS 1067.1:2016',
    region: 'Австралия · Нова Зеландия',
    what: 'Стандартът за слънчеви и леки защитни очила в Австралия и Нова Зеландия. Включва UV и светлопропускливост.',
  },
]

const studies = [
  {
    n: 1,
    authors: 'Brainard et al.',
    year: '2001',
    journal: 'Journal of Neuroscience',
    people: '72 здрави възрастни (37 жени, 35 мъже), средно на 24,5 г.',
    finding: 'Нощем, с разширени зеници, светлината между 446 и 477 nm спира мелатонина най-силно. Върхът на кривата е около 464 nm.',
    limit: 'Силна лабораторна светлина, не екран вкъщи и не пластмасови стъкла AMPÉ.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/11487664/',
    doi: '10.1523/JNEUROSCI.21-16-06405.2001',
  },
  {
    n: 2,
    authors: 'Bailes and Lucas',
    year: '2013',
    journal: 'Proceedings of the Royal Society B',
    people: 'Човешки меланопсин в лабораторни клетки. Не е тест с хора.',
    finding: 'Пигментът реагира най-силно при 479 nm. Мерен е самият пигмент, не готов чифт очила.',
    limit: 'Клетъчен опит. Не казва какъв процент спира конкретно пластмасово стъкло.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/23554393/',
    doi: '10.1098/rspb.2012.2987',
  },
  {
    n: 3,
    authors: 'Gooley et al.',
    year: '2010',
    journal: 'Science Translational Medicine',
    people: 'Здрави хора на 18–30 г.: 24 на 460 nm и 24 на 555 nm.',
    finding: 'В началото зеленото при 555 nm спира мелатонина колкото синьото при 460 nm. Колкото по-дълго свети, толкова по-слабо остава зеленото.',
    limit: 'Тясна лабораторна светлина, 6,5 часа. Не е тест на вечерните пластмасови стъкла.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/20463367/',
    doi: '10.1126/scitranslmed.3000741',
  },
  {
    n: 4,
    authors: 'Shechter et al.',
    year: '2018',
    journal: 'Journal of Psychiatric Research',
    people: '14 възрастни със симптоми на безсъние. Кехлибарени срещу прозрачни пластмасови стъкла, 2 часа преди лягане, 7 нощи.',
    finding: 'С кехлибарените оценките за сън и времето, мерено с гривна, са по-добри. Тези пластмасови стъкла пропускат около 90% видима светлина и поемат около 65% синя. Други числа от нашите.',
    limit: 'Малка група. Не е тест на AMPÉ Daily или AMPÉ Evening.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/29101797/',
    doi: '10.1016/j.jpsychires.2017.10.015',
  },
  {
    n: 5,
    authors: 'Bigalke et al.',
    year: '2021',
    journal: 'Sleep Health',
    people: '20 здрави възрастни (11 мъже, 9 жени), средно на 32 ± 12 г. Очила от 18:00 до лягане.',
    finding: 'Хората казват, че заспиват за 21 ± 28 минути срещу 24 ± 21, и се будят по-малко. Сънят, мерен с уред, не става по-дълъг.',
    limit: 'Здрави доброволци. Авторите пишат, че измереният сън не се подобрява.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/33707105/',
    doi: '10.1016/j.sleh.2021.02.004',
  },
  {
    n: 6,
    authors: 'Lawrenson, Hull and Downie',
    year: '2017',
    journal: 'Ophthalmic and Physiological Optics',
    people: 'Преглед на 3 рандомизирани проучвания, общо 136 души.',
    finding: 'До 2017 г. няма достатъчно силни доказателства, че синьо-блокиращи очила подобряват зрението, съня или умората на очите, или че пазят макулата.',
    limit: 'Преглед до април 2017 г. Други пластмасови стъкла, не докладът на AHD TMS.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/29044670/',
    doi: '10.1111/opo.12406',
  },
  {
    n: 7,
    authors: 'Luna-Rangel et al.',
    year: '2025',
    journal: 'Frontiers in Neurology',
    people: 'Три двойно слепи опита, общо 49 възрастни, със гривна за сън.',
    finding: 'Разликите в заспиването, дължината на съня, ефективността и нощните будения не са статистически ясни. Авторите не виждат стабилен измерен ефект.',
    limit: 'Малко опити и различни условия. Не включва пластмасовите стъкла AMPÉ.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/41341515/',
    doi: '10.3389/fneur.2025.1699303',
  },
]

export default function CertificationsView({ locale }: { locale: Locale }) {
  const t = (value: string) => translate(locale, value)
  const href = (path: string) => localizedPath(path, locale)

  return (
    <main className="bg-parchment text-iron">
      <section id="dokaz" className="relative min-h-[78vh] overflow-hidden">
        <Image
          src="/images/cert-hero.jpg"
          alt={t('Жълти пластмасови стъкла AMPÉ върху кутията')}
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover object-[30%_center] md:object-[center_72%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/60 to-onyx/15" />
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-content flex-col justify-end px-6 pb-14 md:px-10">
          <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] text-linen md:text-7xl">
            {t('Измерени пластмасови стъкла.')}<br />{t('Доказани резултати.')}
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-linen/85">
            {t('Жълтите дневни (AMPÉ Daily) и оранжевите вечерни (AMPÉ Evening) са мерени в независимата лаборатория AHD TMS.')}
          </p>
          <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroStat value={100} suffix="%" label={t('UV, и двете пластмасови стъкла')} />
            <HeroStat value={99} prefix={t('до')} suffix="%" label={t('Дневни, пик 450 nm')} />
            <HeroStat value={99.21} decimals={2} suffix="%" label={t('Вечерни, 475–650 nm')} />
            <HeroStat value={22} suffix={t(' г')} label={t('Рамка, кристален ацетат')} />
          </dl>
          <p className="mt-4 max-w-3xl font-sans text-xs leading-relaxed text-linen/75">{t('Очилата не са медицинско изделие. Направени са да филтрират светлина.')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-content px-6 py-14 md:px-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <SectionNav locale={locale} label="Секции на страницата" items={nav} />
        <div className="min-w-0 space-y-20">
          <section id="svetlina" className="scroll-mt-32">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Светлината и окото')}</p>
            <h2 className="mt-2 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">{t('Защо филтрираме синьото и зеленото')}</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 font-sans text-sm leading-relaxed text-stone">
                <p>{t('В окото има клетки с пигмент меланопсин. В лаборатория той реагира най-силно около 479 nm [2]. При хора, нощем, най-силният диапазон за мелатонина е 446–477 nm, с връх около 464 nm [1].')}</p>
                <p>{t('Зеленото също влиза в сметката. В началото на един тест 555 nm действа колкото 460 nm. Колкото по-дълго свети, толкова по-силно остава късовълновото [3]. Затова при вечерните има и ред за 500–560 nm, отделно от лабораторния 475–650 nm.')}</p>
                <p className="rounded-2xl border border-gold/50 bg-sand/50 p-4 text-iron">
                  {t('Очилата не са медицинско изделие. Не лекуват и не поставят диагноза. Направени са да филтрират светлината в тези диапазони.')}
                </p>
              </div>
              <SpectrumDiagram
                caption={t('Скала на светлината с нашите диапазони. Не е нова крива от уреда.')}
                bands={[
                  { from: 446, to: 477, label: t('Brainard, 446–477 nm') },
                  { from: 475, to: 650, label: t('Вечерни, лаборатория 475–650 nm') },
                  { from: 500, to: 560, label: t('Зелено на продукта, 500–560 nm') },
                ]}
                marks={[
                  { nm: 450, label: '450', note: t('Дневни, лаборатория') },
                  { nm: 464, label: '464', note: t('Brainard, връх') },
                  { nm: 479, label: '479', note: t('Меланопсин') },
                  { nm: 555, label: '555', note: t('Gooley, зелено') },
                ]}
              />
            </div>
            <div className="mt-6 grid items-start gap-3 sm:grid-cols-2">
              <article className="h-fit rounded-[24px] border border-iron/15 bg-sand/40 p-3">
                <p className="font-sans text-[10px] uppercase tracking-widest text-stone">AMPÉ Daily · {t('Дневни пластмасови стъкла')}</p>
                <h3 className="mt-2 font-serif text-2xl">{t('Жълти, почти прозрачни')}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('Лабораторията мери до 99% при 450 nm и 85% пропусната видима светлина.')}</p>
              </article>
              <article className="h-fit rounded-[24px] bg-iron p-3 text-linen">
                <p className="font-sans text-[10px] uppercase tracking-widest text-gold">AMPÉ Evening · {t('Вечерни пластмасови стъкла')}</p>
                <h3 className="mt-2 font-serif text-2xl">{t('Оранжев филтър')}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-linen/80">{t('Лабораторията мери 99,21% в 475–650 nm и 54% пропусната видима светлина.')}</p>
              </article>
            </div>
          </section>

          <section id="laboratoria" className="scroll-mt-32">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Резултати по пластмасово стъкло')}</p>
            <h2 className="mt-2 font-serif text-4xl">{t('Числата от AHD TMS')}</h2>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-stone">
              {t('Докладът е на AHD TMS. Стандартите са BS EN ISO 12312-1:2013+A1:2015, ANSI Z80.3-2015 и AS/NZS 1067.1:2016.')}
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <LabBars
                title={t('Дневни пластмасови стъкла')}
                code="AMPÉ Daily"
                rows={[
                  { label: t('Светлопропускливост (Tv)'), text: '85%', width: 85, note: t('Почти прозрачни') },
                  { label: t('UV блокиране'), text: '100%', width: 100, note: 'UVA + UVB = 0.00%' },
                  { label: t('Синя светлина'), text: t('до 99%'), width: 99, note: t('При пика от 450 nm') },
                ]}
              />
              <LabBars
                title={t('Вечерни пластмасови стъкла')}
                code="AMPÉ Evening"
                dark
                rows={[
                  { label: t('Светлопропускливост (Tv)'), text: '54%', width: 54, note: t('Видимо оранжев оттенък') },
                  { label: t('UV блокиране'), text: '100%', width: 100, note: 'UVA + UVB = 0.00%' },
                  { label: t('Синя светлина (475–650nm)'), text: '99.21%', width: 99.21, note: t('В диапазона 475–650 nm') },
                ]}
              />
            </div>
            <div className="mt-6 overflow-x-auto rounded-[28px] border border-iron/15">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">{t('Сравнение на лабораторните редове за дневни и вечерни пластмасови стъкла')}</caption>
                <thead className="bg-sand">
                  <tr>
                    <th className="px-4 py-4 font-sans text-xs font-medium">{t('Показател')}</th>
                    <th className="px-4 py-4 font-sans text-xs font-medium">{t('Дневни пластмасови стъкла')}<span className="mt-1 block font-normal text-stone">AMPÉ Daily</span></th>
                    <th className="px-4 py-4 font-sans text-xs font-medium">{t('Вечерни пластмасови стъкла')}<span className="mt-1 block font-normal text-stone">AMPÉ Evening</span></th>
                  </tr>
                </thead>
                <tbody className="font-sans text-sm">
                  {[
                    [t('Светлопропускливост (Tv)'), '85%', t('Почти прозрачни'), '54%', t('Видимо оранжев оттенък')],
                    [t('UV блокиране'), '100%', 'UVA + UVB = 0.00%', '100%', 'UVA + UVB = 0.00%'],
                    [t('Синя светлина'), t('до 99%'), t('При пика от 450 nm'), '99.21%', t('Синя светлина (475–650nm)')],
                    [t('Филтърна категория'), '0', t('Подходящи за шофиране'), '1', t('За вечерна употреба')],
                    [t('Разпознаване на светофар'), '✓ PASS', t('Светофарът се разпознава'), '✓ PASS', t('Също PASS')],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-iron/10">
                      <th className="px-4 py-4 font-medium text-iron">{row[0]}</th>
                      <td className="px-4 py-4"><span className="font-serif text-xl">{row[1]}</span><span className="mt-1 block text-xs text-stone">{row[2]}</span></td>
                      <td className="px-4 py-4"><span className="font-serif text-xl">{row[3]}</span><span className="mt-1 block text-xs text-stone">{row[4]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 font-sans text-xs leading-relaxed text-stone">
              {t('Пълните PDF-и не са качени тук. Таблицата е обобщението от лабораторията.')}
            </p>
          </section>

          <section id="sertifikati" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Преминати стандарти')}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {standards.map((standard) => (
                <article key={standard.code} className="flex flex-col rounded-[28px] bg-iron p-6 text-linen">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-gold">{t(standard.region)}</p>
                  <h3 className="mt-3 font-serif text-2xl leading-snug">{standard.code}</h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-linen/80">{t(standard.what)}</p>
                  <p className="mt-4 font-sans text-xs text-linen/70">{t('И двете пластмасови стъкла минават този стандарт.')}</p>
                </article>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <article className="rounded-[24px] border border-iron/15 p-5">
                <h3 className="font-serif text-2xl">UV400</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('На продукта пишем UV400. В лабораторията същото е 100% UV, UVA + UVB = 0.00%, и при двете пластмасови стъкла.')}</p>
              </article>
              <article className="rounded-[24px] border border-iron/15 p-5">
                <h3 className="font-serif text-2xl">{t('Зелена светлина')}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('На вечерните пишем 98% в 500–560 nm, на дневните — частичен филтър. Това е описанието на продукта, не отделен сертификат.')}</p>
              </article>
            </div>
          </section>

          <section id="tehnologia" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Две пластмасови стъкла, една рамка')}</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <figure className="overflow-hidden rounded-[28px] bg-sand/40">
                <div className="relative h-64">
                  <Image src="/images/shop/shop-daily-1.png" alt={t('Чифт AMPÉ Daily с жълти пластмасови стъкла')} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="p-5">
                  <h3 className="font-serif text-2xl">{t('Дневни пластмасови стъкла')} · AMPÉ Daily</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('За деня пред екрана. Категория 0 и подходящи за шофиране. Имат антирефлексно покритие и са устойчиви на драскотини.')}</p>
                  <Link href={href('/product/alpe-daily')} className="mt-3 inline-block font-sans text-sm underline decoration-gold underline-offset-4">{t('Разгледай AMPÉ Daily →')}</Link>
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-[28px] bg-iron text-linen">
                <div className="relative h-64">
                  <Image src="/images/shop/shop-evening-1.png" alt={t('Чифт AMPÉ Evening с оранжеви пластмасови стъкла')} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="p-5">
                  <h3 className="font-serif text-2xl">{t('Вечерни пластмасови стъкла')} · AMPÉ Evening</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-linen/80">{t('За вечерта. Категория 1, светофарът е PASS. Пропускат 54% от видимата светлина, затова оранжевото се вижда.')}</p>
                  <Link href={href('/product/alpe-evening')} className="mt-3 inline-block font-sans text-sm text-linen underline decoration-gold underline-offset-4">{t('Разгледай AMPÉ Evening →')}</Link>
                </figcaption>
              </figure>
            </div>
            <div className="mt-4 grid items-center gap-6 rounded-[28px] border border-iron/15 p-5 md:grid-cols-[180px_1fr]">
              <div className="relative h-40 overflow-hidden rounded-2xl bg-sand">
                <Image src="/images/glasses-duo2.png" alt={t('Двойка очила AMPÉ — дневни и вечерни')} fill sizes="180px" className="object-contain" />
              </div>
              <div>
                <h3 className="font-serif text-3xl">{t('22 г кристален ацетат')}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('22 г кристален ацетат — осезаемо по-лека от обикновена пластмасова рамка. Леки са за цял ден.')}</p>
              </div>
            </div>
          </section>

          <section id="prouchvania" className="scroll-mt-32">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Изследвания за светлината')}</p>
            <h2 className="mt-2 font-serif text-4xl">{t('Какво казват изследванията')}</h2>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-stone">{t('Тези трудове са за светлината и за други очила, не за пластмасовите стъкла AMPÉ. Връзките водят към PubMed.')}</p>
            <div className="mt-6 grid gap-4">
              {studies.map((study) => (
                <article key={study.n} className="rounded-[28px] border border-iron/15 bg-cream p-5 md:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-2xl">[{study.n}] {study.authors}, {study.year}</h3>
                    <p className="font-sans text-xs uppercase tracking-widest text-stone">{study.journal}</p>
                  </div>
                  <p className="mt-3 font-sans text-sm text-iron"><span className="text-stone">{t('Хора')}: </span>{t(study.people)}</p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-iron">{t(study.finding)}</p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('Бележка')}: {t(study.limit)}</p>
                  <p className="mt-3 font-sans text-xs">
                    <a href={study.href} className="underline decoration-gold underline-offset-4" target="_blank" rel="noreferrer">PubMed</a>
                    <span className="text-stone"> · DOI {study.doi}</span>
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="den" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Дневни или вечерни, и кога')}</h2>
            <ol className="mt-6 space-y-4">
              {[
                ['Сутрин и през деня', 'Сложи дневните, докато работиш. AMPÉ Daily е категория 0 и е отбелязана като подходяща за шофиране.'],
                ['Поне два часа преди лягане', 'Вечерните сложи поне 2 часа преди сън. Така ги носим ние. Не е лекарска схема.'],
                ['Защо вечерните са по-тъмни', 'AMPÉ Evening пропуска 54% видима светлина и е категория 1. За вечер са. Светофарът е PASS.'],
                ['От една нощ', 'При здрави хора измереният сън не става стабилно по-дълъг [5, 7]. В малка група със симптоми на безсъние оценките са по-добри с други, кехлибарени пластмасови стъкла [4].'],
              ].map(([title, body], index) => (
                <li key={title} className="grid grid-cols-[auto_1fr] gap-4 rounded-[24px] bg-sand/40 p-5">
                  <span className="font-serif text-3xl text-iron">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-serif text-2xl">{t(title)}</h3>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-stone">{t(body)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="relative mt-6 h-72 overflow-hidden rounded-[28px]">
              <LazyVideo src="/videos/pdp/01.mp4" poster="/videos/pdp/01.jpg" label={t('Клиент с очила AMPÉ')} />
            </div>
            <p className="mt-2 font-sans text-xs text-stone">{t('Клип от продуктовата страница. Човекът не участва в изследванията.')}</p>
          </section>

          <section id="metod" className="scroll-mt-32 rounded-[28px] bg-[#B8906A] p-6 text-linen md:p-8">
            <h2 className="font-serif text-4xl">{t('Как е правен тестът')}</h2>
            <ul className="mt-5 space-y-3 font-sans text-sm leading-relaxed text-linen/90">
              <li>{t('Пластмасовите стъкла са пратени в независима лаборатория. Казва се AHD TMS.')}</li>
              <li>{t('Дневните са AMPÉ Daily, вечерните са AMPÉ Evening.')}</li>
              <li>{t('Мерени са светлопропускливост, UV, синя светлина, категория и светофар, по трите стандарта горе.')}</li>
              <li>{t('В това обобщение няма дата, уред и суров файл. Затова не чертаем крива точка по точка.')}</li>
            </ul>
          </section>

          <section id="vuprosi" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Въпроси')}</h2>
            <div className="mt-5 space-y-3">
              {[
                ['Наистина ли работят тези очила?', 'Лабораторията мери филтъра и числата са ясни. Дали сънят ти се променя е друго: опитите с други синьо-блокиращи очила са малки и различни [4–7].'],
                ['Това лечение на безсъние ли е?', 'Не. Не са медицинско изделие и не заместват лекар.'],
                ['Защо дневните са „до 99%“ и същевременно „65%“?', '„До 99%“ при 450 nm и 85% пропусната светлина са от лабораторията. 65% е описанието на дневния филтър. Държим ги отделно.'],
                ['Може ли да ги нося цял ден?', 'Да. За това са. Рамката е 22 г и повечето хора свикват още първия ден.'],
              ].map(([q, a]) => (
                <details key={q} className="rounded-[24px] border border-iron/15 bg-cream p-5">
                  <summary className="cursor-pointer list-none font-serif text-xl [&::-webkit-details-marker]:hidden">{t(q)}</summary>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-stone">{t(a)}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="iztochnici" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Източници')}</h2>
            <ol className="mt-5 space-y-4 font-sans text-sm leading-relaxed">
              {studies.map((study) => (
                <li key={study.n} id={`ref-${study.n}`} className="border-b border-iron/10 pb-4">
                  <span className="text-stone">[{study.n}] </span>
                  {study.authors} ({study.year}). {study.journal}. DOI: {study.doi}.{' '}
                  <a href={study.href} className="underline decoration-gold underline-offset-4" target="_blank" rel="noreferrer">{study.href}</a>
                </li>
              ))}
            </ol>
            <div className="mt-8 rounded-[28px] bg-onyx px-6 py-10 text-center text-linen">
              <h2 className="font-serif text-4xl">{t('Вземи си чифт.')}</h2>
              <Link href={href('/shop')} className="mt-5 inline-block rounded-full bg-linen px-8 py-3 font-sans text-sm text-onyx">{t('Вземи си чифт →')}</Link>
              <p className="mt-3 font-sans text-xs text-linen/70">{t('Безплатна доставка за 2+ чифта')}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function HeroStat({ value, suffix, prefix = '', label, decimals = 0 }: { value: number; suffix: string; prefix?: string; label: string; decimals?: number }) {
  return (
    <div className="rounded-2xl border border-linen/25 bg-onyx/50 px-3 py-3 backdrop-blur-sm">
      {prefix ? <p className="font-sans text-[11px] leading-none text-linen/80">{prefix}</p> : null}
      <dt className="font-serif text-3xl text-linen">
        <CountUp value={value} decimals={decimals} />{suffix}
      </dt>
      <dd className="mt-1 font-sans text-[11px] leading-snug text-linen/75">{label}</dd>
    </div>
  )
}

function LabBars({ title, code, rows, dark = false }: { title: string; code: string; dark?: boolean; rows: { label: string; text: string; width: number; note: string }[] }) {
  return (
    <article className={`rounded-[28px] p-5 ${dark ? 'bg-iron text-linen' : 'border border-iron/15 bg-cream'}`}>
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className={`font-sans text-xs ${dark ? 'text-linen/70' : 'text-stone'}`}>{code}</p>
      <div className="mt-4 space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between gap-3 font-sans text-sm">
              <span>{row.label}</span>
              <span className="font-serif text-xl">{row.text}</span>
            </div>
            <div className={`mt-1 h-2 overflow-hidden rounded-full ${dark ? 'bg-linen/20' : 'bg-sand'}`}>
              <div className={`h-full rounded-full ${dark ? 'bg-gold' : 'bg-iron'}`} style={{ width: `${row.width}%` }} />
            </div>
            <p className={`mt-1 font-sans text-xs ${dark ? 'text-linen/70' : 'text-stone'}`}>{row.note}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

function SpectrumDiagram({ caption, marks, bands }: { caption: string; marks: { nm: number; label: string; note: string }[]; bands: { from: number; to: number; label: string }[] }) {
  const x = (nm: number) => 16 + ((nm - 380) / 320) * 328
  return (
    <figure className="rounded-[28px] border border-iron/15 bg-cream p-4">
      <svg viewBox="0 0 360 168" role="img" aria-label={caption} className="w-full">
        <defs>
          <linearGradient id="proof-spectrum" x1="0" x2="1">
            <stop offset="0" stopColor="#6B4C9A" />
            <stop offset="0.22" stopColor="#3D6CB5" />
            <stop offset="0.4" stopColor="#3E8C4A" />
            <stop offset="0.62" stopColor="#E0A030" />
            <stop offset="0.82" stopColor="#C45A2A" />
            <stop offset="1" stopColor="#8C2F2A" />
          </linearGradient>
        </defs>
        {bands.map((band) => (
          <rect key={band.label} x={x(band.from)} y="70" width={Math.max(2, x(band.to) - x(band.from))} height="28" rx="4" fill="#2D0E04" opacity="0.18" />
        ))}
        <rect x="16" y="78" width="328" height="16" rx="8" fill="url(#proof-spectrum)" />
        {marks.map((mark) => (
          <line key={mark.label} x1={x(mark.nm)} y1="64" x2={x(mark.nm)} y2="108" stroke="#2D0E04" strokeWidth="1.5" />
        ))}
        <text x="16" y="128" fill="#9B7B68" fontSize="11">380 nm</text>
        <text x="292" y="128" fill="#9B7B68" fontSize="11">700 nm</text>
      </svg>
      <ul className="mt-2 space-y-1 font-sans text-xs text-stone">
        {bands.map((band) => <li key={band.label}>{band.label}</li>)}
        {marks.map((mark) => <li key={mark.label}>{mark.label} nm — {mark.note}</li>)}
      </ul>
      <figcaption className="mt-2 font-sans text-xs text-stone">{caption}</figcaption>
    </figure>
  )
}
