import fs from 'fs'
import path from 'path'

describe('localized App Router structure', () => {
  const root = process.cwd()

  it('places the customer storefront under a locale segment', () => {
    expect(fs.existsSync(path.join(root, 'app/[locale]/layout.tsx'))).toBe(true)
    expect(fs.existsSync(path.join(root, 'app/[locale]/page.tsx'))).toBe(true)
    expect(fs.existsSync(path.join(root, 'app/[locale]/shop/page.tsx'))).toBe(true)
    expect(fs.existsSync(path.join(root, 'app/[locale]/checkout/success/page.tsx'))).toBe(true)
  })

  it('keeps APIs outside the locale segment', () => {
    expect(fs.existsSync(path.join(root, 'app/api/checkout/route.ts'))).toBe(true)
    expect(fs.existsSync(path.join(root, 'app/[locale]/api'))).toBe(false)
  })
})
