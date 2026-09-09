import { translate, hasEnglishTranslation, localizeValue } from '@/lib/i18n/translations'

describe('translation catalogue', () => {
  it('returns Bulgarian source copy unchanged', () => {
    expect(translate('bg', 'Поръчай сега')).toBe('Поръчай сега')
  })

  it('returns explicit English copy', () => {
    expect(translate('en', 'Поръчай сега')).toBe('Shop now')
    expect(translate('en', 'Отвори количката')).toBe('Open cart')
  })

  it('can detect missing English copy', () => {
    expect(hasEnglishTranslation('Поръчай сега')).toBe(true)
    expect(hasEnglishTranslation('Несъществуващ превод')).toBe(false)
  })

  it('localizes nested content while preserving asset paths and numbers', () => {
    expect(localizeValue('en', { title: 'Поръчай сега', image: '/image.png', count: 5 })).toEqual({ title: 'Shop now', image: '/image.png', count: 5 })
  })
})
