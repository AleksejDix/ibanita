import { electronicFormat } from './core/format';

export { electronicFormat };

/**
 * Get IBAN in friendly format (separated after every 4 characters)
 * IBAN validation is not performed.
 * When non-string value for IBAN is provided, returns null.
 * ```
 * // returns "NL91 ABNA 0417 1643 00"
 * friendlyFormatIBAN("NL91ABNA0417164300");
 * ```
 * ```
 * // returns "NL91-ABNA-0417-1643-00"
 * friendlyFormatIBAN("NL91ABNA0417164300","-");
 * ```
 */
export function friendlyFormatIBAN(iban?: string | null, separator = ' '): string | null {
  if (iban === undefined || iban === null) {
    return null;
  }
  return electronicFormat(iban).replace(/(.{4})(?!$)/gu, (group) => `${group}${separator}`);
}
