import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import type { OrderRecord } from './notion'

interface NotionWebhookDependencies {
  verificationToken: string
  affiliateId: string
  verifySignature: (args: {
    body: string
    signature: string
    verificationToken: string
  }) => Promise<boolean>
  getOrder: (pageId: string) => Promise<OrderRecord | null>
  reportOrder: (order: OrderRecord) => Promise<unknown>
}

interface NotionEvent {
  type?: string
  entity?: {
    id?: string
    type?: string
  }
  verification_token?: string
}

export async function verifyNotionSignature(args: {
  body: string
  signature: string
  verificationToken: string
}) {
  const expected = `sha256=${createHmac('sha256', args.verificationToken)
    .update(args.body)
    .digest('hex')}`
  const expectedBuffer = Buffer.from(expected)
  const signatureBuffer = Buffer.from(args.signature)

  return expectedBuffer.length === signatureBuffer.length &&
    timingSafeEqual(expectedBuffer, signatureBuffer)
}

export function createNotionWebhookHandler(
  dependencies: NotionWebhookDependencies
) {
  return async function notionWebhookHandler(req: Request) {
    const body = await req.text()
    let event: NotionEvent

    try {
      event = JSON.parse(body) as NotionEvent
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    }

    if (event.verification_token) {
      return NextResponse.json({ received: true })
    }

    const signature = req.headers.get('x-notion-signature')
    if (!signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const isValid = await dependencies.verifySignature({
      body,
      signature,
      verificationToken: dependencies.verificationToken,
    })
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    if (
      event.type !== 'page.properties_updated' ||
      event.entity?.type !== 'page' ||
      !event.entity.id
    ) {
      return NextResponse.json({ received: true })
    }

    try {
      const order = await dependencies.getOrder(event.entity.id)
      if (
        order?.paymentMethod === 'cod' &&
        order.paymentStatus === 'Paid' &&
        order.affiliateId === dependencies.affiliateId
      ) {
        await dependencies.reportOrder(order)
      }

      return NextResponse.json({ received: true })
    } catch (error) {
      console.error('Notion webhook processing error:', error)
      return NextResponse.json(
        { error: 'Order processing failed' },
        { status: 500 }
      )
    }
  }
}
