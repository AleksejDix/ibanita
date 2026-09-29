/**
 * Country functions
 * @module country
 */
import { electronicFormat } from './format';
import { ibanSpecs } from './countries/specs';

/**
 * Validate if country code is from a SEPA country
 * ```
 * // returns true
 * ibanita.isSEPACountry("NL");
 * ```
 * ```
 * // returns false
 * ibanita.isSEPACountry("PK");
 * ```
 */
export function isSEPACountry(countryCode?: string | null): boolean {
  return ibanSpecs[electronicFormat(countryCode ?? '')]?.sepa ?? false;
}

export { countrySpecs } from './countries/all';
