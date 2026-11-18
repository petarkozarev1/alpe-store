import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

function notionClient() {
  const key = process.env.NOTION_API_KEY
  if (!key) throw new Error('NOTION_API_KEY missing')
  return new Client({ auth: key })
}

async function dataSourceId(notion: Client, databaseId: string) {
  try {
    await notion.dataSources.retrieve({ data_source_id: databaseId })
    return databaseId
  } catch {
    const database = await notion.databases.retrieve({ database_id: databaseId })
    if ('data_sources' in database && database.data_sources[0]?.id) return database.data_sources[0].id
    return databaseId
  }
}

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'email required' }, { status: 400 })
    }

    const databaseId = process.env.NOTION_NEWSLETTER_DATABASE_ID
    if (!databaseId) {
      console.warn('[NEWSLETTER] NOTION_NEWSLETTER_DATABASE_ID not set')
      return NextResponse.json({ ok: true, stored: false })
    }

    const notion = notionClient()
    const dsId = await dataSourceId(notion, databaseId)

    const existing = await notion.dataSources.query({
      data_source_id: dsId,
      filter: { property: 'Email', email: { equals: email.toLowerCase().trim() } },
      page_size: 1,
    })
    if (existing.results.length > 0) {
      return NextResponse.json({ ok: true, stored: true, duplicate: true })
    }

    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Email: { email: email.toLowerCase().trim() },
        Date: { date: { start: new Date().toISOString() } },
        Source: { select: { name: 'Newsletter' } },
      },
    })

    return NextResponse.json({ ok: true, stored: true })
  } catch (err) {
    console.error('[NEWSLETTER]', err instanceof Error ? err.message : err)
    return NextResponse.json({ ok: true, stored: false })
  }
}
