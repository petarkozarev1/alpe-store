import { NextRequest, NextResponse } from 'next/server'
import { isConfiguredP2GSource, P2G_COOKIE_MAX_AGE, P2G_COOKIE_NAME } from '@/lib/p2g/attribution'
import { localeCookieName } from '@/lib/i18n/config'

export function middleware(request: NextRequest) {
  const sourceId = request.nextUrl.searchParams.get('source_id')
  if (isConfiguredP2GSource(sourceId, process.env.P2G_AFFILIATE_ID)) {
    const destination = request.nextUrl.clone()
    destination.searchParams.delete('source_id')
    const response = NextResponse.redirect(destination)
    response.cookies.set(P2G_COOKIE_NAME, sourceId!, {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV !== 'development',
      path: '/', maxAge: P2G_COOKIE_MAX_AGE,
    })
    return response
  }

  if (request.nextUrl.pathname === '/icon') return NextResponse.next()

  const destination = request.nextUrl.clone()
  if (destination.pathname === '/bg' || destination.pathname.startsWith('/bg/')) {
    destination.pathname = destination.pathname.slice(3) || '/'
    return NextResponse.redirect(destination)
  }
  if (destination.pathname === '/en' || destination.pathname.startsWith('/en/')) {
    return NextResponse.next()
  }
  if (request.cookies.get(localeCookieName)?.value === 'en') {
    destination.pathname = `/en${destination.pathname === '/' ? '' : destination.pathname}`
    return NextResponse.redirect(destination)
  }
  destination.pathname = `/bg${destination.pathname === '/' ? '' : destination.pathname}`
  return NextResponse.rewrite(destination)
}

export const config = { matcher: ['/((?!api|partner|_next|.*\\..*).*)'] }
