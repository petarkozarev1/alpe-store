import type { BenefitItem, StepItem, Ingredient, FaqItem } from '@/lib/types'

import type { Locale } from '@/lib/i18n/config'
import { localizeValue } from '@/lib/i18n/translations'

export const heroContent = {
  badge: '✓ Тествани в AHD TMS · UV400',
  headlinePart1: 'Очите ти заслужават почивка.',
  headlinePart2Before: 'Дай им',
  headlinePart2After: 'я.',
  subtext: 'Дневните филтрират 65% от синята светлина, вечерните — 98% от синята и зелената. За екрана, не за лечение.',
  cta: 'Вземи си чифт',
  heroFaceImages: [
    { src: '/images/hero/person-5-day.png',   alt: 'Woman wearing AMPÉ Day glasses — clear frame, yellow lenses',   objectPosition: '50% 25%' },
    { src: '/images/hero/person-1-night.png', alt: 'Man wearing AMPÉ Night glasses — dark frame, orange lenses',    objectPosition: '50% 25%' },
    { src: '/images/hero/person-4-day.png',   alt: 'Woman wearing AMPÉ Day glasses — clear frame, yellow lenses',   objectPosition: '45% 25%' },
    { src: '/images/hero/person-3-day.png',   alt: 'Man wearing AMPÉ Day glasses — clear frame, gold lenses',       objectPosition: '55% 25%' },
    { src: '/images/hero/person-2-day.png',   alt: 'Woman wearing AMPÉ Day glasses — clear frame, yellow lenses',   objectPosition: '35% 20%' },
    { src: '/images/hero/person-6-night.png', alt: 'Man wearing AMPÉ Night glasses — clear frame, orange lenses',   objectPosition: '50% 25%' },
  ],
}

export const benefits: BenefitItem[] = [
  { id: 'eye-strain', headline: 'За дългия ден пред екрана', side: 'right' },
  { id: 'sleep', headline: 'За вечерта след залез', side: 'left' },
  { id: 'focus', headline: 'Цветовете остават достатъчно верни', side: 'right' },
]

export const darkCtaContent = {
  socialProof: 'Две лещи. Един ден.',
  headline: 'За деня пред екрана. И за вечерта.',
  cta: 'Разгледай колекцията',
}

export const ingredientsContent = {
  badge: 'Технология на стъклата',
  headline: 'Създадено за\n"Дигиталната Ера"',
  editorialImage: '/images/glasses-duo2.png',
  editorialImageAlt: 'AMPÉ precision lens technology — blue light filter, anti-glare, UV400',
  sectionTitle: 'Какво има във всяко стъкло?',
  cta: 'Виж стъклата',
}

export const ingredients: Ingredient[] = [
  { number: 1, name: 'Филтър за синя светлина', description: 'Дневни: до 99% при 450 nm. Вечерни: 99,21% в 475–650 nm. Тест AHD TMS.' },
  { number: 2, name: 'Филтър за зелена светлина', description: 'Вечерните филтрират 98% от зелената светлина (500–560 nm). Дневните са с частичен филтър.', badge: 'НОВО' },
  { number: 3, name: 'UV400 защита', description: 'В лабораторията е 100% UV и при двете лещи.' },
  { number: 4, name: 'Устойчиви лещи', description: 'Издържат на ежедневието, без драскотини.' },
  { number: 5, name: 'Лека рамка', description: 'Слагаш и забравяш, че ги има.' },
  { number: 6, name: 'Антирефлексно покритие', description: 'Край на блясъка от екрана и лампите.' },
]

export const howItWorksContent = {
  badge: 'Как работи',
  headline: 'Лесно.\nПросто работи.',
  cta: 'Пробвай ги',
}

export const steps: StepItem[] = [
  {
    number: 1,
    title: 'Сложи ги',
    description: 'Сложи дневните, докато работиш, и вечерните поне 2 часа преди сън. Така ги носим. Не е лекарска схема.',
    image: '/images/how-it-works-selfie.jpg',
  },
  {
    number: 2,
    title: 'Филтрирай',
    description: 'Дневните филтрират синята светлина, вечерните — синята и зелената. Числата са на страницата за стъклата.',
    image: '/images/how-it-works-filter.jpg',
  },
  {
    number: 3,
    title: 'Почини си',
    description: 'Вечерните се слагат поне 2 часа преди сън. Не обещаваме по-дълъг сън.',
    image: '/images/how-it-works-rest.jpg',
  },
]

export const beforeAfterContent = {
  badge: 'Защо AMPÉ?',
  headline: 'Умора вчера.\nЯснота днес.',
  beforeImage: '/images/before.png',
  afterImage: '/images/after.png',
}

export const withoutItems: string[] = [
  'Очите те болят преди обяд',
  'Главоболие след работа',
  'Въртиш се в леглото до полунощ',
  'Не можеш да се съсредоточиш',
  'Сухи, зачервени очи',
  'Екран и след залез',
]

export const withItems: string[] = [
  'Дневни лещи за работа пред екрана',
  '65% филтър на синята светлина',
  'Вечерни лещи след залез',
  'Лек жълт или оранжев оттенък',
  'Антирефлексно покритие',
  'Вечерните: 98% синя (415–455 nm) и 98% зелена (500–560 nm)',
]

export const testimonialContent = {
  badge: 'Какво казват клиентите',
  quote: 'Работя по 10 часа на ден пред компютър. След като започнах да нося AMPÉ, главоболието изчезна за няколко дни. Сега заспивам веднага щом легна.',
  author: 'Александър М., София',
  stars: 5,
}

export const galleryContent = {
  headline: 'Всеки ден. С AMPÉ.',
  images: [
    '/images/customers/01.jpg',
    '/images/customers/02.jpg',
    '/images/customers/03.jpg',
    '/images/customers/04.jpg',
    '/images/customers/05.jpg',
  ],
  cta: 'Намери своя чифт',
}

export const faqs: FaqItem[] = [
  {
    question: 'Наистина ли работят тези очила?',
    answer: 'Лабораторията AHD TMS мери филтъра: до 99% при 450 nm на дневните и 99,21% в 475–650 nm на вечерните. На продукта пишем 65% и 98%. Очилата не са медицинско изделие.',
  },
  {
    question: 'Може ли да ги нося цял ден?',
    answer: 'Да — за това са направени. Рамката е лека и удобна, така че повечето клиенти забравят, че изобщо ги носят.',
  },
  {
    question: 'Изкривяват ли цветовете на екрана?',
    answer: 'Минимално. Дневните лещи имат лек жълтеникав оттенък, вечерните — оранжев. Свикваш за минути и повечето хора дори не го забелязват след малко.',
  },
  {
    question: 'Работят ли с диоптрични стъкла?',
    answer: 'Свържи се с нас и ще намерим решение заедно.',
  },
]

export const faqSectionContent = {
  badge: 'Често задавани въпроси',
  headline: 'Всичко, което трябва да\nзнаеш за AMPÉ',
  cta: 'Поръчай сега',
}

export const finalCtaContent = {
  badge: 'Вземи своя чифт',
  headline: 'За деня и за вечерта.',
  cta: 'Вземи своя чифт',
  image: '/images/final-cta.png',
  subtext: 'BS EN ISO 12312-1 · ANSI Z80.3 · AS/NZS 1067.1 · Безплатна доставка за 2+ чифта',
}

export function getLandingContent(locale: Locale) {
  return localizeValue(locale, {
    heroContent, benefits, darkCtaContent, ingredientsContent, ingredients,
    howItWorksContent, steps, beforeAfterContent, withoutItems, withItems,
    testimonialContent, galleryContent, faqs, faqSectionContent, finalCtaContent,
  })
}
