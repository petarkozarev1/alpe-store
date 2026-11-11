/**
 * Canonical public identity for the storefront.
 *
 * Change `SITE_URL` (and the three addresses in `EMAILS`) when the domain
 * moves to ampewear.com. Do not hardcode the domain or these inboxes elsewhere.
 *
 * `SHOW_FORMERLY_ALPE` is the only switch for the temporary
 * "AMPÉ (преди ALPÉ)" line. Turn it off after 60–90 days.
 */

export const BRAND_NAME = 'AMPÉ'
export const FORMER_BRAND_NAME = 'ALPÉ'

/** Set to false to remove every "formerly ALPÉ" line. */
export const SHOW_FORMERLY_ALPE = false

/** One-line domain switch. Keep the www production origin until the owner moves DNS. */
export const SITE_URL = 'https://www.alpewear.com'

export const EMAILS = {
  hello: 'hello@alpewear.com',
  support: 'support@alpewear.com',
  returns: 'returns@alpewear.com',
} as const

export const COMPANY = {
  legalNameBg: 'АМПЕ ГРУП ООД',
  legalNameEn: 'AMPE GROUP Ltd',
  eik: '208982100',
  cityLineBg: 'гр. София 1000, р-н Студентски, ул. Мирела Френи № 22Б',
  cityLineEn: '22B Mirela Freni St., Studentski district, Sofia 1000, Bulgaria',
  countryBg: 'България',
  phone: '0884555077',
  phoneHref: 'tel:+359884555077',
} as const

export function mailtoHref(address: string, subject?: string) {
  if (!subject) return `mailto:${address}`
  return `mailto:${address}?subject=${encodeURIComponent(subject)}`
}

export function businessOrderMailto(locale: 'bg' | 'en' = 'bg') {
  const subject = locale === 'en' ? 'AMPÉ business order enquiry' : 'Запитване за фирмена поръчка AMPÉ'
  return mailtoHref(EMAILS.hello, subject)
}

export function formerlyLine(locale: 'bg' | 'en') {
  if (!SHOW_FORMERLY_ALPE) return null
  return locale === 'en' ? `${BRAND_NAME} (formerly ${FORMER_BRAND_NAME})` : `${BRAND_NAME} (преди ${FORMER_BRAND_NAME})`
}

/** Checkout return URLs follow the deployment env when set, otherwise the canonical site URL. */
export function checkoutSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
  return fromEnv || SITE_URL
}
