import {
  getOrderByPageId,
  setPaidAtIfMissing,
} from '@/lib/orders/notion'
import {
  createNotionWebhookHandler,
  verifyNotionSignature,
} from '@/lib/orders/notionWebhook'

export async function POST(req: Request) {
  return createNotionWebhookHandler({
    verificationToken: process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN ?? '',
    affiliateId: process.env.P2G_AFFILIATE_ID ?? '',
    verifySignature: verifyNotionSignature,
    getOrder: getOrderByPageId,
    setPaidAtIfMissing,
    now: () => new Date().toISOString(),
    recordVerificationToken: token => {
      console.info('[Notion webhook] verification token:', token)
    },
  })(req)
}
