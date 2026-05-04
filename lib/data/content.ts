import type { BenefitItem, StepItem, Ingredient, FaqItem } from '@/lib/types'

export const heroContent = {
  badge: '✓ EU сертифицирани · ★★★★★ 1000+ доволни клиенти',
  headlinePart1: 'Очите ти заслужават почивка.',
  headlinePart2Before: 'Дай им',
  headlinePart2After: 'я.',
  subtext: 'Блокираме до 99% от синята и зелената светлина за по-малко умора, по-добър сън и повече енергия всеки ден.',
  cta: 'Защити очите си',
  heroFaceImages: [
    { src: '/images/hero/person-5-day.png',   alt: 'Woman wearing ALPÉ Day glasses — clear frame, yellow lenses',   objectPosition: '50% 25%' },
    { src: '/images/hero/person-1-night.png', alt: 'Man wearing ALPÉ Night glasses — dark frame, orange lenses',    objectPosition: '50% 25%' },
    { src: '/images/hero/person-4-day.png',   alt: 'Woman wearing ALPÉ Day glasses — clear frame, yellow lenses',   objectPosition: '45% 25%' },
    { src: '/images/hero/person-3-day.png',   alt: 'Man wearing ALPÉ Day glasses — clear frame, gold lenses',       objectPosition: '55% 25%' },
    { src: '/images/hero/person-2-day.png',   alt: 'Woman wearing ALPÉ Day glasses — clear frame, yellow lenses',   objectPosition: '35% 20%' },
    { src: '/images/hero/person-6-night.png', alt: 'Man wearing ALPÉ Night glasses — clear frame, orange lenses',   objectPosition: '50% 25%' },
  ],
}

export const benefits: BenefitItem[] = [
  { id: 'eye-strain', headline: 'Край на умората на очите и главоболието', side: 'right' },
  { id: 'sleep', headline: 'Спи по-дълбоко. Събуждай се по-свеж.', side: 'left' },
  { id: 'focus', headline: 'Фокусирай се цял ден', side: 'right' },
]

export const darkCtaContent = {
  socialProof: '1000+ успокоени очи',
  headline: 'Защити очите си. Живей пълноценно.',
  cta: 'Разгледай колекцията',
}

export const ingredientsContent = {
  badge: 'Технология на стъклата',
  headline: 'Създадено за\n"Дигиталната Ера"',
  editorialImage: 'https://via.placeholder.com/1200x500/F0EDE8/000000?text=ALPÉ+Lenses',
  editorialImageAlt: 'ALPÉ precision lens technology — blue light filter, anti-glare, UV400',
  sectionTitle: 'Какво има във всяко стъкло?',
  cta: 'Виж стъклата',
}

export const ingredients: Ingredient[] = [
  { number: 1, name: 'Филтър за синя светлина', description: 'Блокира до 99% от синята светлина — тествано по BS EN ISO 12312-1.' },
  { number: 2, name: 'Филтър за зелена светлина', description: 'Блокира вредната зелена светлина (500–560nm) — свързана с нарушен сън и умора на очите дори след залез.', badge: 'НОВО' },
  { number: 3, name: 'UV400 защита', description: 'Пълна защита, вътре и навън.' },
  { number: 4, name: 'Устойчиви лещи', description: 'Издържат на ежедневието, без драскотини.' },
  { number: 5, name: 'Лека рамка', description: 'Слагаш ги и забравяш, че ги носиш.' },
  { number: 6, name: 'Антирефлексно покритие', description: 'Край на блясъка от екрана и лампите.' },
]

export const howItWorksContent = {
  badge: 'Как работи',
  headline: 'Лесно.\nПросто работи.',
  cta: 'Изпробвай сам',
}

export const steps: StepItem[] = [
  {
    number: 1,
    title: 'Сложи ги',
    description: 'Използвайте дневните очила по време на работа и вечерните поне 2 часа преди лягане. Очите ви ще усетят разликата веднага. По-малко напрежение, повече спокойствие.',
    image: '/images/step1wear.png',
  },
  {
    number: 2,
    title: 'Филтрирай',
    description: 'Лещите филтрират синята и зелената светлина цял ден — без пауза, без умора.',
    image: '/images/step2filter.png',
  },
  {
    number: 3,
    title: 'Почини си',
    description: 'Вечерта тялото ти знае, че е край на деня. Заспиваш по-лесно, спиш по-дълбоко.',
    image: '/images/step3restnew.png',
  },
]

export const beforeAfterContent = {
  badge: 'Защо ALPÉ?',
  headline: 'Умора вчера.\nЯснота днес.',
  beforeImage: '/images/before.png',
  afterImage: '/images/after.png',
}

export const withoutItems: string[] = [
  'Очите горят до обяд',
  'Главоболие след работа',
  'Въртиш се в леглото до полунощ',
  'Не можеш да се съсредоточиш',
  'Сухи, зачервени очи',
  'Зелената светлина нарушава съня дори след залез',
]

export const withItems: string[] = [
  'Очите издържат целия ден',
  'Без главоболие след работа',
  'Заспиваш, когато легнеш',
  'Фокусът се връща',
  'Очите се отпускат',
  'Пълна защита — синя и зелена светлина (415–560nm)',
]

export const testimonialContent = {
  badge: 'Какво казват клиентите',
  quote: 'Работя по 10 часа на ден пред компютър. След като започнах да нося ALPÉ, главоболието изчезна за няколко дни. Сега заспивам веднага щом легна.',
  author: 'Александър М., София',
  stars: 5,
}

export const galleryContent = {
  headline: 'Истинска защита. С ALPÉ.',
  images: [
    'https://via.placeholder.com/300x400/F0EDE8/000000?text=Gallery+1',
    'https://via.placeholder.com/300x400/E8E0D8/000000?text=Gallery+2',
    'https://via.placeholder.com/300x400/D4C5B5/000000?text=Gallery+3',
    'https://via.placeholder.com/300x400/C8B5A0/000000?text=Gallery+4',
  ],
  cta: 'Намери своя чифт',
}

export const faqs: FaqItem[] = [
  {
    question: 'Наистина ли работят тези очила?',
    answer: 'Да. Лещите на ALPÉ са тествани по BS EN ISO 12312-1:2013+A1:2015 и блокират до 99% от синята и зелената светлина. Над 1000 клиенти са усетили разлика в умората на очите и качеството на съня — обикновено в рамките на 1-2 седмици.',
  },
  {
    question: 'Как да знам, че блокиращите синя светлина очила работят?',
    answer: 'Повечето хора усещат разлика още през първата седмица — по-малко напрежение в очите и по-лесно заспиване.',
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
  headline: 'Всичко, което трябва да\nзнаете за ALPÉ',
  cta: 'Поръчай сега',
}

export const finalCtaContent = {
  badge: 'Вземи своя чифт',
  headline: 'Защити очите си.\nЖивей оптимално.',
  cta: 'Вземи своя чифт',
  image: '/images/final-cta.png',
  subtext: 'BS EN ISO 12312-1 сертифицирани · Безплатна доставка над €50 · 1000+ доволни клиенти',
}
