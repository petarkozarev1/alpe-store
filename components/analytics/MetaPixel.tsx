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
      if (localStorage.getItem('alpe-cookie-consent') !== 'all') return
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
            var _consent = localStorage.getItem('alpe-cookie-consent');
            if (_consent === 'all') {
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
              fbq('init', '${PIXEL_ID}');
              window.__alpePixelInitialized = true;
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
  if (localStorage.getItem('alpe-cookie-consent') !== 'all') return
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
