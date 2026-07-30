import { getRequiredEnv } from '@/lib/stripe'
import {
  markP2GReported,
  type OrderRecord,
} from './notion'

type ReportResult = 'sent' | 'skipped' | 'failed'

interface P2GReporterDependencies {
  affiliateId: string
  postbackUrl: string
  fetchPostback: (
    url: URL,
    init: RequestInit
  ) => Promise<{ ok: boolean; status: number }>
  markReported: (pageId: string, reportedAt: string) => Promise<void>
  now: () => string
  logError: (message: string, details: unknown) => void
}

export function buildP2GPostbackUrl(
  order: OrderRecord,
  postbackUrl: string
) {
  const url = new URL(postbackUrl)
  url.searchParams.set('customer_id', order.orderId)
  url.searchParams.set('deposit', (order.paidAmountCents / 100).toFixed(2))
  url.searchParams.set('brand', 'ALPE')
  return url
}

export function createP2GReporter(dependencies: P2GReporterDependencies) {
  return async function reportPaidP2GOrder(
    order: OrderRecord
  ): Promise<ReportResult> {
    if (
      order.paymentStatus !== 'Paid' ||
      order.affiliateId !== dependencies.affiliateId ||
      order.paidAmountCents <= 0 ||
      order.p2gReported
    ) {
      return 'skipped'
    }

    const url = buildP2GPostbackUrl(order, dependencies.postbackUrl)

    try {
      const response = await dependencies.fetchPostback(url, {
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(8_000),
      })

      if (!response.ok) {
        dependencies.logError('P2G postback failed', {
          orderId: order.orderId,
          status: response.status,
        })
        return 'failed'
      }

      await dependencies.markReported(order.pageId, dependencies.now())
      return 'sent'
    } catch (error) {
      dependencies.logError('P2G postback failed', {
        orderId: order.orderId,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return 'failed'
    }
  }
}

export function reportPaidP2GOrder(order: OrderRecord) {
  return createP2GReporter({
    affiliateId: getRequiredEnv('P2G_AFFILIATE_ID'),
    postbackUrl: getRequiredEnv('P2G_POSTBACK_URL'),
    fetchPostback: fetch,
    markReported: markP2GReported,
    now: () => new Date().toISOString(),
    logError: (message, details) => console.error(message, details),
  })(order)
}
