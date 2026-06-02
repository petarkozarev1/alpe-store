import { NextResponse } from 'next/server'
import { sendCAPIEvent } from '@/lib/meta-capi'

/**
 * Client → CAPI bridge. The browser fires the Meta Pixel and POSTs the same event here
 * (with a shared event_id) so it is mirrored server-side and deduplicated. Fire-and-forget:
 * always returns 200 and never throws, so it can't break the client funnel.
 */
interface TrackBody {
  eventName?: string
  eventId?: string
  value?: number
  currency?: string
  contentIds?: string[]
  numItems?: number
  ctaLocation?: string
  email?: string
  phone?: string
  fbp?: string
  fbc?: string
  sourceUrl?: string
}

export async function POST(req: Request) {
  try {
    const clientIpAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      undefined
    const clientUserAgent = req.headers.get('user-agent') ?? undefined

    const body = (await req.json()) as TrackBody
    if (!body.eventName) {
      return NextResponse.json({ ok: false, error: 'eventName required' }, { status: 400 })
    }

    await sendCAPIEvent(body.eventName, {
      email: body.email || undefined,
      phone: body.phone || undefined,
      city: undefined,
      fbp: body.fbp || undefined,
      fbc: body.fbc || undefined,
      clientIpAddress,
      clientUserAgent,
      value: body.value,
      currency: body.currency,
      contentIds: body.contentIds,
      numItems: body.numItems,
      eventId: body.eventId,
      sourceUrl: body.sourceUrl,
      customData: body.ctaLocation ? { cta_location: body.ctaLocation } : undefined,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Never let tracking break the client; log and move on.
    console.error('[TRACK] CAPI mirror failed:', err instanceof Error ? err.message : err)
    return NextResponse.json({ ok: true })
  }
}
