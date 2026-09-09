const baseUrl = process.env.ALPE_VERIFY_URL ?? 'http://localhost:3000'
const routes = [
  '/en', '/en/about', '/en/shop', '/en/lenses', '/en/science', '/en/certifications',
  '/en/faqs', '/en/pricing', '/en/returns', '/en/contact', '/en/privacy', '/en/terms',
  '/en/product/alpe-daily', '/en/product/alpe-evening', '/en/cart', '/en/checkout',
  '/en/checkout/success?cod=1',
]

const failures = []
for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`)
  if (!response.ok) {
    failures.push(`${route}: HTTP ${response.status}`)
    continue
  }
  const html = await response.text()
  const renderedDocument = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
  const residue = renderedDocument.match(/[А-Яа-я][^<>"\n]{0,100}/g)
  if (residue) failures.push(`${route}: ${[...new Set(residue)].join(' | ')}`)
}

if (failures.length) {
  console.error(`English-route verification failed:\n${failures.join('\n')}`)
  process.exit(1)
}
console.log(`Verified ${routes.length} English routes with no Cyrillic residue.`)
