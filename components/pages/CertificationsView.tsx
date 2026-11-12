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
    what: 'Европейският стандарт за очила със светлинен филтър. Обхваща светлопропускливост, UV и разпознаване на светофар.',
  },
  {
    code: 'ANSI Z80.3-2015',
    region: 'САЩ',
    what: 'Американският стандарт за пластмасови стъкла без диоптър. Гледа оптична безопасност и светлопропускливост.',
  },
  {
    code: 'AS/NZS 1067.1:2016',
    region: 'Австралия · Нова Зеландия',
    what: 'Стандартът за слънчеви и леки защитни очила. Включва UV и светлопропускливост.',
  },
]

const studies = [
  {
    n: 1,
    authors: 'Brainard et al.',
    year: '2001',
    journal: 'Journal of Neuroscience',
    people: '72 здрави възрастни (37 жени, 35 мъже), средно на 24,5 г.',
    finding: 'Нощем светлината между 446 и 477 nm влияе най-силно върху вечерния ритъм, с връх около 464 nm. Точно този диапазон влиза в филтъра на AMPÉ Evening (380–500 nm).',
    limit: 'Лабораторна светлина, не екран вкъщи.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/11487664/',
    doi: '10.1523/JNEUROSCI.21-16-06405.2001',
  },
  {
    n: 2,
    authors: 'Bailes and Lucas',
    year: '2013',
    journal: 'Proceedings of the Royal Society B',
    people: 'Човешки меланопсин в лабораторни клетки. Не е тест с хора.',
    finding: 'Пигментът в окото, който усеща „още е ден“, реагира най-силно около 479 nm — пак в диапазона, който Evening филтрира.',
    limit: 'Клетъчен опит; мерен е самият пигмент.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/23554393/',
    doi: '10.1098/rspb.2012.2987',
  },
  {
    n: 3,
    authors: 'Gooley et al.',
    year: '2010',
    journal: 'Science Translational Medicine',
    people: 'Здрави хора на 18–30 г.: 24 на 460 nm и 24 на 555 nm.',
    finding: 'Синята светлина държи вечерния сигнал по-устойчиво, колкото по-дълго свети. Затова силният филтър има смисъл точно вечер, за по-дълги часове пред екран и лампи.',
    limit: 'Тясна лабораторна светлина, 6,5 часа.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/20463367/',
    doi: '10.1126/scitranslmed.3000741',
  },
  {
    n: 4,
    authors: 'Shechter et al.',
    year: '2018',
    journal: 'Journal of Psychiatric Research',
    people: '14 възрастни. Кехлибарени филтри 2 часа преди лягане, 7 нощи.',
    finding: 'Изследване върху други кехлибарени филтри, носени вечер.',
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
    finding: 'Изследване върху други очила за вечерта.',
    limit: 'Не е тест на AMPÉ.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/33707105/',
    doi: '10.1016/j.sleh.2021.02.004',
  },
  {
    n: 6,
    authors: 'Lawrenson, Hull and Downie',
    year: '2017',
    journal: 'Ophthalmic and Physiological Optics',
    people: 'Преглед на 3 рандомизирани проучвания, общо 136 души.',
    finding: 'Преглед до 2017 г. на други синьо-филтриращи очила.',
    limit: 'Не е тест на AMPÉ.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/29044670/',
    doi: '10.1111/opo.12406',
  },
  {
    n: 7,
    authors: 'Luna-Rangel et al.',
    year: '2025',
    journal: 'Frontiers in Neurology',
    people: 'Три двойно слепи опита, общо 49 възрастни.',
    finding: 'По-нов преглед на други филтриращи очила.',
    limit: 'Не е тест на AMPÉ.',
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
            {t('Измерени пластмасови стъкла.')}<br />{t('Ето числата.')}
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-linen/85">
            {t('AMPÉ Evening спира 99,29% от синята светлина в диапазона 380–500 nm и 100% от UV лъчите (UV400). AMPÉ Daily е лек филтър за деня пред екрана — до 99% при 450 nm. Рамката е 22 г кристален ацетат.')}
          </p>
          <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroStat value={99.29} decimals={2} suffix="%" label={t('Evening, синя светлина 380–500 nm')} />
            <HeroStat value={100} suffix="%" label={t('UV400, AMPÉ Evening')} />
            <HeroStat value={99} prefix={t('до')} suffix="%" label={t('Daily, пик 450 nm')} />
            <HeroStat value={22} suffix={t(' г')} label={t('рамка, кристален ацетат')} />
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-content px-6 py-14 md:px-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <SectionNav locale={locale} label="Секции на страницата" items={nav} />
        <div className="min-w-0 space-y-20">
          <section id="svetlina" className="scroll-mt-32">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Светлината и окото')}</p>
            <h2 className="mt-2 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">{t('Защо филтрираме синята светлина вечер')}</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 font-sans text-sm leading-relaxed text-stone">
                <p>{t('Екраните и лампите вечер излъчват много синя светлина. За тялото този сигнал значи, че още е ден. В окото има клетки, които са най-чувствителни точно в синия диапазон — около 446–477 nm, с връх около 464 nm.')}</p>
                <p>{t('Затова AMPÉ Evening е силен филтър в 380–500 nm: покрива този диапазон и е измерено, че спира 99,29% от синята светлина в него, плюс 100% от UV лъчите (UV400). AMPÉ Daily е лек жълт филтър за деня пред екрана — до 99% при 450 nm — създаден да бъде по-приятен за очите при дълга работа.')}</p>
              </div>
              <SpectrumDiagram
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
            </div>
            <div className="mt-6 grid items-start gap-3 sm:grid-cols-2">
              <article className="h-fit rounded-[24px] border border-iron/15 bg-sand/40 p-3">
                <p className="font-sans text-[10px] uppercase tracking-widest text-stone">AMPÉ Daily · {t('Дневни пластмасови стъкла')}</p>
                <h3 className="mt-2 font-serif text-2xl">{t('Жълти, за всеки ден')}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('Лек филтър — до 99% при 450 nm. Пропускат 85% видима светлина: лек оттенък за целодневна работа пред екран.')}</p>
              </article>
              <article className="h-fit rounded-[24px] bg-iron p-3 text-linen">
                <p className="font-sans text-[10px] uppercase tracking-widest text-gold">AMPÉ Evening · {t('Вечерни пластмасови стъкла')}</p>
                <h3 className="mt-2 font-serif text-2xl">{t('Оранжев филтър, за вечер')}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-linen/80">{t('Измерено: 99,29% от синята светлина в 380–500 nm и 100% UV (UV400). Пропускат 54% видима светлина, категория 1.')}</p>
              </article>
            </div>
          </section>

          <section id="laboratoria" className="scroll-mt-32">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Резултати по пластмасово стъкло')}</p>
            <h2 className="mt-2 font-serif text-4xl">{t('Измерените числа')}</h2>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-stone">
              {t('AMPÉ Evening е мерено по BS EN ISO 12312-1, ANSI Z80.3 и AS/NZS 1067.1. В доклада е отбелязано Measured by AHD TMS. Ето стойностите.')}
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <LabBars
                title={t('Дневни пластмасови стъкла')}
                code="AMPÉ Daily"
                rows={[
                  { label: t('Светлопропускливост (Tv)'), text: '85%', width: 85, note: t('Почти прозрачни') },
                  { label: t('Синя светлина'), text: t('до 99%'), width: 99, note: t('При пика от 450 nm') },
                  { label: t('За какво е'), text: locale === 'en' ? 'For every day' : 'За всеки ден', width: 0, note: t('Целодневна работа пред екран') },
                ]}
              />
              <LabBars
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
                    [t('Светлопропускливост (Tv)'), '85%', t('Почти прозрачни'), '54%', t('Видим оранжев оттенък')],
                    [t('Синя светлина'), t('до 99%'), t('При пика от 450 nm'), t('99,29%'), t('380–500 nm')],
                    [t('UV блокиране'), '—', '', '100%', t('UV400, UVA + UVB = 0,00%')],
                    [t('Филтърна категория'), t('Лек оттенък, за деня'), '', '1', t('За вечерта и преди лягане')],
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
              {t('Числата за AMPÉ Evening са от доклада, мерен по трите стандарта по-долу. „До 99% при 450 nm“ и 85% са публикуваните стойности за AMPÉ Daily.')}
            </p>
          </section>

          <section id="sertifikati" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Три стандарта, едно измерване')}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {standards.map((standard) => (
                <article key={standard.code} className="flex flex-col rounded-[28px] bg-iron p-6 text-linen">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-gold">{t(standard.region)}</p>
                  <h3 className="mt-3 font-serif text-2xl leading-snug">{standard.code}</h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-linen/80">{t(standard.what)}</p>
                  <p className="mt-4 font-sans text-xs text-linen/70">{t('AMPÉ Evening е мерено по този стандарт.')}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="tehnologia" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Два чифта, една рамка')}</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <figure className="overflow-hidden rounded-[28px] bg-sand/40">
                <div className="relative h-64">
                  <Image src="/images/shop/shop-daily-1.png" alt={t('Чифт AMPÉ Daily с жълти пластмасови стъкла')} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="p-5">
                  <h3 className="font-serif text-2xl">{t('Дневни пластмасови стъкла')} · AMPÉ Daily</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('Жълти пластмасови стъкла за всеки ден и за целодневна работа пред екран. Лек филтър — до 99% при 450 nm — създаден да бъде по-приятен за очите при дълга работа. Имат антирефлексно покритие и са устойчиви на драскотини.')}</p>
                  <Link href={href('/product/alpe-daily')} className="mt-3 inline-block font-sans text-sm underline decoration-gold underline-offset-4">{t('Разгледай AMPÉ Daily →')}</Link>
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-[28px] bg-iron text-linen">
                <div className="relative h-64">
                  <Image src="/images/shop/shop-evening-1.png" alt={t('Чифт AMPÉ Evening с оранжеви пластмасови стъкла')} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="p-5">
                  <h3 className="font-serif text-2xl">{t('Вечерни пластмасови стъкла')} · AMPÉ Evening</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-linen/80">{t('Оранжеви пластмасови стъкла за вечерта и преди лягане. Спират 99,29% от синята светлина в 380–500 nm и 100% от UV лъчите (UV400). Категория 1, видим оранжев оттенък. Създадени да помогнат за по-спокойна вечерна рутина.')}</p>
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
                <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('22 г кристален ацетат — осезаемо по-лека от обикновена рамка. Създадена да се носи цял ден.')}</p>
              </div>
            </div>
          </section>

          <section id="prouchvania" className="scroll-mt-32">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Защо този диапазон')}</p>
            <h2 className="mt-2 font-serif text-4xl">{t('Какво казва науката за светлината')}</h2>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-stone">{t('Синята светлина вечер казва на тялото, че още е ден. Тези трудове показват защо — и затова филтърът на AMPÉ Evening е в диапазона 380–500 nm, където е измерено 99,29%. Нашите числа са от измерването по-горе.')}</p>
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
            <h2 className="font-serif text-4xl">{t('Как се използват')}</h2>
            <ol className="mt-6 space-y-4">
              {[
                ['Сутрин и през деня', 'Използвай AMPÉ Daily, докато работиш пред екрана. Лек жълт филтър, създаден да бъде по-приятен за очите при дълга работа.'],
                ['Два-три часа преди лягане', 'Използвай AMPÉ Evening около 2–3 часа преди лягане. Силен оранжев филтър за вечерта. Много хора го правят като вечерна рутина.'],
                ['Защо вечерните са по-тъмни', 'AMPÉ Evening пропуска 54% видима светлина и е категория 1. Оттенъкът е самият филтър — създадени са за вечерта и преди лягане, не за пътя.'],
                ['С няколко вечери', 'Носи ги няколко вечери подред — така се усеща най-добре. Може да помогне за по-спокойна вечер. Ако не са за теб, имаш 14 дни да ги върнеш.'],
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
            <p className="mt-2 font-sans text-xs text-stone">{t('Клиент с очила AMPÉ.')}</p>
          </section>

          <section id="metod" className="scroll-mt-32 rounded-[28px] bg-[#B8906A] p-6 text-linen md:p-8">
            <h2 className="font-serif text-4xl">{t('Как е правен тестът')}</h2>
            <ul className="mt-5 space-y-3 font-sans text-sm leading-relaxed text-linen/90">
              <li>{t('AMPÉ Evening е мерено по BS EN ISO 12312-1, ANSI Z80.3 и AS/NZS 1067.1.')}</li>
              <li>{t('В доклада е отбелязано Measured by AHD TMS.')}</li>
              <li>{t('Мерени са светлопропускливост, UV, синя светлина, категория и разпознаване на светофар.')}</li>
              <li>{t('Резултатът: 99,29% от синята светлина в 380–500 nm, 100% UV (UV400), категория 1, 54% видима светлина.')}</li>
            </ul>
          </section>

          <section id="vuprosi" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Въпроси')}</h2>
            <div className="mt-5 space-y-3">
              {[
                ['Наистина ли работят тези очила?', 'AMPÉ Evening спира 99,29% от синята светлина в 380–500 nm и 100% от UV лъчите — това е измерено. AMPÉ Daily е лек филтър за деня, до 99% при 450 nm. Много хора използват Evening като вечерна рутина. Може да помогне за по-спокойна вечер. Ако не усетиш разлика, имаш 14 дни да ги върнеш.'],
                ['Това лечение на безсъние ли е?', 'Не. AMPÉ не е медицинско изделие и не замества лекар. Създадени са за комфорт пред екрана и за вечерна рутина.'],
                ['Защо два чифта?', 'AMPÉ Daily е за деня пред екрана. AMPÉ Evening е за вечерта и преди лягане. Заедно покриват целия ден. При два чифта доставката е безплатна.'],
                ['Може ли да ги нося цял ден?', 'AMPÉ Daily — да, за това са. Рамката е 22 г кристален ацетат и повечето хора свикват още първия ден. AMPÉ Evening е за вечерта.'],
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
