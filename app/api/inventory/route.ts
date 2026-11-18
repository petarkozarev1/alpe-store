import { NextResponse } from 'next/server'
import { getInventory } from '@/lib/inventory'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const snapshot = await getInventory()
  return NextResponse.json(snapshot, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
