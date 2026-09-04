import { NextResponse } from 'next/server'
import type { OrderRecord } from './notion'
import {
  isP2GEligible,
  P2G_HOLD_DAYS,
  type P2GReportResult,
} from './p2g'

interface P2GCronDependencies {
  cronSecret: string
  affiliateId: string
  now: () => string
  listCandidates: (
    cutoff: string,
    affiliateId: string
  ) => Promise<OrderRecord[]>
  getOrder: (pageId: string) => Promise<OrderRecord | null>
  reportOrder: (order: OrderRecord) => Promise<P2GReportResult>
  logError: (message: string, details: unknown) => void
}
export function createP2GCronHandler(dependencies: P2GCronDependencies) {
  return async function p2gCronHandler(req: Request) {
    if (
      !dependencies.cronSecret ||
      req.headers.get('authorization') !== `Bearer ${dependencies.cronSecret}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = dependencies.now()
    const cutoff = new Date(
      Date.parse(now) - P2G_HOLD_DAYS * 24 * 60 * 60 * 1000
    ).toISOString()

    try {
      const candidates = await dependencies.listCandidates(
        cutoff,
        dependencies.affiliateId
      )
      const counts = {
        processed: candidates.length,
        sent: 0,
        failed: 0,
        skipped: 0,
      }

      for (const candidate of candidates) {
        try {
          const current = await dependencies.getOrder(candidate.pageId)
          if (!current || !isP2GEligible(
            current,
            dependencies.affiliateId,
            now
          )) {
            counts.skipped += 1
            continue
          }

          const result = await dependencies.reportOrder(current)
          counts[result] += 1
        } catch (error) {
          counts.failed += 1
          dependencies.logError('P2G cron order failed', {
            pageId: candidate.pageId,
            orderId: candidate.orderId,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }

      return NextResponse.json(counts)
    } catch (error) {
      dependencies.logError('P2G cron query failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return NextResponse.json(
        { error: 'P2G cron processing failed' },
        { status: 500 }
      )
    }
  }
}
