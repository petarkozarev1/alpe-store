import { localeFromPath, localizedPath, oppositeLocalePath } from '@/lib/i18n/routing'

describe('localized routing', () => {
  it('keeps Bulgarian URLs unprefixed', () => {
    expect(localizedPath('/shop', 'bg')).toBe('/shop')
    expect(localizedPath('/en/shop', 'bg')).toBe('/shop')
  })

  it('prefixes English URLs exactly once', () => {
    expect(localizedPath('/shop', 'en')).toBe('/en/shop')
    expect(localizedPath('/en/shop', 'en')).toBe('/en/shop')
  })

  it('preserves query strings and hashes when switching', () => {
    expect(oppositeLocalePath('/shop?bundle=daily-evening#buy')).toBe('/en/shop?bundle=daily-evening#buy')
    expect(oppositeLocalePath('/en/product/alpe-daily?x=1')).toBe('/product/alpe-daily?x=1')
  })

  it('recognizes only a leading English locale segment', () => {
    expect(localeFromPath('/en')).toBe('en')
    expect(localeFromPath('/en/shop')).toBe('en')
    expect(localeFromPath('/product/en')).toBe('bg')
  })
})
