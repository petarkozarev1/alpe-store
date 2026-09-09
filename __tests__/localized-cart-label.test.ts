import { localizeCartVariantLabel } from '@/lib/i18n/cart'

it('localizes persisted variant labels in either direction', () => {
  expect(localizeCartVariantLabel('en', '🟠 Вечер · 1 чифт')).toBe('🟠 Evening · 1 pair')
  expect(localizeCartVariantLabel('bg', '🟡 Daily · 2 pairs')).toBe('🟡 За всеки ден · 2 чифта')
})
