/**
 * The one input rule of the library: whitespace, dashes and periods are removed and letters are uppercased.
 * Every validation and extraction function applies it to its input first.
 */
export function electronicFormat(value: string): string {
  return value.replace(/[\s.-]/gu, '').toUpperCase();
}
