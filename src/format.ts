import { electronicFormat } from './core/format';

export { electronicFormat };

/**
 * Get IBAN in friendly format (separated after every 4 characters)
 * IBAN validation is not performed.
 * When non-string value for IBAN is provided, returns null.
 * ```
 * // returns "NL06 KNNF 4736 9423 47"
 * ibanita.friendlyFormatIBAN("NL06KNNF4736942347");
 * ```
 * // returns "NL06-KNNF-4736-9423-47"
 * ibanita.friendlyFormatIBAN("NL06KNNF4736942347","-");
 * ```
 */
export function friendlyFormatIBAN(iban?: string | null, separator = ' '): string | null {
  if (iban === undefined || iban === null) {
    return null;
  }
  return electronicFormat(iban).replace(/(.{4})(?!$)/gu, (group) => `${group}${separator}`);
}
