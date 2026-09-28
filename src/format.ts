/**
 * Get IBAN in electronic format (no spaces)
 * IBAN validation is not performed.
 * When non-string value for IBAN is provided, returns null.
 * ```
 * // returns "NL91ABNA0417164300"
 * electronicFormatIBAN("NL91 ABNA 0417 1643 00");
 * ```
 */
export function electronicFormatIBAN(iban?: string | null): string | null {
  if (typeof iban !== 'string') {
    return null;
  }
  return iban.replace(/[- ]/gu, '').toUpperCase();
}

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
  const electronicIban = electronicFormatIBAN(iban);
  if (electronicIban === null) {
    return null;
  }
  return electronicIban.replace(/(.{4})(?!$)/gu, (group) => `${group}${separator}`);
}
