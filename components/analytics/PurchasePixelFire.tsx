'use client'

import { useEffect } from 'react'
import { firePixelEvent } from './MetaPixel'

interface Props {
  value: number
  currency?: string
  orderId: string
}

export default function PurchasePixelFire({ value, currency = 'EUR', orderId }: Props) {
  useEffect(() => {
    if (!orderId || value <= 0) return

    try {
      firePixelEvent('Purchase', {
        value,
        currency,
        content_type: 'product',
        order_id: orderId,
      }, `purchase-${orderId}`)
    } catch {
      // pixel failure must never break the success page
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
