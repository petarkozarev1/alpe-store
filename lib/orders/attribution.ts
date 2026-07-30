export const P2G_COOKIE_NAME = 'alpe_p2g_source'
export const P2G_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export function isConfiguredP2GSource(
  sourceId: string | null | undefined,
  configuredId: string | null | undefined
): boolean {
  return Boolean(sourceId && configuredId && sourceId === configuredId)
}

export function getP2GAttribution(
  cookieValue: string | null | undefined,
  configuredId: string | null | undefined
): string | null {
  return isConfiguredP2GSource(cookieValue, configuredId)
    ? configuredId!
    : null
}
