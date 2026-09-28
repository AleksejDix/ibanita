import { type CountryMap, type CountrySpec } from '../core/types';
import { COUNTRY_CODES } from './codes';
import { ibanSpecs } from './specs';

const NO_IBAN: CountrySpec = Object.freeze({});

/**
 * Country specifications for all countries. Countries without IBAN have an empty specification.
 * Kept in its own module so bundlers can drop it, and the country code list, when only IBAN functions are used.
 */
export const countrySpecs: CountryMap = Object.freeze(
  Object.fromEntries([...COUNTRY_CODES].map((code) => [code, ibanSpecs[code] ?? NO_IBAN])),
);
