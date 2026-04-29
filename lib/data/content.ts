import type { BenefitItem, StepItem, Ingredient, FaqItem } from '@/lib/types'

export const heroContent = {
  badge: 'Доверени от 10,000+ потребители',
  headlinePart1: 'Само едни очила.',
  headlinePart2Before: 'Безкрайна',
  headlinePart2After: 'яснота.',
  subtext: 'Очилата ALPE блокират синята светлина и намаляват умората на очите, главоболието и нарушения сън — за да работиш на най-доброто си ниво.',
  cta: 'Пазарувай сега',
  heroFaceImages: [
    { src: '/images/hero/person-5-day.png',   alt: 'Woman wearing ALPE Day glasses — clear frame, yellow lenses',   objectPosition: '50% 25%' },
    { src: '/images/hero/person-1-night.png', alt: 'Man wearing ALPE Night glasses — dark frame, orange lenses',    objectPosition: '50% 25%' },
    { src: '/images/hero/person-4-day.png',   alt: 'Woman wearing ALPE Day glasses — clear frame, yellow lenses',   objectPosition: '45% 25%' },
    { src: '/images/hero/person-3-day.png',   alt: 'Man wearing ALPE Day glasses — clear frame, gold lenses',       objectPosition: '55% 25%' },
    { src: '/images/hero/person-2-day.png',   alt: 'Woman wearing ALPE Day glasses — clear frame, yellow lenses',   objectPosition: '35% 20%' },
    { src: '/images/hero/person-6-night.png', alt: 'Man wearing ALPE Night glasses — clear frame, orange lenses',   objectPosition: '50% 25%' },
  ],
}

export const benefits: BenefitItem[] = [
  { id: 'eye-strain', headline: 'End Eye Strain and Screen Headaches', side: 'right' },
  { id: 'sleep', headline: 'Sleep Deeper. Wake Up Sharper.', side: 'left' },
  { id: 'focus', headline: 'Stay Focused All Day Long', side: 'right' },
]

export const darkCtaContent = {
  socialProof: '10,000+ Happy Eyes',
  headline: 'Protect your vision. Own your day.',
  cta: 'Shop Now',
}

export const ingredientsContent = {
  badge: 'Lens Technology',
  headline: 'Engineered for\nthe Screen Age.',
  editorialImage: 'https://via.placeholder.com/1200x500/F0EDE8/000000?text=ALPE+Lenses',
  editorialImageAlt: 'ALPE precision lens technology — blue light filter, anti-glare, UV400',
  sectionTitle: 'What\'s in Every Lens',
  cta: 'Shop Now',
}

export const ingredients: Ingredient[] = [
  { number: 1, name: 'Blue Light Filter', description: 'Blocks 99% of harmful blue light from screens.' },
  { number: 2, name: 'Anti-Glare Coating', description: 'Eliminates screen glare and harsh reflections.' },
  { number: 3, name: 'UV400 Protection', description: 'Full UV protection for indoor and outdoor use.' },
  { number: 4, name: 'Scratch-Resistant Lens', description: 'Durable, long-lasting lenses built for daily wear.' },
  { number: 5, name: 'Lightweight Frame', description: 'Barely-there comfort you can wear all day.' },
]

export const howItWorksContent = {
  badge: 'How it Works',
  headline: 'Simple to Wear.\nPowerful Protection.',
  cta: 'Shop Now',
}

export const steps: StepItem[] = [
  {
    number: 1,
    title: 'Wear',
    description: 'Put on your ALPE glasses before any screen session — work, gaming, or scrolling.',
    image: '/images/step1wear.png',
  },
  {
    number: 2,
    title: 'Filter',
    description: 'ALPE lenses continuously block blue light and reduce glare throughout your day.',
    image: '/images/step2filter.png',
  },
  {
    number: 3,
    title: 'Rest',
    description: 'Wind down with ease — your body\'s natural sleep cycle stays intact.',
    image: '/images/step3restnew.png',
  },
]

export const beforeAfterContent = {
  badge: 'Why Choose ALPE?',
  headline: 'Strained Yesterday.\nClear Today.',
  beforeImage: '/images/before.png',
  afterImage: '/images/after.png',
}

export const withoutItems: string[] = [
  'Eyes feel tired and strained',
  'Headaches by mid-afternoon',
  'Trouble falling asleep at night',
  'Reduced focus and productivity',
  'Squinting and dry eyes',
]

export const withItems: string[] = [
  'Eyes stay fresh all day',
  'No more screen headaches',
  'Fall asleep faster, sleep deeper',
  'Sharper focus and energy',
  'Comfortable, natural vision',
]

export const testimonialContent = {
  badge: 'Testimonial',
  quote: 'I work 10+ hours a day on screens. Since I started wearing ALPE, my eye strain is completely gone and I actually sleep through the night. These glasses changed everything.',
  author: 'Alex M.',
  stars: 5,
}

export const galleryContent = {
  headline: 'Real People. Real Protection. Powered by ALPE.',
  images: [
    'https://via.placeholder.com/300x400/F0EDE8/000000?text=Gallery+1',
    'https://via.placeholder.com/300x400/E8E0D8/000000?text=Gallery+2',
    'https://via.placeholder.com/300x400/D4C5B5/000000?text=Gallery+3',
    'https://via.placeholder.com/300x400/C8B5A0/000000?text=Gallery+4',
  ],
  cta: 'Shop Now',
}

export const faqs: FaqItem[] = [
  { question: 'How do I know if blue light glasses are working?', answer: 'Most users notice reduced eye strain and fewer headaches within the first few days. Better sleep quality typically follows within 1–2 weeks of consistent evening use.' },
  { question: 'Can I wear ALPE glasses all day?', answer: 'Yes. ALPE glasses are designed for all-day comfort. The lightweight frames and precision lenses make them easy to wear from your first morning screen session to winding down at night.' },
  { question: 'Do ALPE glasses affect how colors look on screen?', answer: 'ALPE uses a clear-tinted lens that provides strong blue light protection with minimal color distortion. Colors stay true — you won\'t notice a yellow or orange cast.' },
  { question: 'Are ALPE glasses compatible with prescription lenses?', answer: 'Our current frames are non-prescription. Prescription-compatible versions are in development. Sign up to be notified when they launch.' },
  { question: 'What makes ALPE different from other blue light glasses?', answer: 'ALPE combines premium lens technology with clean, minimal design — without the premium price tag. Every pair is tested for optical clarity, durability, and real blue light blocking performance.' },
]

export const faqSectionContent = {
  badge: 'Frequently Asked Questions',
  headline: 'Everything You Need\nto Know About ALPE',
  cta: 'Shop Now',
}

export const finalCtaContent = {
  badge: 'Get Your Pair',
  headline: 'Protect Your Eyes.\nOwn Your Day.',
  cta: 'Shop Now',
  image: '/images/final-cta.png',
}
