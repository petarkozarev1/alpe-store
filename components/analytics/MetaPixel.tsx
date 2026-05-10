'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const PIXEL_ID = '1435898268342097'

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
    _fbq: unknown
  }
}

export default function MetaPixel() {
  useEffect(() => {
    const consent = localStorage.getItem('alpe-cookie-consent')
    if (consent !== 'all') return
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView')
    }
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
              fbq('init', '1435898268342097');
              fbq('track', 'PageView');
            }
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1435898268342097&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </>
  )
}

export function firePixelEvent(name: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (localStorage.getItem('alpe-cookie-consent') !== 'all') return
  if (typeof window.fbq !== 'function') return
  window.fbq('track', name, data)
}
