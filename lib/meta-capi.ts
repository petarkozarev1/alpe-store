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

export interface CAPIOptions {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  city?: string
  value?: number
  currency?: string
  orderId?: string
  contentIds?: string[]
  numItems?: number
  eventId?: string
  sourceUrl?: string
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

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
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
    if (!res.ok) {
      console.error('[CAPI] Error:', await res.text())
    } else {
      console.log(`[CAPI] ${eventName} sent`)
    }
  } catch (err) {
    console.error('[CAPI] Failed:', err)
  }
}
