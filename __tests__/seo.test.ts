import sitemap from '@/app/sitemap'
import robots from '@/app/robots'
import {
  absoluteUrl,
  createPageMetadata,
  indexableRoutes,
  merchantReturnPolicy,
  noIndexMetadata,
  offerShippingDetails,
  organizationId,
  siteUrl,
  websiteId,
} from '@/lib/seo'
import { metadata as privacyMetadata } from '@/app/privacy/page'
import { metadata as termsMetadata } from '@/app/terms/page'

describe('SEO route configuration', () => {
  it('uses the production www origin for absolute URLs', () => {
    expect(siteUrl).toBe('https://www.alpewear.com')
    expect(absoluteUrl()).toBe('https://www.alpewear.com')
    expect(absoluteUrl('/shop')).toBe('https://www.alpewear.com/shop')
  })

  it('includes public and product routes but excludes transactional routes', () => {
    expect(indexableRoutes).toEqual(expect.arrayContaining([
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
    ]))
    expect(indexableRoutes).not.toEqual(expect.arrayContaining([
      '/cart',
      '/checkout',
      '/checkout/success',
      '/frames',
    ]))
  })

  it('generates stable www sitemap entries for every indexable route', () => {
    const entries = sitemap()
    const urls = entries.map((entry) => entry.url)

    expect(urls).toHaveLength(indexableRoutes.length)
    expect(urls).toEqual(expect.arrayContaining([
      'https://www.alpewear.com',
      'https://www.alpewear.com/shop',
      'https://www.alpewear.com/product/alpe-daily',
      'https://www.alpewear.com/product/alpe-evening',
    ]))
    expect(urls.every((url) => url.startsWith('https://www.alpewear.com'))).toBe(true)
    expect(entries.every((entry) => entry.lastModified instanceof Date)).toBe(true)
    expect(entries.every((entry) => entry.lastModified?.toISOString() === '2026-07-21T00:00:00.000Z')).toBe(true)
  })

  it('lets crawlers read noindex pages while blocking private endpoints', () => {
    const config = robots()
    const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules
    const disallow = Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow]

    expect(disallow).toEqual(expect.arrayContaining(['/api/', '/partner/']))
    expect(disallow).not.toEqual(expect.arrayContaining(['/cart', '/checkout']))
    expect(config.host).toBe('https://www.alpewear.com')
    expect(config.sitemap).toBe('https://www.alpewear.com/sitemap.xml')
  })

  it('creates unbranded child titles with self-referencing canonicals', () => {
    const metadata = createPageMetadata({
      title: 'Нашата история',
      description: 'Историята на ALPÉ.',
      path: '/about',
    })

    expect(metadata.title).toBe('Нашата история')
    expect(metadata.description).toBe('Историята на ALPÉ.')
    expect(metadata.alternates).toEqual({ canonical: '/about' })
    expect(String(metadata.title)).not.toContain('| ALPÉ')
    expect(metadata.openGraph).toEqual(expect.objectContaining({
      title: 'Нашата история',
      description: 'Историята на ALPÉ.',
      url: 'https://www.alpewear.com/about',
    }))
    expect(metadata.twitter).toEqual(expect.objectContaining({
      title: 'Нашата история',
      description: 'Историята на ALPÉ.',
    }))
  })

  it('gives legal pages their own social metadata instead of homepage defaults', () => {
    expect(privacyMetadata.openGraph).toEqual(expect.objectContaining({
      url: 'https://www.alpewear.com/privacy',
    }))
    expect(termsMetadata.openGraph).toEqual(expect.objectContaining({
      url: 'https://www.alpewear.com/terms',
    }))
  })

  it('creates explicit noindex metadata for transactional pages', () => {
    expect(noIndexMetadata('Количка')).toEqual(expect.objectContaining({
      title: 'Количка',
      robots: { index: false, follow: false },
    }))
  })

  it('uses stable entity IDs and an honest 14-day Bulgarian return policy', () => {
    expect(organizationId).toBe('https://www.alpewear.com/#organization')
    expect(websiteId).toBe('https://www.alpewear.com/#website')
    expect(merchantReturnPolicy).toEqual(expect.objectContaining({
      applicableCountry: 'BG',
      merchantReturnDays: 14,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    }))
  })

  it('describes paid and free Bulgarian shipping without inventing a carrier', () => {
    expect(offerShippingDetails(44.99).shippingRate).toEqual({
      '@type': 'MonetaryAmount',
      value: 4.99,
      currency: 'EUR',
    })
    expect(offerShippingDetails(66.99).shippingRate).toEqual({
      '@type': 'MonetaryAmount',
      value: 0,
      currency: 'EUR',
    })
    expect(offerShippingDetails(44.99).shippingDestination).toEqual({
      '@type': 'DefinedRegion',
      addressCountry: 'BG',
    })
  })
})
