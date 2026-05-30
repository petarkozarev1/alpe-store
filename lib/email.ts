import { Resend } from 'resend'

const BGN_RATE = 1.95583
const fmtEUR = (n: number) => `€${n.toFixed(2)}`
const fmtBGN = (n: number) => `${(Math.ceil(n * BGN_RATE * 100) / 100).toFixed(2)} лв.`
const LOGO_URL = 'https://www.alpewear.com/images/logo.png'

export interface OrderEmailRow { label: string; sublabel?: string; amount: number }
export interface OrderEmailModel {
  orderRef: string
  paymentMethod: 'card' | 'cod'
  customerFirstName: string
  productRows: OrderEmailRow[]
  subtotal: number
  discount?: { code: string; amount: number }
  shippingLabel: string
  shippingAmount: number
  codFee?: number
  total: number
  deliveryTo: { name: string; line: string; phone: string }
}

export function buildOrderEmailHtml(m: OrderEmailModel): string {
  const productRows = m.productRows.map(r => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid rgba(155,123,104,0.15);">
        <span style="font-family:Georgia,serif; font-size:15px; color:#2D0E04;">${r.label}</span><br/>
        ${r.sublabel ? `<span style="font-size:12px; color:#9B7B68;">${r.sublabel}</span>` : ''}
      </td>
      <td style="padding:8px 0; border-bottom:1px solid rgba(155,123,104,0.15); text-align:right; font-family:Georgia,serif; font-size:15px; color:#2D0E04; white-space:nowrap;">${fmtEUR(r.amount)}</td>
    </tr>`).join('')

  const summaryRow = (label: string, value: string, color = '#9B7B68', italic = false) => `
    <tr>
      <td style="padding:4px 0; color:${color};">${label}</td>
      <td style="padding:4px 0; text-align:right; color:${color}; ${italic ? 'font-style:italic;' : ''}">${value}</td>
    </tr>`

  const shippingValue = m.shippingAmount === 0 ? 'Безплатна' : fmtEUR(m.shippingAmount)
  const paymentLabel = m.paymentMethod === 'cod'
    ? 'Наложен платеж <span style="font-weight:normal; color:#9B7B68;">— плащаш в брой при доставка</span>'
    : 'Карта <span style="font-weight:normal; color:#9B7B68;">— платено онлайн</span>'

  return `<!DOCTYPE html><html lang="bg"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0; padding:0; background-color:#FFF0E0; font-family:Arial,Helvetica,sans-serif; color:#7C3018;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF0E0; padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#FFFBF5; border-radius:16px; overflow:hidden; border:1px solid rgba(155,123,104,0.18);">
  <tr><td style="background-color:#2D0E04; padding:24px 32px; text-align:center;">
    <img src="${LOGO_URL}" alt="ALPÉ" height="34" style="height:34px; display:inline-block;"/>
  </td></tr>
  <tr><td style="padding:36px 32px 8px 32px; text-align:center;">
    <div style="width:56px; height:56px; line-height:56px; border-radius:50%; background-color:#EDE4D6; color:#C4A266; font-size:28px; margin:0 auto 16px auto;">&#10003;</div>
    <h1 style="font-family:Georgia,serif; font-size:28px; font-weight:bold; color:#2D0E04; margin:0 0 8px 0;">Поръчката е приета!</h1>
    <p style="font-size:14px; line-height:1.6; color:#9B7B68; margin:0;">Благодарим ти, ${m.customerFirstName}. Получихме поръчката ти и я подготвяме.<br/>Изпращаме до 24 часа · доставка 1–3 работни дни.</p>
  </td></tr>
  <tr><td style="padding:20px 32px 4px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF0E0; border-radius:12px;"><tr>
      <td style="padding:12px 16px; font-size:12px; color:#9B7B68; text-transform:uppercase; letter-spacing:1px;">Номер на поръчка</td>
      <td style="padding:12px 16px; font-size:13px; color:#2D0E04; font-weight:bold; text-align:right;">${m.orderRef}</td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:20px 32px 0 32px;">
    <p style="font-size:11px; color:#9B7B68; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 12px 0;">Твоята поръчка</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${productRows}</table>
  </td></tr>
  <tr><td style="padding:16px 32px 0 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#9B7B68;">
      ${summaryRow('Междинна сума', fmtEUR(m.subtotal))}
      ${m.discount ? summaryRow(`Отстъпка (${m.discount.code})`, `−${fmtEUR(m.discount.amount)}`, '#2e7d32') : ''}
      ${summaryRow(`Доставка · ${m.shippingLabel}`, shippingValue, '#9B7B68', m.shippingAmount === 0)}
      ${m.codFee ? summaryRow('Наложен платеж', fmtEUR(m.codFee)) : ''}
      <tr>
        <td style="padding:12px 0 0 0; border-top:1px solid rgba(155,123,104,0.25); font-family:Georgia,serif; font-size:18px; font-weight:bold; color:#2D0E04;">Общо</td>
        <td style="padding:12px 0 0 0; border-top:1px solid rgba(155,123,104,0.25); text-align:right; font-family:Georgia,serif; font-size:18px; font-weight:bold; color:#2D0E04;">${fmtEUR(m.total)} <span style="font-size:12px; color:#9B7B68; font-weight:normal;">EUR</span><br/><span style="font-size:11px; color:#9B7B68; font-weight:normal;">${fmtBGN(m.total)}</span></td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="padding:24px 32px 0 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF0E0; border-radius:12px;"><tr><td style="padding:16px 18px;">
      <p style="font-size:11px; color:#9B7B68; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 6px 0;">Начин на плащане</p>
      <p style="font-size:14px; color:#2D0E04; margin:0 0 14px 0; font-weight:bold;">${paymentLabel}</p>
      <p style="font-size:11px; color:#9B7B68; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 6px 0;">Доставка до</p>
      <p style="font-size:14px; color:#2D0E04; line-height:1.6; margin:0;">${m.deliveryTo.name}<br/>${m.deliveryTo.line}<br/>${m.deliveryTo.phone}</p>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:24px 32px; text-align:center;">
    <p style="font-size:13px; color:#9B7B68; line-height:1.6; margin:0;">Въпроси по поръчката? Пиши ни на<br/><a href="mailto:support@alpe.bg" style="color:#7C3018; text-decoration:underline;">support@alpe.bg</a></p>
  </td></tr>
  <tr><td style="background-color:#2D0E04; padding:24px 32px; text-align:center;">
    <p style="font-size:12px; color:rgba(237,228,214,0.75); line-height:1.7; margin:0;">ALPÉ · Очила за блокиране на синя и зелена светлина<br/><a href="https://www.alpewear.com" style="color:rgba(237,228,214,0.75); text-decoration:underline;">alpewear.com</a></p>
    <p style="font-size:11px; color:rgba(237,228,214,0.45); margin:12px 0 0 0;">Screen All Day. Sleep All Night.</p>
  </td></tr>
</table></td></tr></table></body></html>`
}

export async function sendOrderConfirmation(to: string, model: OrderEmailModel): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) { console.warn('[EMAIL] RESEND_API_KEY not set — skipping'); return }
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: 'ALPÉ <hello@alpewear.com>',
    to,
    subject: `Поръчката ти е приета — ${model.orderRef}`,
    html: buildOrderEmailHtml(model),
  })
  if (error) throw new Error(`Resend send failed: ${JSON.stringify(error)}`)
}
