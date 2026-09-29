/**
 * BBAN validation functions
 * @module bban
 */

import { type BBANValidationOptions, type BBANValidationResult } from './core/types';
import { ibanSpecs } from './countries/specs';
import { validateBBANWith } from './core/bban';

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
): BBANValidationResult {
  return validateBBANWith(ibanSpecs, bban, countryCode, options);
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
  return validateBBANWith(ibanSpecs, bban, countryCode, options).valid;
}
