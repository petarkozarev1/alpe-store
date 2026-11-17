import { act, render } from '@testing-library/react'
import MetaPixel, { firePixelEvent, fireTrackedEvent } from '@/components/analytics/MetaPixel'
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity'
import { COOKIE_CONSENT_ACCEPTED_EVENT, COOKIE_CONSENT_KEY } from '@/lib/cookieConsent'

beforeEach(() => {
  localStorage.clear()
  document.getElementById('meta-pixel')?.remove()
  document.getElementById('microsoft-clarity')?.remove()
  window.fbq = undefined as unknown as Window['fbq']
  delete window.__alpePixelInitialized
  delete window.__alpePageViewTracked
  global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as unknown as typeof fetch
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID = 'clarity-test'
})

test('does not add pixel or clarity scripts before a choice', () => {
  render(
    <>
      <MetaPixel />
      <MicrosoftClarity />
    </>,
  )

  expect(document.getElementById('meta-pixel')).toBeNull()
  expect(document.getElementById('microsoft-clarity')).toBeNull()
  expect(document.documentElement.innerHTML).not.toContain('connect.facebook.net')
  expect(document.documentElement.innerHTML).not.toContain('clarity.ms')
  expect(document.cookie).not.toContain('_fbp')
})

test('pixel events no-op before consent, including the CAPI mirror', () => {
  window.fbq = jest.fn()
  fireTrackedEvent('InitiateCheckout', { value: 59.99, currency: 'EUR' })
  firePixelEvent('Purchase', { value: 59.99 }, 'purchase-1')

  expect(window.fbq).not.toHaveBeenCalled()
  expect(global.fetch).not.toHaveBeenCalled()
  expect(document.cookie).not.toContain('_fbp')
})

test('stays unloaded when the visitor keeps only necessary cookies', () => {
  localStorage.setItem(COOKIE_CONSENT_KEY, 'necessary')
  render(
    <>
      <MetaPixel />
      <MicrosoftClarity />
    </>,
  )
  act(() => {
    window.dispatchEvent(new Event(COOKIE_CONSENT_ACCEPTED_EVENT))
  })

  expect(document.getElementById('meta-pixel')).toBeNull()
  expect(document.getElementById('microsoft-clarity')).toBeNull()
})

test('loads both scripts after accept and then fires pixel events', () => {
  render(
    <>
      <MetaPixel />
      <MicrosoftClarity />
    </>,
  )

  act(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'all')
    window.dispatchEvent(new Event(COOKIE_CONSENT_ACCEPTED_EVENT))
  })

  expect(document.getElementById('meta-pixel')?.textContent).toContain('https://connect.facebook.net/en_US/fbevents.js')
  expect(document.getElementById('meta-pixel')?.textContent).toContain("fbq('track', 'PageView')")
  const clarity = document.getElementById('microsoft-clarity')?.textContent ?? ''
  expect(clarity).toContain('https://www.clarity.ms/tag/')
  expect(clarity).toContain('clarity-test')

  window.fbq = jest.fn()
  fireTrackedEvent('AddToCart', { value: 59.99, currency: 'EUR' })
  expect(window.fbq).toHaveBeenCalledWith('track', 'AddToCart', undefined, { eventID: expect.stringMatching(/^AddToCart-/) })
  expect(global.fetch).toHaveBeenCalledWith('/api/track', expect.objectContaining({ method: 'POST', keepalive: true }))
})

test('loads the pixel on the next visit when consent is already stored', () => {
  localStorage.setItem(COOKIE_CONSENT_KEY, 'all')
  render(<MetaPixel />)
  expect(document.getElementById('meta-pixel')?.textContent).toContain('fbevents.js')
})
