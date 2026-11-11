import { render } from '@testing-library/react'
import SellerDetails from '@/components/legal/SellerDetails'
import { COMPANY } from '@/lib/brand'

const ownerNames = /Козарев|Поплилов|Kozarev|Poplilov|Управител|Managers/

test('seller details keep the merchant record and omit owner names', () => {
  expect(JSON.stringify(COMPANY)).not.toMatch(ownerNames)

  for (const locale of ['bg', 'en'] as const) {
    const { container, unmount } = render(<SellerDetails locale={locale} />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(ownerNames)
    expect(text).toMatch(/208982100/)
    expect(text).toMatch(/0884555077/)
    expect(text).toMatch(/hello@alpewear\.com/)
    expect(text).toMatch(/АМПЕ ГРУП ООД/)
    expect(text).toMatch(/AMPE GROUP Ltd/)
    expect(text).toMatch(/Мирела Френи|Mirela Freni/)
    unmount()
  }
})
