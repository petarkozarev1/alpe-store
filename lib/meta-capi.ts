const PIXEL_ID = '1435898268342097'
const CAPI_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`

async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(value.trim().toLowerCase())
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function normalizeCountry(value: string) {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'българия' || normalized === 'bulgaria') return 'bg'
  return normalized
}

export interface CAPIOptions {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  city?: string
  country?: string
  zip?: string
  fbp?: string
  fbc?: string
  clientIpAddress?: string
  clientUserAgent?: string
  value?: number
  currency?: string
  orderId?: string
  contentIds?: string[]
  numItems?: number
  eventId?: string
  sourceUrl?: string
  /** Unix timestamp (seconds) of the actual event. Defaults to now. Meta requires within 7 days of real event. */
  eventTime?: number
}

export async function sendCAPIEvent(eventName: string, opts: CAPIOptions = {}): Promise<void> {
  const token = process.env.META_CAPI_TOKEN
  if (!token) {
    console.warn('[CAPI] META_CAPI_TOKEN not set — skipping')
    return
  }

  const userData: Record<string, string> = {}
  if (opts.email)     userData.em = await sha256(opts.email)
  if (opts.phone)     userData.ph = await sha256(opts.phone.replace(/\D/g, ''))
  if (opts.firstName) userData.fn = await sha256(opts.firstName)
  if (opts.lastName)  userData.ln = await sha256(opts.lastName)
  if (opts.city)      userData.ct = await sha256(opts.city)
  if (opts.country)   userData.country = await sha256(normalizeCountry(opts.country))
  if (opts.zip)       userData.zp = await sha256(opts.zip)
  if (opts.fbp)       userData.fbp = opts.fbp
  if (opts.fbc)       userData.fbc = opts.fbc
  if (opts.clientIpAddress) userData.client_ip_address = opts.clientIpAddress
  if (opts.clientUserAgent) userData.client_user_agent = opts.clientUserAgent

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: opts.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: opts.eventId ?? `${eventName}-${Date.now()}`,
        event_source_url: opts.sourceUrl ?? 'https://alpewear.com',
        action_source: 'website',
        user_data: userData,
        custom_data: {
          value: opts.value,
          currency: opts.currency ?? 'EUR',
          order_id: opts.orderId,
          content_ids: opts.contentIds,
          content_type: 'product',
          num_items: opts.numItems,
        },
      },
    ],
  }

  try {
    const res = await fetch(`${CAPI_URL}?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const rawBody = await res.text()
    let body: Record<string, unknown> = {}
    try { body = JSON.parse(rawBody) } catch { /* keep rawBody as-is */ }

    if (!res.ok) {
      console.error(`[CAPI] ${eventName} HTTP ${res.status}:`, rawBody)
      return
    }

    const eventsReceived = body.events_received as number | undefined
    const messages = body.messages as unknown[] | undefined
    const fbtraceId = body.fbtrace_id as string | undefined

    if (eventsReceived === 0 || (messages && messages.length > 0)) {
      console.warn(
        `[CAPI] ${eventName} accepted but flagged — events_received=${eventsReceived} messages=${JSON.stringify(messages)} fbtrace_id=${fbtraceId}`
      )
    } else {
      console.log(
        `[CAPI] ${eventName} sent — events_received=${eventsReceived} fbtrace_id=${fbtraceId}`
      )
    }
  } catch (err) {
    console.error(`[CAPI] ${eventName} fetch failed:`, err)
  }
}
