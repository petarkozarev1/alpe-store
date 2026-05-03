export interface Variant {
  id: string
  label: string
  inStock: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  price: number
  images: string[]
  variants: Variant[]
  badge?: string
}

export interface CartItem {
  productId: string
  variantId: string
  name: string
  variantLabel: string
  price: number
  quantity: number
  image: string
  slug: string
}

export interface NavLink {
  label: string
  href: string
}

export interface SiteConfig {
  brand: string
  tagline: string
  nav: NavLink[]
  footer: {
    description: string
    columns: {
      title: string
      links: NavLink[]
    }[]
    legal: NavLink[]
    copyright: string
  }
}

export interface Ingredient {
  number: number
  name: string
  description: string
}

export interface BenefitItem {
  id: string
  headline: string
  side: 'left' | 'right'
}

export interface StepItem {
  number: number
  title: string
  description: string
  image: string
}

export interface FaqItem {
  question: string
  answer: string
}

