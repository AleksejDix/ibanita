import { type CountryMap } from '../core/types';
import { countrySpecs } from './all';
import { ibanSpecs } from './specs';

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
  if (countryCode !== undefined && countryCode !== null) {
    return ibanSpecs[countryCode]?.sepa ?? false;
  }
  return false;
}

/**
 * Returns specifications for all countries, even those who are not
 * members of IBAN registry. `ibanRegistry` field indicates if country
 * is member of not. Countries without IBAN have an empty specification.
 *
 * ```
 * // Get country specifications
 * const specs = ibanita.getCountrySpecifications();
 * const nlSpec = specs['NL'];
 * console.log(nlSpec.ibanLength); // 18
 * console.log(nlSpec.bbanPattern); // '^[A-Z]{4}[0-9]{10}$'
 * console.log(nlSpec.sepa); // true
 * ```
 */
export function getCountrySpecifications(): CountryMap {
  return countrySpecs;
}
