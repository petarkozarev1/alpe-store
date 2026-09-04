import {
  getOrderByPageId,
  listP2GCandidates,
} from '@/lib/orders/notion'
import { reportPaidP2GOrder } from '@/lib/orders/p2g'
import { createP2GCronHandler } from '@/lib/orders/p2gCron'

export async function GET(req: Request) {
  return createP2GCronHandler({
    cronSecret: process.env.CRON_SECRET ?? '',
    affiliateId: process.env.P2G_AFFILIATE_ID ?? '',
    now: () => new Date().toISOString(),
    listCandidates: listP2GCandidates,
    getOrder: getOrderByPageId,
    reportOrder: reportPaidP2GOrder,
    logError: (message, details) => console.error(message, details),
  })(req)
}
