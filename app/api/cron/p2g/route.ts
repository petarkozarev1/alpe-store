import { NextResponse } from 'next/server'
import { getOrderByPageId, listP2GCandidates, markP2GReported } from '@/lib/p2g/notion'
import { buildP2GPostbackUrl, isP2GEligible, P2G_HOLD_DAYS } from '@/lib/p2g/reporter'

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET ?? ''
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const affiliateId = process.env.P2G_AFFILIATE_ID ?? ''
  const endpoint = process.env.P2G_POSTBACK_URL ?? ''
  if (!affiliateId || !endpoint) return NextResponse.json({ error: 'P2G is not configured' }, { status: 500 })
  const now = new Date().toISOString()
  const cutoff = new Date(Date.parse(now) - P2G_HOLD_DAYS * 86400000).toISOString()
  const candidates = await listP2GCandidates(cutoff, affiliateId)
  const counts = { processed: candidates.length, sent: 0, failed: 0, skipped: 0 }
  for (const candidate of candidates) {
    try {
      const order = await getOrderByPageId(candidate.pageId)
      if (!order || !isP2GEligible(order, affiliateId, now)) { counts.skipped++; continue }
      const response = await fetch(buildP2GPostbackUrl(order, endpoint), { method: 'GET', cache: 'no-store', signal: AbortSignal.timeout(8000) })
      if (!response.ok) { counts.failed++; console.error('[P2G] postback failed', { orderId: order.orderId, status: response.status }); continue }
      await markP2GReported(order.pageId, now)
      counts.sent++
    } catch (error) {
      counts.failed++
      console.error('[P2G] order failed', { pageId: candidate.pageId, orderId: candidate.orderId, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }
  return NextResponse.json(counts)
}
