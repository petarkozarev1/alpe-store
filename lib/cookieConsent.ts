export const COOKIE_CONSENT_KEY = 'alpe-cookie-consent'
export const COOKIE_CONSENT_ACCEPTED_EVENT = 'alpe-cookie-consent-accepted'

/** True only after the visitor accepts optional cookies in the banner. */
export function hasOptionalCookieConsent() {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === 'all'
  } catch {
    return false
  }
}
