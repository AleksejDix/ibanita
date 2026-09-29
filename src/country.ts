/**
 * Country functions
 * @module country
 */
import { ibanSpecs } from './countries/specs';
import { isSEPACountryWith } from './core/iban';

/**
 * Validate if country code is from a SEPA country
 * ```
 * // returns true
 * ibanita.isSEPACountry("NL");
 * ```
 * // returns false
 * ibanita.isSEPACountry("PK");
 * ```
 */
export function isSEPACountry(countryCode?: string | null): boolean {
  return isSEPACountryWith(ibanSpecs, countryCode);
}

export { countrySpecs } from './countries/all';
