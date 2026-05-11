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
    try {
      firePixelEvent('Purchase', {
        value,
        currency,
        content_type: 'product',
        order_id: orderId,
      })
    } catch {
      // pixel failure must never break the success page
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
