'use client'

import { useEffect, useState } from 'react'
import { fallbackInventory, type InventorySnapshot } from '@/lib/stock'

export function useInventory() {
  const [snapshot, setSnapshot] = useState<InventorySnapshot>(fallbackInventory())

  useEffect(() => {
    if (typeof fetch !== 'function') return
    let cancelled = false
    fetch('/api/inventory')
      .then(response => (response.ok ? response.json() : Promise.reject(new Error('inventory'))))
      .then((data: InventorySnapshot) => {
        if (!cancelled && data?.daily?.status && data?.evening?.status) setSnapshot(data)
      })
      .catch(() => {
        if (!cancelled) setSnapshot(fallbackInventory())
      })
    return () => {
      cancelled = true
    }
  }, [])

  return snapshot
}
