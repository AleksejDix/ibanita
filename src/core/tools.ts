import {
  type BBANValidationOptions,
  type BBANValidationResult,
  type IBANCountrySpecs,
  type IBANExtractionResult,
  type IBANValidationOptions,
  type IBANValidationResult,
} from './types';
import { composeIBANWith, extractIBANWith, isSEPACountryWith, validateIBANWith } from './iban';
import { validateBBANWith } from './bban';

/** The IBAN, BBAN and country functions bound to one set of country specifications. */
export interface IBANTools {
  /** Same as `isValidIBAN` in the default entry. */
  isValidIBAN(input?: string | null, options?: Readonly<IBANValidationOptions>): boolean;
  /** Same as `validateIBAN` in the default entry. */
  validateIBAN(input?: string | null, options?: Readonly<IBANValidationOptions>): IBANValidationResult;
  /** Same as `extractIBAN` in the default entry. */
  extractIBAN(input?: string | null): IBANExtractionResult;
  /** Same as `composeIBAN` in the default entry. */
  composeIBAN(
    countryCode?: string | null,
    bban?: string | null,
    options?: Readonly<BBANValidationOptions>,
  ): string | null;
  /** Same as `isValidBBAN` in the default entry. */
  isValidBBAN(bban?: string | null, countryCode?: string | null, options?: Readonly<BBANValidationOptions>): boolean;
  /** Same as `validateBBAN` in the default entry. */
  validateBBAN(
    bban?: string | null,
    countryCode?: string | null,
    options?: Readonly<BBANValidationOptions>,
  ): BBANValidationResult;
  /** Same as `isSEPACountry` in the default entry. */
  isSEPACountry(countryCode?: string | null): boolean;
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
