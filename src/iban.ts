/**
 * IBAN validation, extraction, and creation functions
 * @module iban
 */
import {
  type BBANValidationOptions,
  type IBANExtractionResult,
  type IBANValidationOptions,
  type IBANValidationResult,
} from './core/types';
import { composeIBANWith, extractIBANWith, isQRIBAN, validateIBANWith } from './core/iban';
import { ibanSpecs } from './countries/specs';

export { isQRIBAN };

/**
 * Validate IBAN
 *
 * Whitespace, dashes and periods are removed and letters are uppercased before validation.
 * ```
 * // returns true
 * ibanita.isValidIBAN("NL06KNNF4736942347");
 * ```
 * // returns false
 * ibanita.isValidIBAN("NL92ABNA0517164300");
 * ```
 * // returns true
 * ibanita.isValidIBAN('CH283109120L9PSR9BKOK');
 * ```
 * // returns false
 * ibanita.isValidIBAN('CH283109120L9PSR9BKOK', { allowQRIBAN: false });
 * ```
 */
export function isValidIBAN(
  input: string | null | undefined,
  validationOptions: Readonly<IBANValidationOptions> = {},
): boolean {
  return validateIBANWith(ibanSpecs, input, validationOptions).valid;
}

/**
 * validateIBAN
 *
 * Whitespace, dashes and periods are removed and letters are uppercased before validation.
 * ```
 * // returns {errorCodes: [], valid: true}
 * ibanita.validateIBAN("NL06KNNF4736942347");
 * ```
 * ```
 * // returns {errorCodes: [], valid: true}
 * ibanita.validateIBAN('CH283109120L9PSR9BKOK');
 * ```
 * // returns {errorCodes: ['QR_IBAN_NOT_ALLOWED'], valid: false}
 * ibanita.validateIBAN('CH283109120L9PSR9BKOK', { allowQRIBAN: false });
 * ```
 */
export function validateIBAN(
  input?: string | null,
  validationOptions: Readonly<IBANValidationOptions> = {},
): IBANValidationResult {
  return validateIBANWith(ibanSpecs, input, validationOptions);
}

/**
 * composeIBAN
 *
 * ```
 * // returns 'NL06KNNF4736942347'
 * ibanita.composeIBAN("NL", "KNNF4736942347");
 * ```
 */
export function composeIBAN(
  countryCode: string | null | undefined,
  bban: string | null | undefined,
  options: Readonly<BBANValidationOptions> = {},
): string | null {
  return composeIBANWith(ibanSpecs, countryCode, bban, options);
}

/**
 * extractIBAN
 * ```
 * // returns { valid: true, iban: 'NL06KNNF4736942347', countryCode: 'NL', bban: 'KNNF4736942347', accountNumber: '4736942347', bankIdentifier: 'KNNF' }
 * ibanita.extractIBAN("NL06 KNNF 4736 9423 47");
 * ```
 */
export function extractIBAN(input?: string | null): IBANExtractionResult {
  return extractIBANWith(ibanSpecs, input);
}
