'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const PIXEL_ID = '1435898268342097'
let pixelInitialized = false
const META_COOKIE_MAX_AGE = 60 * 60 * 24 * 90

function getCookieValue(name: string) {
  if (typeof document === 'undefined') return ''
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=') ?? ''
}

function setCookieValue(name: string, value: string) {
  document.cookie = `${name}=${value}; Max-Age=${META_COOKIE_MAX_AGE}; Path=/; SameSite=Lax; Secure`
}

function syncMetaAttributionCookies() {
  if (typeof window === 'undefined') return

  const now = Date.now()
  const fbclid = new URL(window.location.href).searchParams.get('fbclid')

  if (!getCookieValue('_fbp')) {
    const randomId = Math.floor(Math.random() * 1e16)
    setCookieValue('_fbp', `fb.1.${now}.${randomId}`)
  }

  if (fbclid && !getCookieValue('_fbc')) {
    setCookieValue('_fbc', `fb.1.${now}.${fbclid}`)
  }
}

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
    _fbq: unknown
    __alpePixelInitialized?: boolean
    __alpePageViewTracked?: boolean
  }
}

export default function MetaPixel() {
  useEffect(() => {
    function initPixel() {
      if (typeof window.fbq !== 'function') return
      syncMetaAttributionCookies()
      if (!pixelInitialized && !window.__alpePixelInitialized) {
        window.fbq('init', PIXEL_ID)
        window.__alpePixelInitialized = true
      }
      pixelInitialized = true
      if (window.__alpePageViewTracked) return
      window.fbq('track', 'PageView')
      window.__alpePageViewTracked = true
    }

    initPixel()
    window.addEventListener('alpe-cookie-consent-accepted', initPixel)
    return () => window.removeEventListener('alpe-cookie-consent-accepted', initPixel)
  }, [])

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            var _now = Date.now();
            var _cookies = document.cookie ? document.cookie.split('; ') : [];
            var _hasFbp = _cookies.some(function(row) { return row.indexOf('_fbp=') === 0; });
            var _hasFbc = _cookies.some(function(row) { return row.indexOf('_fbc=') === 0; });
            var _fbclid = new URL(window.location.href).searchParams.get('fbclid');
            if (!_hasFbp) {
              document.cookie = '_fbp=fb.1.' + _now + '.' + Math.floor(Math.random() * 1e16) + '; Max-Age=${META_COOKIE_MAX_AGE}; Path=/; SameSite=Lax; Secure';
            }
            if (_fbclid && !_hasFbc) {
              document.cookie = '_fbc=fb.1.' + _now + '.' + _fbclid + '; Max-Age=${META_COOKIE_MAX_AGE}; Path=/; SameSite=Lax; Secure';
            }
            if (!window.__alpePixelInitialized) {
              fbq('init', '${PIXEL_ID}');
              window.__alpePixelInitialized = true;
            }
            if (!window.__alpePageViewTracked) {
              fbq('track', 'PageView');
              window.__alpePageViewTracked = true;
            }
          `,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
    </>
  )
}

function ensurePixelReady() {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  syncMetaAttributionCookies()
  if (!pixelInitialized && !window.__alpePixelInitialized) {
    window.fbq('init', PIXEL_ID)
    window.__alpePixelInitialized = true
  }
  pixelInitialized = true
  return true
}

export function firePixelEvent(name: string, data?: Record<string, unknown>, eventId?: string) {
  if (!ensurePixelReady()) return
  if (eventId) {
    window.fbq('track', name, data, { eventID: eventId })
    return
  }
  window.fbq('track', name, data)
}

export function firePixelCustomEvent(name: string, data?: Record<string, unknown>) {
  if (!ensurePixelReady()) return
  window.fbq('trackCustom', name, data)
}

/** Read a browser cookie value (used to forward _fbp / _fbc to CAPI). */
function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=').slice(1).join('=') || undefined
}

export interface TrackedEventOptions {
  /** Fire as a custom event (fbq trackCustom) instead of a standard event. */
  custom?: boolean
  /** Extra params passed to the browser pixel (and, for custom events, mirrored as custom_data). */
  data?: Record<string, unknown>
  value?: number
  currency?: string
  contentIds?: string[]
  numItems?: number
  ctaLocation?: string
  email?: string
  phone?: string
}

/**
 * Fire a Meta event on BOTH the browser pixel and server-side CAPI, deduplicated via a
 * shared event_id. The CAPI mirror is a fire-and-forget POST to /api/track (keepalive so it
 * survives navigation). Safe: silently no-ops if the pixel/network is unavailable.
 */
export function fireTrackedEvent(name: string, opts: TrackedEventOptions = {}): void {
  if (typeof window === 'undefined') return
  const eventId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? `${name}-${crypto.randomUUID()}`
      : `${name}-${Math.random().toString(36).slice(2)}`

  // 1) Browser pixel with the shared eventID
  if (ensurePixelReady()) {
    if (opts.custom) window.fbq('trackCustom', name, opts.data, { eventID: eventId })
    else window.fbq('track', name, opts.data, { eventID: eventId })
  }

  // 2) Server-side CAPI mirror (deduped by eventId)
  try {
    const payload = JSON.stringify({
      eventName: name,
      eventId,
      value: opts.value,
      currency: opts.currency,
      contentIds: opts.contentIds,
      numItems: opts.numItems,
      ctaLocation: opts.ctaLocation,
      email: opts.email,
      phone: opts.phone,
      fbp: readCookie('_fbp'),
      fbc: readCookie('_fbc'),
      sourceUrl: window.location.href,
    })
    void fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => { /* tracking must never break the UX */ })
  } catch { /* ignore */ }
}

/**
 * Hash a value with SHA-256 (lowercase + trim, matching Meta's spec).
 * Used by setPixelUser to send pre-hashed PII to Meta for Advanced Matching.
 */
async function sha256Hex(value: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(value.trim().toLowerCase())
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

interface PixelUser {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  city?: string
  country?: string
  zip?: string
}

let lastUserSignature = ''

/**
 * Enable Advanced Matching on the Meta Pixel by re-initing with hashed user data.
 * Call this once the user reveals identifying info (e.g. types email on checkout).
 * Subsequent fbq events automatically include the hashed user data, bumping Event Match Quality.
 *
 * Idempotent: skipped if the same user data was already set.
 */
export async function setPixelUser(user: PixelUser): Promise<void> {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return

  // Normalize and dedupe: if nothing changed since last call, skip the work.
  const signature = JSON.stringify({
    em: user.email?.trim().toLowerCase() ?? '',
    ph: user.phone?.replace(/\D/g, '') ?? '',
    fn: user.firstName?.trim().toLowerCase() ?? '',
    ln: user.lastName?.trim().toLowerCase() ?? '',
    ct: user.city?.trim().toLowerCase() ?? '',
    country: user.country?.trim().toLowerCase() ?? '',
    zp: user.zip?.trim() ?? '',
  })
  if (signature === lastUserSignature) return
  // Only proceed if at least one field is present
  const parsed = JSON.parse(signature) as Record<string, string>
  if (!Object.values(parsed).some(Boolean)) return
  lastUserSignature = signature

  const matching: Record<string, string> = {}
  if (parsed.em) matching.em = await sha256Hex(parsed.em)
  if (parsed.ph) matching.ph = await sha256Hex(parsed.ph)
  if (parsed.fn) matching.fn = await sha256Hex(parsed.fn)
  if (parsed.ln) matching.ln = await sha256Hex(parsed.ln)
  if (parsed.ct) matching.ct = await sha256Hex(parsed.ct)
  if (parsed.country) matching.country = await sha256Hex(parsed.country === 'българия' || parsed.country === 'bulgaria' ? 'bg' : parsed.country)
  if (parsed.zp) matching.zp = await sha256Hex(parsed.zp)

  // Re-init the Pixel with Advanced Matching data. All subsequent fbq events
  // (including SPA route PageViews via RouteChangeTracker) include this user data.
  window.fbq('init', PIXEL_ID, matching)
}
