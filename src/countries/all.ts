import { COUNTRY_CODES } from './codes';
import { type CountryMap } from '../core/types';
import { ibanSpecs } from './specs';

/**
 * Country specifications for all countries. Countries without IBAN have an empty specification.
 * Kept in its own module so bundlers can drop it, and the country code list, when only IBAN functions are used.
 */
export const countrySpecs: CountryMap = Object.fromEntries(
  [...COUNTRY_CODES].map((code) => [code, ibanSpecs[code] ?? {}]),
);
