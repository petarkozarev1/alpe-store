export const DELIVERY_PRICE = 4.99
export const COD_FEE = 1.0
export const BGN_RATE = 1.95583
export const COD_PREFERRED_COURIER = 'pigeon'

export const DELIVERY = [
  { id: 'speedy',  label: 'Спиди',    badge: null as string | null, requiresOffice: true,  officePlaceholder: 'напр. Спиди офис Сердика, бул. Сливница 2, София',       officeLink: 'https://www.speedy.bg/bg/office-search', availableOnCod: true },
  { id: 'econt',   label: 'Еконт',    badge: null,          requiresOffice: true,  officePlaceholder: 'напр. Еконт Сердика, бул. Сливница 2, София',           officeLink: 'https://www.econt.com/services/offices.html', availableOnCod: true },
  { id: 'boxnow',  label: 'BoxNow',   badge: null,          requiresOffice: true,  officePlaceholder: 'напр. BoxNow Mall of Sofia, бул. Климент Охридски',     officeLink: 'https://boxnow.bg/lockers', availableOnCod: false },
  { id: 'pigeon',  label: 'Pigeon Express', badge: 'ПРЕПОРЪЧАНО', requiresOffice: true,  officePlaceholder: 'напр. Pigeon Express локер НДК, пл. България 1, София', officeLink: 'https://pigeonexpress.com', availableOnCod: true },
] as const

export type DeliveryOption = (typeof DELIVERY)[number]

export function visibleCouriers(isCod: boolean): DeliveryOption[] {
  return isCod ? DELIVERY.filter(d => d.availableOnCod) : [...DELIVERY]
}

export function courierBadge(isCod: boolean, d: DeliveryOption): string | null {
  if (isCod && d.id === COD_PREFERRED_COURIER) return 'ПРЕПОРЪЧАНО'
  if (isCod) return null
  return d.badge
}
