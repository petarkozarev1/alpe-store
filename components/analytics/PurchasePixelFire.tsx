'use client'

import { useEffect } from 'react'
import { fireTrackedEvent } from './MetaPixel'

interface Props {
  value: number
  currency?: string
  orderId: string
  contentIds?: string[]
  numItems?: number
}

export default function PurchasePixelFire({ value, currency = 'EUR', orderId, contentIds, numItems }: Props) {
  useEffect(() => {
    if (!orderId || value <= 0) return

    try {
      fireTrackedEvent('Purchase', {
        eventId: `purchase-${orderId}`,
        data: {
          value,
          currency,
          content_type: 'product',
          order_id: orderId,
          content_ids: contentIds,
          num_items: numItems,
        },
        value,
        currency,
        contentIds,
        numItems,
      })
    } catch {
      // pixel failure must never break the success page
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
