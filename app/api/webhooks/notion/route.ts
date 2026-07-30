import { getOrderByPageId } from '@/lib/orders/notion'
import {
  createNotionWebhookHandler,
  verifyNotionSignature,
} from '@/lib/orders/notionWebhook'
import { reportPaidP2GOrder } from '@/lib/orders/p2g'
import { getRequiredEnv } from '@/lib/stripe'

export async function POST(req: Request) {
  return createNotionWebhookHandler({
    verificationToken: getRequiredEnv('NOTION_WEBHOOK_VERIFICATION_TOKEN'),
    affiliateId: getRequiredEnv('P2G_AFFILIATE_ID'),
    verifySignature: verifyNotionSignature,
    getOrder: getOrderByPageId,
    reportOrder: reportPaidP2GOrder,
    recordVerificationToken: token => {
      console.info('[Notion webhook] verification token:', token)
    },
  })(req)
}
