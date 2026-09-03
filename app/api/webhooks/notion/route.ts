import { getOrderByPageId } from '@/lib/orders/notion'
import {
  createNotionWebhookHandler,
  verifyNotionSignature,
} from '@/lib/orders/notionWebhook'
import { reportPaidP2GOrder } from '@/lib/orders/p2g'

export async function POST(req: Request) {
  return createNotionWebhookHandler({
    verificationToken: process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN ?? '',
    affiliateId: process.env.P2G_AFFILIATE_ID ?? '',
    verifySignature: verifyNotionSignature,
    getOrder: getOrderByPageId,
    reportOrder: reportPaidP2GOrder,
    recordVerificationToken: token => {
      console.info('[Notion webhook] verification token:', token)
    },
  })(req)
}
