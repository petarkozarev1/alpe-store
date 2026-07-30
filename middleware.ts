import { NextRequest, NextResponse } from 'next/server'
import {
  isConfiguredP2GSource,
  P2G_COOKIE_MAX_AGE,
  P2G_COOKIE_NAME,
} from '@/lib/orders/attribution'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const sourceId = request.nextUrl.searchParams.get('source_id')

  if (isConfiguredP2GSource(sourceId, process.env.P2G_AFFILIATE_ID)) {
    response.cookies.set(P2G_COOKIE_NAME, sourceId!, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV !== 'development',
      path: '/',
      maxAge: P2G_COOKIE_MAX_AGE,
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
