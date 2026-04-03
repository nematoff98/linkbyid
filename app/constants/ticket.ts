/** Max size per ticket attachment image (bytes). */
export const TICKET_IMAGE_MAX_BYTES = 1.5 * 1024 * 1024

export function ticketImageSizeWarning(skippedNames: string[]): string {
  if (!skippedNames.length) return ''
  return skippedNames.length === 1
    ? `“${skippedNames[0]}” is larger than 1.5 MB and was not uploaded.`
    : `${skippedNames.length} images are larger than 1.5 MB and were skipped.`
}
