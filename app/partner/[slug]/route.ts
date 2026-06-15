import { NextRequest, NextResponse } from 'next/server'
import { getPartnerDashboardData, type PartnerDashboardData, type PartnerOrder } from '@/lib/partner-dashboard'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: { slug: string }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const slug = normalizeSlug(params.slug)
  const sessionCookie = getSessionCookie(slug)
  const key = request.cookies.get(sessionCookie)?.value || null
  const data = await getPartnerDashboardData(slug, key)
  const html = data.status === 'authorized'
    ? renderDashboard(data)
    : renderAccessScreen(data.partnerName, slug)

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  })
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const slug = normalizeSlug(params.slug)
  const formData = await request.formData()
  const password = String(formData.get('password') || '')
  const data = await getPartnerDashboardData(slug, password)

  if (data.status !== 'authorized') {
    return new NextResponse(renderAccessScreen(data.partnerName, slug, true), {
      status: 401,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
    })
  }

  const response = new NextResponse(null, {
    status: 303,
    headers: { Location: `/partner/${slug}` },
  })
  response.cookies.set(getSessionCookie(slug), password, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: `/partner/${slug}`,
  })
  return response
}

function getSessionCookie(slug: string): string {
  return `alpe_partner_${slug.replace(/[^a-z0-9]/g, '_')}`
}

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase()
}

function renderAccessScreen(partnerName: string, slug: string, hasError = false): string {
  return renderShell({
    title: `${partnerName} Partner Dashboard`,
    body: `
      <main class="access">
        <section class="login-card">
          <img class="logo" src="/images/logo.png" alt="ALPE">
          <p class="eyebrow">Private partner access</p>
          <h1>${escapeHtml(partnerName)} Dashboard</h1>
          <p class="muted">Use the password from ALPE to view orders and revenue for this promo code.</p>
          <form method="post" action="/partner/${escapeHtml(slug)}">
            <label for="password">Password</label>
            <div class="password-row">
              <input id="password" name="password" type="password" inputmode="numeric" autocomplete="current-password" placeholder="Enter password" autofocus>
              <button type="submit">Enter</button>
            </div>
            ${hasError ? '<p class="error">Wrong password. Try again.</p>' : ''}
          </form>
        </section>
      </main>
    `,
  })
}

function renderDashboard(data: PartnerDashboardData): string {
  return renderShell({
    title: `${data.partnerName} Partner Dashboard`,
    body: `
      <main class="dashboard">
        <header class="topbar">
          <div class="brand-title">
            <img class="logo" src="/images/logo.png" alt="ALPE">
            <p class="eyebrow">ALPE Partner Dashboard</p>
            <h1>${escapeHtml(data.partnerName)}</h1>
          </div>
          <div class="code">${escapeHtml(data.promoCode)}</div>
        </header>

        ${data.isPreview ? '<div class="notice">Local preview data. Production will read the live Notion database.</div>' : ''}

        <section class="metrics" aria-label="Performance summary">
          ${renderMetric('Orders', data.totalOrders.toString())}
          ${renderMetric('Revenue', formatCurrency(data.totalRevenue))}
          ${renderMetric('Average order', formatCurrency(data.averageOrderValue))}
        </section>

        <section class="panel">
          <div class="section-heading">
            <h2>Latest orders</h2>
            <span>Updated ${formatDateTime(data.generatedAt)}</span>
          </div>
          ${renderOrdersTable(data.orders)}
        </section>
      </main>
    `,
  })
}

function renderMetric(label: string, value: string): string {
  return `
    <article class="metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `
}

function renderOrdersTable(orders: PartnerOrder[]): string {
  if (!orders.length) {
    return '<p class="empty">No orders with this promo code yet.</p>'
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Order</th>
            <th>Items</th>
            <th class="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(renderOrderRow).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderOrderRow(order: PartnerOrder): string {
  return `
    <tr>
      <td>${escapeHtml(formatDate(order.date))}</td>
      <td>${escapeHtml(order.orderRef)}</td>
      <td>${escapeHtml(order.items)}</td>
      <td class="amount">${escapeHtml(formatCurrency(order.total))}</td>
    </tr>
  `
}

function renderShell({ title, body }: { title: string; body: string }): string {
  return `<!doctype html>
<html lang="bg">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #fff5e9;
      --panel: rgba(255, 255, 255, 0.82);
      --ink: #2d0e04;
      --muted: #8b7569;
      --line: #eadccc;
      --gold: #c4a266;
      --iron: #7c3018;
      --shadow: 0 24px 70px rgba(45, 14, 4, 0.11);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at 18% 4%, rgba(196, 162, 102, 0.24), transparent 34%),
        linear-gradient(135deg, #fffaf3 0%, var(--bg) 46%, #f1dfcc 100%);
      color: var(--ink);
      font-family: Raleway, "Segoe UI", sans-serif;
      letter-spacing: 0;
    }
    body:before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image: linear-gradient(rgba(45, 14, 4, 0.035) 1px, transparent 1px);
      background-size: 100% 38px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0.75), transparent 70%);
    }
    .dashboard {
      width: min(1120px, calc(100% - 32px));
      margin: 0 auto;
      padding: 34px 0;
    }
    .access {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
    }
    .logo {
      display: block;
      width: 176px;
      height: auto;
      object-fit: contain;
      border-radius: 14px;
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 26px;
    }
    .brand-title .logo {
      margin-bottom: 24px;
    }
    .eyebrow {
      margin: 0 0 8px;
      color: var(--gold);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    h1, h2, p { margin-top: 0; }
    h1 {
      margin-bottom: 0;
      font-size: clamp(34px, 6vw, 64px);
      line-height: 1;
      font-family: Georgia, serif;
      font-weight: 500;
    }
    h2 {
      margin-bottom: 0;
      font-size: 24px;
      line-height: 1.2;
    }
    .code {
      border: 1px solid var(--line);
      border-radius: 999px;
      background: rgba(255,255,255,0.76);
      padding: 13px 20px;
      font-weight: 700;
      letter-spacing: 0.08em;
      box-shadow: 0 10px 30px rgba(45, 14, 4, 0.06);
    }
    .notice {
      margin-bottom: 18px;
      border: 1px solid #ead3a3;
      border-radius: 18px;
      background: #fff4d8;
      padding: 12px 14px;
      color: #60481e;
      font-size: 14px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 20px;
    }
    .metric, .panel {
      border: 1px solid var(--line);
      border-radius: 24px;
      background: var(--panel);
      backdrop-filter: blur(18px);
    }
    .metric {
      position: relative;
      overflow: hidden;
      padding: 20px;
    }
    .metric:after {
      content: "";
      position: absolute;
      right: -28px;
      top: -28px;
      width: 90px;
      height: 90px;
      border-radius: 999px;
      background: rgba(196, 162, 102, 0.16);
    }
    .metric span {
      display: block;
      margin-bottom: 12px;
      color: var(--muted);
      font-size: 13px;
    }
    .metric strong {
      display: block;
      font-size: 30px;
      line-height: 1;
      font-family: Georgia, serif;
      font-weight: 500;
    }
    .panel {
      padding: 20px;
      box-shadow: var(--shadow);
    }
    .login-card {
      width: min(480px, 100%);
      border: 1px solid rgba(234, 220, 204, 0.9);
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.84);
      padding: 34px;
      text-align: center;
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }
    .login-card .logo {
      margin: 0 auto 26px;
    }
    .muted, .empty {
      color: var(--muted);
      line-height: 1.6;
    }
    form {
      margin-top: 26px;
      text-align: left;
    }
    label {
      display: block;
      margin-bottom: 8px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .password-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
    }
    input {
      min-width: 0;
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: #fffaf4;
      color: var(--ink);
      padding: 14px 16px;
      font: inherit;
      outline: none;
    }
    input:focus {
      border-color: var(--gold);
      box-shadow: 0 0 0 4px rgba(196, 162, 102, 0.16);
    }
    button {
      border: 0;
      border-radius: 999px;
      background: var(--ink);
      color: #fff7ed;
      padding: 14px 22px;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    .error {
      margin: 10px 0 0;
      color: #9d2f18;
      font-size: 13px;
    }
    .section-heading {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;
    }
    .section-heading span {
      color: var(--muted);
      font-size: 13px;
    }
    .table-wrap {
      overflow-x: auto;
      border: 1px solid var(--line);
      border-radius: 22px;
      background: rgba(255, 250, 244, 0.72);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 680px;
    }
    th, td {
      border-top: 1px solid var(--line);
      padding: 13px 10px;
      text-align: left;
      vertical-align: top;
      font-size: 14px;
    }
    tbody tr:first-child td {
      border-top-color: var(--line);
    }
    tbody tr:hover td {
      background: rgba(196, 162, 102, 0.08);
    }
    th {
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .amount {
      text-align: right;
      white-space: nowrap;
    }
    @media (max-width: 720px) {
      .dashboard { width: min(100% - 24px, 1120px); padding: 20px 0; }
      .topbar { align-items: flex-start; flex-direction: column; }
      .metrics { grid-template-columns: 1fr; }
      .panel { padding: 16px; }
      .section-heading { align-items: flex-start; flex-direction: column; }
      .login-card { padding: 26px 18px; }
      .password-row { grid-template-columns: 1fr; }
      button { width: 100%; }
    }
  </style>
</head>
<body>
${body}
</body>
</html>`
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value)
}

function formatDate(value: string): string {
  if (!value) return '-'
  return new Intl.DateTimeFormat('bg-BG', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('bg-BG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
