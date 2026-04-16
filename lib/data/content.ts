import type { BenefitItem, StepItem, Ingredient, FaqItem } from '@/lib/types'

export const heroContent = {
  badge: 'Chosen by 2500+ Women',
  headlinePart1: 'Just One Drop.',
  headlinePart2Before: 'Endless',
  headlinePart2After: 'Glow.',
  subtext: 'Raydiant keeps your skin soft, smooth, and naturally radiant. With just one drop, it hydrates and nourishes your skin so you can glow all day.',
  cta: 'Buy Now',
  heroFaceImage: 'https://via.placeholder.com/100x100/F5F5F0/000000?text=Face',
}

export const benefits: BenefitItem[] = [
  { id: 'fine-lines', headline: 'Smooth Away Fine Lines Instantly', side: 'right' },
  { id: 'radiant', headline: 'Reveal Radiant and Youthful Skin', side: 'left' },
  { id: 'confidence', headline: 'Boost Your Confidence', side: 'right' },
]

export const darkCtaContent = {
  socialProof: '2,500+ Glowing',
  headline: 'Bring out your youthful glow',
  cta: 'Buy Now',
}

export const ingredientsContent = {
  badge: 'Ingredients',
  headline: 'Curated with Care.\nBacked by Nature.',
  editorialImage: 'https://via.placeholder.com/1200x500/F0EDE8/000000?text=Editorial',
  editorialImageAlt: 'Natural ingredients — Aloe Vera, Hyaluronic Acid, and botanical extracts',
  sectionTitle: 'Key Ingredients',
  cta: 'Buy Now',
}

export const ingredients: Ingredient[] = [
  { number: 1, name: 'Aloe Vera Extract', description: 'Soothes and hydrates skin naturally.' },
  { number: 2, name: 'Hyaluronic Acid', description: 'Locks in moisture for a plump, radiant look.' },
  { number: 3, name: 'Vitamin C', description: 'Brightens skin tone and reduces dullness.' },
  { number: 4, name: 'Shea Butter', description: 'Nourishes deeply and improves skin texture.' },
  { number: 5, name: 'Niacinamide', description: 'Refines pores and evens skin tone.' },
]

export const howItWorksContent = {
  badge: 'How it Works',
  headline: 'Simple Steps.\nLasting Results.',
  cta: 'Buy Now',
}

export const steps: StepItem[] = [
  {
    number: 1,
    title: 'Cleanse',
    description: 'Start with a fresh face to allow the serum to work its magic.',
    image: 'https://via.placeholder.com/600x450/D4C5B5/000000?text=Step+1+Cleanse',
  },
  {
    number: 2,
    title: 'Apply',
    description: 'Gently massage a few drops onto your face and neck.',
    image: 'https://via.placeholder.com/600x450/D4C5B5/000000?text=Step+2+Apply',
  },
  {
    number: 3,
    title: 'Absorb',
    description: 'Let the lightweight formula sink in, nourishing your skin deeply.',
    image: 'https://via.placeholder.com/600x450/D4C5B5/000000?text=Step+3+Absorb',
  },
]

export const beforeAfterContent = {
  badge: 'Why Choose Raydiant?',
  headline: 'Dull Yesterday.\nRadiant Today.',
  beforeImage: 'https://via.placeholder.com/900x500/888888/FFFFFF?text=Before',
  afterImage: 'https://via.placeholder.com/900x500/F5F5F0/000000?text=After',
}

export const withoutItems: string[] = [
  'Skin looks dull and tired',
  'Fine lines appear more visible',
  'Makeup feels off',
  'Confidence takes a dip',
  'Patchy, uneven skin tone',
]

export const withItems: string[] = [
  'Skin glows naturally',
  'Fine lines appear smoother',
  'Makeup blends better',
  'Confidence shines through',
  'Smooth, balanced glow',
]

export const testimonialContent = {
  badge: 'Testimonial',
  quote: 'My skin always looked dull and nothing seemed to work. Raydiant changed that. Now my skin feels smoother, brighter, and I finally feel confident again.',
  author: 'Emily Carter',
  stars: 5,
}

export const galleryContent = {
  headline: 'Beautiful Faces Powered by Raydiant',
  images: [
    'https://via.placeholder.com/300x400/F0EDE8/000000?text=Gallery+1',
    'https://via.placeholder.com/300x400/E8E0D8/000000?text=Gallery+2',
    'https://via.placeholder.com/300x400/D4C5B5/000000?text=Gallery+3',
    'https://via.placeholder.com/300x400/C8B5A0/000000?text=Gallery+4',
  ],
  cta: 'Buy Now',
}

export const faqs: FaqItem[] = [
  { question: 'How long before I start seeing results?', answer: 'Most users notice visible improvements within 2–4 weeks of daily use. For best results, use consistently morning and night.' },
  { question: 'Is Raydiant safe for all skin types?', answer: 'Yes. Raydiant is formulated for all skin types including sensitive skin. It is dermatologist-tested and free from harsh chemicals.' },
  { question: 'Can I use Raydiant with my other skincare products?', answer: 'Absolutely. Apply Raydiant after cleansing and before moisturiser. It layers well with most serums and SPF products.' },
  { question: 'Does Raydiant help with dark spots and uneven tone?', answer: 'Yes. The Niacinamide and Aloe Vera Extract in our formula specifically target uneven skin tone and help fade dark spots over time.' },
  { question: 'How often should I use Raydiant?', answer: 'For best results, use once in the morning and once at night after cleansing. One pump is enough for the full face and neck.' },
]

export const faqSectionContent = {
  badge: 'Frequently Asked Questions',
  headline: 'What You Should Know\nAbout Raydiant',
  cta: 'Buy Now',
}

export const finalCtaContent = {
  badge: 'Get Yours Now',
  headline: 'Radiate With\nConfidence Today',
  cta: 'Buy Now',
  image: 'https://via.placeholder.com/400x500/D4C5B5/000000?text=Woman',
}
