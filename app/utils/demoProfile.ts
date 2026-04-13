/** Public demo profile used in ads / trials — visitors get extra CTAs on `/u/{username}`. */
export const LINKBYCODE_DEMO_USERNAME = 'linkbycode' as const

export function isLinkbycodeDemoProfile(username: string): boolean {
  return username.trim().toLowerCase() === LINKBYCODE_DEMO_USERNAME
}
