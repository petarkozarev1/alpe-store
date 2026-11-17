import { NextResponse } from 'next/server'
import { getInventory } from '@/lib/inventory'

export async function GET() {
  const snapshot = await getInventory()
  return NextResponse.json(snapshot)
}
