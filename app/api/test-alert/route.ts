// TEMPORARY: one-off endpoint to verify the Discord alert webhook is wired correctly.
// This file will be deleted as soon as the test confirms alerts work.
// Guard: requires ?key=alpe-verify-tonight so randos can't spam the Discord channel.

import { NextResponse } from 'next/server'
import { notifyAlert } from '@/lib/alerts'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key')

  if (key !== 'alpe-verify-tonight') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  await notifyAlert({
    severity: 'info',
    title: 'Alert system test — please ignore',
    body: `If you see this in Discord, the alerting pipeline is working. This endpoint will be removed shortly.\n\n**Time:** ${new Date().toISOString()}\n**Deploy:** test from /api/test-alert`,
  })

  return NextResponse.json({
    ok: true,
    sent: 'Alert dispatched. Check your Discord #general channel.',
  })
}
