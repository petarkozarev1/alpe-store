'use client'

import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { hasOptionalCookieConsent } from '@/lib/cookieConsent'

function Tracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (typeof window === 'undefined') return

    const queryString = searchParams?.toString()
    const path = queryString ? `${pathname}?${queryString}` : pathname
    const location = `${window.location.origin}${path}`

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'page_view',
      page_path: path,
      page_location: location,
      page_title: document.title,
    })

    if (hasOptionalCookieConsent()) {
      fireTrackedEvent('PageView', { data: { page_path: path } })
    }
  }, [pathname, searchParams])

  return null
}

export default function RouteChangeTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  )
}
