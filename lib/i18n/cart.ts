import type { Locale } from './config'

export function localizeCartVariantLabel(locale: Locale, label: string) {
  if (locale === 'en') {
    return label
      .replace(/^Вечер$/, 'Evening')
      .replace(/^За всеки ден$/, 'Daily')
      .replaceAll('🟠 Вечер', '🟠 Evening')
      .replaceAll('🟡 За всеки ден', '🟡 Daily')
      .replace(/(\d+) чифт(?:а)?/g, (_, count: string) => `${count} ${count === '1' ? 'pair' : 'pairs'}`)
  }
  return label
    .replace(/^Evening$/, 'Вечер')
    .replace(/^Daily$/, 'За всеки ден')
    .replaceAll('🟠 Evening', '🟠 Вечер')
    .replaceAll('🟡 Daily', '🟡 За всеки ден')
    .replace(/(\d+) pair(?:s)?/g, (_, count: string) => `${count} чифт${count === '1' ? '' : 'а'}`)
}
