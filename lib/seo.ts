import type { Metadata } from 'next'
import type { Product } from '@/lib/types'
import type { Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routing'
import { isLocale } from '@/lib/i18n/config'
import { translate } from '@/lib/i18n/translations'
import { EMAILS, SITE_URL } from '@/lib/brand'
import { deliveryAmount } from '@/lib/checkout-delivery'

export const siteUrl = SITE_URL

export const defaultSeo = {
  siteName: 'AMPÉ',
  title: 'AMPÉ - Очила за синя светлина',
  description:
    'AMPÉ очила за синя и зелена светлина с EU сертифицирани стъкла, UV400 защита и безплатна доставка за 2 или повече чифта.',
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

export const seoLastModified = new Date('2026-11-09T00:00:00.000Z')

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

/** Bulgarian shipping for a pair count. One pair pays the flat fee; two or more are free. */
export function offerShippingDetails(pairs: number) {
  return {
    '@type': 'OfferShippingDetails',
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: 'BG',
    },
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: deliveryAmount(pairs),
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
  logo: absoluteUrl('/brand/ampe-wordmark-black-512.png'),
  email: EMAILS.hello,
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
  if (!path || path === '/') return siteUrl
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function productUrl(product: Product, locale: Locale = 'bg') {
  return absoluteUrl(localizedPath(`/product/${product.slug}`, locale))
}

export function createPageMetadata({
  title,
  description,
  path,
  locale = 'bg',
}: {
  title: string | { absolute: string }
  description: string
  path: string
  locale?: Locale
}): Metadata {
  const canonicalPath = localizedPath(path, locale)
  const languages = {
    'bg-BG': localizedPath(path, 'bg'),
    'en': localizedPath(path, 'en'),
    'x-default': localizedPath(path, 'bg'),
  }
  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : defaultSeo.locale,
      alternateLocale: [locale === 'en' ? defaultSeo.locale : 'en_US'],
      url: absoluteUrl(canonicalPath),
      siteName: defaultSeo.siteName,
      title,
      description,
      images: [
        {
          url: absoluteUrl('/og-image.png'),
          width: 1200,
          height: 630,
          alt: defaultSeo.siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl('/twitter-card.png')],
    },
  }
}

export function createLocalizedPageMetadata(
  localeValue: string,
  options: { title: string; description: string; path: string; absoluteTitle?: boolean },
) {
  const locale: Locale = isLocale(localeValue) ? localeValue : 'bg'
  const title = translate(locale, options.title)
  const { absoluteTitle, ...page } = options
  return createPageMetadata({
    ...page,
    title: absoluteTitle ? { absolute: title } : title,
    description: translate(locale, options.description),
    locale,
  })
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

export function localizedNoIndexMetadata(localeValue: string, title: string, description?: string): Metadata {
  const locale: Locale = isLocale(localeValue) ? localeValue : 'bg'
  return noIndexMetadata(translate(locale, title), description ? translate(locale, description) : undefined)
}
