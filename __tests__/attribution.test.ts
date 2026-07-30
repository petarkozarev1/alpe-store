import {
  getP2GAttribution,
  isConfiguredP2GSource,
} from '@/lib/orders/attribution'

describe('P2G attribution', () => {
  test('accepts only an exact configured affiliate ID', () => {
    expect(isConfiguredP2GSource('partner-fixed-id', 'partner-fixed-id')).toBe(true)
    expect(isConfiguredP2GSource('PARTNER-FIXED-ID', 'partner-fixed-id')).toBe(false)
    expect(isConfiguredP2GSource('', 'partner-fixed-id')).toBe(false)
    expect(isConfiguredP2GSource('partner-fixed-id', '')).toBe(false)
  })

  test('returns the configured ID only for a validated cookie', () => {
    expect(getP2GAttribution('partner-fixed-id', 'partner-fixed-id'))
      .toBe('partner-fixed-id')
    expect(getP2GAttribution('forged-id', 'partner-fixed-id')).toBeNull()
  })
})
