// Local SVG placeholder images — no network required
const svg = (fill: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23${fill}'/%3E%3C/svg%3E`

export const PH_CREAM    = svg('F5F5F0')
export const PH_WARM     = svg('F0EDE8')
export const PH_TAN      = svg('D4C5B5')
export const PH_MID_TAN  = svg('C8B5A0')
export const PH_GRAY     = svg('888888')
export const PH_LIGHT_GRAY = svg('E8E8E8')
export const PH_AVATAR_1 = svg('CCCCCC')
export const PH_AVATAR_2 = svg('AAAAAA')
export const PH_AVATAR_3 = svg('888888')
