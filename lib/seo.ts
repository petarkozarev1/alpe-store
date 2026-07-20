import type { Metadata } from 'next'
import type { Product } from '@/lib/types'

export const siteUrl = 'https://www.alpewear.com'

export const defaultSeo = {
  siteName: 'ALPÉ',
  title: 'ALPÉ - Очила за синя светлина',
  description:
    'ALPÉ очила за синя и зелена светлина с EU сертифицирани стъкла, UV400 защита и безплатна доставка над 50 евро.',
  locale: 'bg_BG',
}

export const indexableRoutes = [
  '',
  '/shop',
  '/about',
  '/science',
  '/certifications',
  '/lenses',
  '/faqs',
  '/pricing',
  '/returns',
  '/contact',
  '/privacy',
  '/terms',
  '/product/alpe-daily',
  '/product/alpe-evening',
]

export const seoLastModified = new Date('2026-07-21T00:00:00.000Z')

export const organizationId = `${siteUrl}/#organization`
export const websiteId = `${siteUrl}/#website`

export const merchantReturnPolicy = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'BG',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 14,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
}

export function offerShippingDetails(price: number) {
  return {
    '@type': 'OfferShippingDetails',
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: 'BG',
    },
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: price >= 50 ? 0 : 4.99,
      currency: 'EUR',
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      transitTime: {
        '@type': 'QuantitativeValue',
        minValue: 1,
        maxValue: 3,
        unitCode: 'DAY',
      },
    },
  }
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': organizationId,
  name: defaultSeo.siteName,
  url: siteUrl,
  logo: absoluteUrl('/images/logo.png'),
  email: 'hello@alpewear.com',
  hasMerchantReturnPolicy: merchantReturnPolicy,
  sameAs: [
    'https://www.instagram.com/alpe.wear/',
    'https://www.facebook.com/profile.php?id=61576538370701',
  ],
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': websiteId,
  name: defaultSeo.siteName,
  url: siteUrl,
  inLanguage: 'bg-BG',
  publisher: { '@id': organizationId },
}

export function absoluteUrl(path = '') {
  if (!path) return siteUrl
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function productUrl(product: Product) {
  return absoluteUrl(`/product/${product.slug}`)
}

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path || '/',
    },
    openGraph: {
      type: 'website',
      locale: defaultSeo.locale,
      url: absoluteUrl(path),
      siteName: defaultSeo.siteName,
      title,
      description,
      images: [
        {
          url: absoluteUrl('/images/logo.png'),
          width: 512,
          height: 512,
          alt: defaultSeo.siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl('/images/logo.png')],
    },
  }
}

export function noIndexMetadata(title: string, description?: string): Metadata {
  return {
    title,
    ...(description ? { description } : {}),
    robots: {
      index: false,
      follow: false,
    },
  }
}
