export const DELIVERY_PRICE = 4.99
export const INTL_FEE = 4.99
export const COD_FEE = 1.0
export const BGN_RATE = 1.95583
export const COD_PREFERRED_COURIER = 'pigeon'

export const DELIVERY = [
  { id: 'speedy',  label: 'Спиди',    badge: null as string | null, requiresOffice: true,  officePlaceholder: 'напр. Спиди офис Сердика, бул. Сливница 2, София', officeLink: 'https://www.speedy.bg/bg/office-search', availableOnCod: true },
  { id: 'econt',   label: 'Еконт',    badge: null as string | null, requiresOffice: true,  officePlaceholder: 'напр. Еконт Сердика, бул. Сливница 2, София', officeLink: 'https://www.econt.com/services/offices.html', availableOnCod: true },
  { id: 'boxnow',  label: 'BoxNow',   badge: null as string | null, requiresOffice: true,  officePlaceholder: 'напр. BoxNow Mall of Sofia, бул. Климент Охридски', officeLink: 'https://boxnow.bg/lockers', availableOnCod: false },
  { id: 'pigeon',  label: 'Pigeon Express', badge: 'ПРЕПОРЪЧАНО' as string | null, requiresOffice: true,  officePlaceholder: 'напр. Pigeon Express локер НДК, пл. България 1, София', officeLink: 'https://pigeonexpress.com', availableOnCod: true },
]

export type DeliveryOption = (typeof DELIVERY)[number]

export function visibleCouriers(isCod: boolean): DeliveryOption[] {
  return isCod ? DELIVERY.filter(d => d.availableOnCod) : DELIVERY
}

export function courierBadge(isCod: boolean, d: { id: string; badge?: string | null }): string | null {
  if (d.id === 'pigeon') return 'ПРЕПОРЪЧАНО'
  return d.badge ?? null
}

/** Empty or unknown country stays domestic. Office delivery is Bulgaria-only. */
export function isBulgaria(country?: string) {
  const n = (country ?? '').trim().toLowerCase()
  return n === '' || n === 'българия' || n === 'bulgaria' || n === 'bg'
}

/** Domestic delivery: free at 2+ pairs, otherwise the flat rate. */
export function deliveryAmount(pairs: number) {
  return pairs >= 2 ? 0 : DELIVERY_PRICE
}

/** Extra logistics fee on every order outside Bulgaria, including free-delivery orders. */
export function internationalFee(country?: string) {
  return isBulgaria(country) ? 0 : INTL_FEE
}
