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
  { id: 'tehnologia', label: 'Лещи и рамка' },
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

const studies = [
  {
    n: 1,
    authors: 'Brainard et al.',
    year: '2001',
    journal: 'Journal of Neuroscience',
    people: '72 здрави възрастни (37 жени, 35 мъже), средна възраст 24,5 г.',
    finding: 'При нощни тестове с разширени зеници монохромната светлина между 446 и 477 nm потиска мелатонина най-силно. Кривата съвпада с опсинов шаблон с връх при 464 nm.',
    limit: 'Това е лабораторен тест със силна светлина, не измерване на очила AMPÉ и не на обикновен екран вкъщи.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/11487664/',
    doi: '10.1523/JNEUROSCI.21-16-06405.2001',
  },
  {
    n: 2,
    authors: 'Bailes and Lucas',
    year: '2013',
    journal: 'Proceedings of the Royal Society B',
    people: 'Човешки меланопсин, изразен в лабораторни клетки HEK293. Не е изпитване с хора.',
    finding: 'Спектърът на калциевия отговор достига връх при 479 nm. Това е директно измерване на пигмента, не на готов чифт очила.',
    limit: 'Клетъчен модел. Не доказва какъв процент от тази светлина спира конкретна леща.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/23554393/',
    doi: '10.1098/rspb.2012.2987',
  },
  {
    n: 3,
    authors: 'Gooley et al.',
    year: '2010',
    journal: 'Science Translational Medicine',
    people: 'Здрави млади хора, 18–30 г.: 24 души на 460 nm и 24 души на 555 nm.',
    finding: 'В началото на облъчването зелената светлина от 555 nm потиска мелатонина колкото синята от 460 nm. При по-дълга експозиция чувствителността към 555 nm спада, а меланопсинът остава основен при дълга и силна светлина.',
    limit: 'Тяснолентова лабораторна светлина в продължение на 6,5 часа. Не е тест на вечерни лещи.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/20463367/',
    doi: '10.1126/scitranslmed.3000741',
  },
  {
    n: 4,
    authors: 'Shechter et al.',
    year: '2018',
    journal: 'Journal of Psychiatric Research',
    people: '14 възрастни със симптоми на безсъние. Кръстосан опит: кехлибарени срещу прозрачни лещи, 2 часа преди лягане, 7 нощи.',
    finding: 'С кехлибарените лещи субективните оценки за сън и актиграфското общо време на сън са по-добри, отколкото с прозрачните. Лещите в опита пропускат около 90% видима светлина и поглъщат около 65% синя светлина — различни числа от лабораторните редове на AMPÉ.',
    limit: 'Малка група хора със симптоми на безсъние. Резултатът не се пренася автоматично върху лещите JX-Y8016 или JX-Y8008.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/29101797/',
    doi: '10.1016/j.jpsychires.2017.10.015',
  },
  {
    n: 5,
    authors: 'Bigalke et al.',
    year: '2021',
    journal: 'Sleep Health',
    people: '20 здрави възрастни (11 мъже, 9 жени), средна възраст 32 ± 12 г. Кръстосан опит, очила от 18:00 до лягане.',
    finding: 'Блокиращите синя светлина очила скъсяват субективното заспиване (21 ± 28 срещу 24 ± 21 минути) и броя на събужданията. Обективното време на сън не се подобрява и клони към по-кратък сън.',
    limit: 'Здрави доброволци, не клиентска група на AMPÉ. Авторите заключават, че обективният сън не се подобрява.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/33707105/',
    doi: '10.1016/j.sleh.2021.02.004',
  },
  {
    n: 6,
    authors: 'Lawrenson, Hull and Downie',
    year: '2017',
    journal: 'Ophthalmic and Physiological Optics',
    people: 'Систематичен преглед на 3 рандомизирани проучвания с общо 136 участници.',
    finding: 'Няма достатъчно качествени доказателства, че очилата със синьо-блокиращи лещи подобряват зрението, съня или умората на очите при общата популация, нито че пазят макулата.',
    limit: 'Прегледът е до април 2017 г. и покрива други лещи, не докладите на AHD TMS.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/29044670/',
    doi: '10.1111/opo.12406',
  },
  {
    n: 7,
    authors: 'Luna-Rangel et al.',
    year: '2025',
    journal: 'Frontiers in Neurology',
    people: 'Метаанализ на 3 двойно слепи кръстосани опита, общо 49 възрастни, с актиграфия.',
    finding: 'Разликите в заспиването, общото време на сън, ефективността и нощните будения не са статистически значими. Авторите пишат, че настоящите опити не подкрепят значим обективен ефект.',
    limit: 'Малък брой опити и различни протоколи. Не включва измерванията на лещите AMPÉ.',
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
          src="/images/customers/01.jpg"
          alt={t('Клиент с очила AMPÉ')}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_62%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/60 to-onyx/15" />
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-content flex-col justify-end px-6 pb-14 md:px-10">
          <p className="font-sans text-xs uppercase tracking-widest text-linen/80">{t('Официална документация')}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[0.95] text-linen md:text-7xl">
            {t('Измерени лещи.')}<br />{t('Доказани резултати.')}
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-linen/85">
            {t('Лещите JX-Y8016 (дневни, жълти) и JX-Y8008 (вечерни, оранжеви) са тествани от независимата лаборатория AHD TMS. Числата по-долу са това публикувано обобщение. Изследванията за светлина и сън са за други условия и други лещи.')}
          </p>
          <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroStat value={100} suffix="%" label={t('UV, и двете лещи')} />
            <HeroStat value={99} prefix={t('до')} suffix="%" label={t('Дневни, пик 450 nm')} />
            <HeroStat value={99.21} decimals={2} suffix="%" label={t('Вечерни, 475–650 nm')} />
            <HeroStat value={22} suffix={t(' г')} label={t('Рамка, кристален ацетат')} />
          </dl>
          <p className="mt-4 max-w-3xl font-sans text-xs leading-relaxed text-linen/75">{t('Очилата AMPÉ не са медицинско изделие.')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-content px-6 py-14 md:px-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <SectionNav locale={locale} label="Секции на страницата" items={nav} />
        <div className="min-w-0 space-y-20">
          <section id="svetlina" className="scroll-mt-32">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Как светлината стига до тялото')}</p>
            <h2 className="mt-2 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">{t('Синьото и зеленото не са еднакви. И двете са изследвани.')}</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 font-sans text-sm leading-relaxed text-stone">
                <p>{t('Част от ганглийните клетки в ретината носят пигмента меланопсин и са светлочувствителни сами по себе си. В клетъчен опит човешкият меланопсин достига връх при 479 nm [2]. При хора, с разширени зеници през нощта, най-силният диапазон за потискане на мелатонина е 446–477 nm, с изчислен връх 464 nm [1].')}</p>
                <p>{t('Зелената светлина също участва. В началото на лабораторно облъчване 555 nm потиска мелатонина колкото 460 nm. При по-дълга експозиция късите вълни остават по-силни [3]. Затова продуктовата страница говори и за 500–560 nm, отделно от лабораторния ред 475–650 nm.')}</p>
                <p className="rounded-2xl border border-gold/50 bg-sand/50 p-4 text-iron">
                  {t('Очилата AMPÉ не са медицинско изделие. Не лекуват, не предотвратяват и не диагностицират безсъние или друго заболяване. Предназначени са да филтрират светлина в публикуваните диапазони.')}
                </p>
              </div>
              <SpectrumDiagram
                caption={t('Спектър с отбелязани публикувани диапазони. Не е нова лабораторна крива.')}
                bands={[
                  { from: 446, to: 477, label: t('Brainard, 446–477 nm') },
                  { from: 475, to: 650, label: t('Вечерни, лаборатория 475–650 nm') },
                  { from: 500, to: 560, label: t('Продуктово описание, зелено 500–560 nm') },
                ]}
                marks={[
                  { nm: 450, label: '450', note: t('Дневни, лаборатория') },
                  { nm: 464, label: '464', note: t('Brainard, връх') },
                  { nm: 479, label: '479', note: t('Меланопсин') },
                  { nm: 555, label: '555', note: t('Gooley, зелено') },
                ]}
              />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <article className="rounded-[24px] border border-iron/15 bg-sand/40 p-5">
                <p className="font-sans text-[10px] uppercase tracking-widest text-stone">JX-Y8016 · {t('Дневни лещи')}</p>
                <h3 className="mt-2 font-serif text-2xl">{t('Жълти, почти прозрачни')}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('Лабораторията отчита до 99% при пика от 450 nm и 85% видима светлопропускливост. Продуктовата страница описва същите дневни лещи като филтър на 65% от синята светлина. Двете описания стоят отделно, защото пълната спектрална таблица не е публикувана.')}</p>
              </article>
              <article className="rounded-[24px] bg-iron p-5 text-linen">
                <p className="font-sans text-[10px] uppercase tracking-widest text-gold">JX-Y8008 · {t('Вечерни лещи')}</p>
                <h3 className="mt-2 font-serif text-2xl">{t('Оранжев филтър')}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-linen/80">{t('Лабораторията отчита 99,21% в 475–650 nm и 54% видима светлопропускливост. Продуктовата страница описва 98% в 415–455 nm и 98% зелена светлина в 500–560 nm. И тези редове остават отделни.')}</p>
              </article>
            </div>
          </section>

          <section id="laboratoria" className="scroll-mt-32">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Резултати по леща')}</p>
            <h2 className="mt-2 font-serif text-4xl">{t('Само редовете от AHD TMS')}</h2>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-stone">
              {t('Лабораторен доклад: AHD TMS · Стандарти: BS EN ISO 12312-1:2013+A1:2015, ANSI Z80.3-2015, AS/NZS 1067.1:2016')}
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <LabBars
                title={t('Дневни лещи')}
                code="jx-y8016"
                rows={[
                  { label: t('Светлопропускливост (Tv)'), text: '85%', width: 85, note: t('Почти прозрачни') },
                  { label: t('UV блокиране'), text: '100%', width: 100, note: 'UVA + UVB = 0.00%' },
                  { label: t('Синя светлина'), text: t('до 99%'), width: 99, note: t('Блокира вредния 450nm пик') },
                ]}
              />
              <LabBars
                title={t('Вечерни лещи')}
                code="jx-y8008"
                dark
                rows={[
                  { label: t('Светлопропускливост (Tv)'), text: '54%', width: 54, note: t('Видимо оранжев оттенък') },
                  { label: t('UV блокиране'), text: '100%', width: 100, note: 'UVA + UVB = 0.00%' },
                  { label: t('Синя светлина (475–650nm)'), text: '99.21%', width: 99.21, note: t('Максимална мелатонинова защита') },
                ]}
              />
            </div>
            <div className="mt-6 overflow-x-auto rounded-[28px] border border-iron/15">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">{t('Сравнение на лабораторните редове за дневни и вечерни лещи')}</caption>
                <thead className="bg-sand">
                  <tr>
                    <th className="px-4 py-4 font-sans text-xs font-medium">{t('Показател')}</th>
                    <th className="px-4 py-4 font-sans text-xs font-medium">{t('Дневни лещи')}<span className="mt-1 block font-normal text-stone">jx-y8016</span></th>
                    <th className="px-4 py-4 font-sans text-xs font-medium">{t('Вечерни лещи')}<span className="mt-1 block font-normal text-stone">jx-y8008</span></th>
                  </tr>
                </thead>
                <tbody className="font-sans text-sm">
                  {[
                    [t('Светлопропускливост (Tv)'), '85%', t('Почти прозрачни'), '54%', t('Видимо оранжев оттенък')],
                    [t('UV блокиране'), '100%', 'UVA + UVB = 0.00%', '100%', 'UVA + UVB = 0.00%'],
                    [t('Синя светлина'), t('до 99%'), t('Блокира вредния 450nm пик'), '99.21%', t('Синя светлина (475–650nm)')],
                    [t('Филтърна категория'), '0', t('Подходящи за шофиране'), '1', t('За вечерна употреба')],
                    [t('Разпознаване на светофар'), '✓ PASS', t('Безопасни за употреба на улицата'), '✓ PASS', t('Тествано и преминато')],
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
              {t('Пълните PDF доклади не са качени в сайта. Няма връзка за сваляне, защото файлът не е в проекта. Таблицата повтаря единственото публикувано обобщение.')}
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
                  <p className="mt-4 font-sans text-xs text-linen/70">{t('И двете лещи са отбелязани като преминали този стандарт. Текстът на самия стандарт не е приложен, защото се разпространява от издателя.')}</p>
                </article>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <article className="rounded-[24px] border border-iron/15 p-5">
                <h3 className="font-serif text-2xl">UV400</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('Продуктовата страница означава защитата като UV400. Лабораторният ред за същото е 100% UV, UVA + UVB = 0.00%, и при двете лещи.')}</p>
              </article>
              <article className="rounded-[24px] border border-iron/15 p-5">
                <h3 className="font-serif text-2xl">{t('Зелена светлина')}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('Продуктовата страница сочи 500–560 nm и описва 98% блокиране на зелената светлина при вечерните лещи и частичен филтър при дневните. Това не е отделен сертификат.')}</p>
              </article>
            </div>
          </section>

          <section id="tehnologia" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Две лещи, една рамка')}</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <figure className="overflow-hidden rounded-[28px] bg-sand/40">
                <div className="relative h-64">
                  <Image src="/images/shop/shop-daily-1.png" alt={t('Чифт AMPÉ Daily с жълти стъкла')} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="p-5">
                  <h3 className="font-serif text-2xl">{t('Дневни лещи')} · JX-Y8016</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('За работния ден пред екрана. Категория 0 и отбелязани като подходящи за шофиране. Антирефлексно покритие и устойчивост на драскотини са част от продуктовото описание, не от таблицата на AHD TMS.')}</p>
                  <Link href={href('/product/alpe-daily')} className="mt-3 inline-block font-sans text-sm underline decoration-gold underline-offset-4">{t('Разгледай AMPÉ Daily →')}</Link>
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-[28px] bg-iron text-linen">
                <div className="relative h-64">
                  <Image src="/images/shop/shop-evening-1.png" alt={t('Чифт AMPÉ Evening с оранжеви стъкла')} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="p-5">
                  <h3 className="font-serif text-2xl">{t('Вечерни лещи')} · JX-Y8008</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-linen/80">{t('За вечерта. Категория 1. Разпознаването на светофар е PASS и при тях. По-ниската светлопропускливост от 54% е причината оттенъкът да се вижда.')}</p>
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
                <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('Продуктовата страница публикува рамката като кристален ацетат с тегло 22 г и я сравнява с обикновена пластмаса от 35–50 г. Сравнението не е част от лабораторния доклад за лещите.')}</p>
              </div>
            </div>
          </section>

          <section id="prouchvania" className="scroll-mt-32">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone">{t('Чужди изследвания')}</p>
            <h2 className="mt-2 font-serif text-4xl">{t('Какво казват проучванията, и какво не казват')}</h2>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-stone">{t('Никое от тези проучвания не е правено с лещи AMPÉ. Връзките сочат към PubMed, където абстрактът може да се прочете.')}</p>
            <div className="mt-6 grid gap-4">
              {studies.map((study) => (
                <article key={study.n} className="rounded-[28px] border border-iron/15 bg-cream p-5 md:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-2xl">[{study.n}] {study.authors}, {study.year}</h3>
                    <p className="font-sans text-xs uppercase tracking-widest text-stone">{study.journal}</p>
                  </div>
                  <p className="mt-3 font-sans text-sm text-iron"><span className="text-stone">{t('Участници')}: </span>{t(study.people)}</p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-iron">{t(study.finding)}</p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{t('Ограничение')}: {t(study.limit)}</p>
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
                ['Сутрин и през работния ден', 'Използвайте дневните очила по време на работа. JX-Y8016 е категория 0 и е отбелязана като подходяща за шофиране.'],
                ['Поне два часа преди лягане', 'Използвайте вечерните очила поне 2 часа преди лягане. Това е указанието от страницата „Как работи“, не лекарска схема.'],
                ['Защо вечерните са по-тъмни', 'JX-Y8008 пропуска 54% видима светлина и е категория 1, за вечерна употреба. Светофарът е PASS.'],
                ['Какво да не очакваш от една нощ', 'Проучванията при здрави възрастни не показват стабилно по-дълъг обективен сън [5, 7]. Малък опит при хора със симптоми на безсъние съобщава по-добри оценки [4].'],
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
            <p className="mt-2 font-sans text-xs text-stone">{t('Клиентско видео от продуктовата страница. Не е участник в цитираните проучвания.')}</p>
          </section>

          <section id="metod" className="scroll-mt-32 rounded-[28px] bg-[#B8906A] p-6 text-linen md:p-8">
            <h2 className="font-serif text-4xl">{t('Какво знаем за теста')}</h2>
            <ul className="mt-5 space-y-3 font-sans text-sm leading-relaxed text-linen/90">
              <li>{t('Лещите са изпратени в независима лаборатория. Името, което сайтът публикува, е AHD TMS.')}</li>
              <li>{t('Публикувани са два кода: JX-Y8016 за дневните и JX-Y8008 за вечерните.')}</li>
              <li>{t('Отчетени са светлопропускливост, UV, синя светлина, филтърна категория и разпознаване на светофар, спрямо трите стандарта по-горе.')}</li>
              <li>{t('Не са публикувани датата, уредът, броят образци и суровият спектрален файл. Затова страницата не чертае крива точка по точка.')}</li>
            </ul>
          </section>

          <section id="vuprosi" className="scroll-mt-32">
            <h2 className="font-serif text-4xl">{t('Въпроси')}</h2>
            <div className="mt-5 space-y-3">
              {[
                ['Наистина ли работят тези очила?', 'Лабораторията измерва филтъра. Дали това променя съня ти е отделен въпрос: опитите с други синьо-блокиращи очила са малки и смесени [4–7].'],
                ['Това лечение на безсъние ли е?', 'Не. Очилата не са медицинско изделие и страницата не обещава лечение, профилактика или диагноза.'],
                ['Защо дневните са „до 99%“ и същевременно „65%“?', '85% светлопропускливост и „до 99%“ при 450 nm са лабораторното обобщение. 65% е продуктовото описание на дневния филтър. Без пълната спектрална таблица не ги събираме в едно число.'],
                ['Къде е PDF доклат?', 'Не е качен. Няма бутон за сваляне, защото файлът липсва в проекта.'],
                ['Може ли да ги нося цял ден?', 'Да — за това са направени. Рамката е лека и удобна, така че повечето клиенти забравят, че изобщо ги носят.'],
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
