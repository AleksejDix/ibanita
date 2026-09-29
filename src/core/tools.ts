import type { composeIBAN, extractIBAN, isValidIBAN, validateIBAN } from '../iban';
import type { isValidBBAN, validateBBAN } from '../bban';
import type { isSEPACountry } from '../country';
import { type IBANCountrySpecs } from './types';
import { composeIBANWith, extractIBANWith, isSEPACountryWith, validateIBANWith } from './iban';
import { validateBBANWith } from './bban';

/**
 * The IBAN, BBAN and country functions bound to one set of country specifications.
 * Each member has exactly the type of its counterpart in the default entry, so the two cannot drift.
 */
export interface IBANTools {
  /** Same as `isValidIBAN` in the default entry. */
  readonly isValidIBAN: typeof isValidIBAN;
  /** Same as `validateIBAN` in the default entry. */
  readonly validateIBAN: typeof validateIBAN;
  /** Same as `extractIBAN` in the default entry. */
  readonly extractIBAN: typeof extractIBAN;
  /** Same as `composeIBAN` in the default entry. */
  readonly composeIBAN: typeof composeIBAN;
  /** Same as `isValidBBAN` in the default entry. */
  readonly isValidBBAN: typeof isValidBBAN;
  /** Same as `validateBBAN` in the default entry. */
  readonly validateBBAN: typeof validateBBAN;
  /** Same as `isSEPACountry` in the default entry. */
  readonly isSEPACountry: typeof isSEPACountry;
}

/**
 * Bind the IBAN, BBAN and country functions to a set of country specifications.
 * Import only the countries you need from `@aleksejdix/ibanita/countries/<CC>`; nothing else is bundled.
 *
 * ```
 * import { createIBANTools } from '@aleksejdix/ibanita/core';
 * import { CH } from '@aleksejdix/ibanita/countries/CH';
 *
 * const { isValidIBAN } = createIBANTools({ CH });
 * ```
 */
export function createIBANTools(specs: IBANCountrySpecs): IBANTools {
  return {
    isValidIBAN: (input, options) => validateIBANWith(specs, input, options).valid,
    validateIBAN: (input, options) => validateIBANWith(specs, input, options),
    extractIBAN: (input) => extractIBANWith(specs, input),
    composeIBAN: (countryCode, bban, options) => composeIBANWith(specs, countryCode, bban, options),
    isValidBBAN: (bban, countryCode, options) => validateBBANWith(specs, bban, countryCode, options).valid,
    validateBBAN: (bban, countryCode, options) => validateBBANWith(specs, bban, countryCode, options),
    isSEPACountry: (countryCode) => isSEPACountryWith(specs, countryCode),
  };
}
