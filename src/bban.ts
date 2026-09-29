/**
 * BBAN validation functions
 * @module bban
 */

import { type BBANValidationOptions, type ValidateBBANResult, ValidationErrorsBBAN } from './core/types';
import { bbanErrors } from './core/bban';
import { electronicFormat } from './format';
import { ibanSpecs } from './countries/specs';

/**
 * validateBBAN
 *
 * Whitespace, dashes and periods are removed and letters are uppercased before validation.
 * ```
 * // returns {errorCodes: [], valid: true}
 * ibanita.validateBBAN("ABNA0417164300", "NL");
 * ```
 * ```
 * // returns {errorCodes: ['WRONG_BBAN_FORMAT'], valid: false}
 * ibanita.validateBBAN("A7NA0417164300", "NL");
 * ```
 */
export function validateBBAN(
  bban?: string | null,
  countryCode?: string | null,
  options: Readonly<BBANValidationOptions> = {},
): ValidateBBANResult {
  const electronicBban = electronicFormat(bban ?? '');
  const code = electronicFormat(countryCode ?? '');
  if (electronicBban === '' || code === '') {
    return { errorCodes: [ValidationErrorsBBAN.NoBBANProvided], valid: false };
  }
  const spec = ibanSpecs[code];
  if (spec === undefined) {
    return { errorCodes: [ValidationErrorsBBAN.NoIBANCountry], valid: false };
  }
  const errorCodes = bbanErrors(spec, code, electronicBban, options);
  return { errorCodes, valid: errorCodes.length === 0 };
}

/**
 * Validate BBAN
 *
 * ```
 * // returns true
 * ibanita.isValidBBAN("ABNA0417164300", "NL");
 * ```
 * ```
 * // returns false
 * ibanita.isValidBBAN("A7NA0517164300", "NL");
 * ```
 */
export function isValidBBAN(
  bban?: string | null,
  countryCode?: string | null,
  options: Readonly<BBANValidationOptions> = {},
): boolean {
  return validateBBAN(bban, countryCode, options).valid;
}
