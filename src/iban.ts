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
 * Spaces and dashes are removed and letters are uppercased before validation.
 * ```
 * // returns true
 * ibanita.isValidIBAN("NL91ABNA0417164300");
 * ```
 * ```
 * // returns false
 * ibanita.isValidIBAN("NL92ABNA0517164300");
 * ```
 * ```
 * // returns true
 * ibanita.isValidIBAN('CH4431999123000889012');
 * ```
 * ```
 * // returns false
 * ibanita.isValidIBAN('CH4431999123000889012', { allowQRIBAN: false });
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
 * Spaces and dashes are removed and letters are uppercased before validation.
 * ```
 * // returns {errorCodes: [], valid: true}
 * ibanita.validateIBAN("NL91ABNA0417164300");
 * ```
 * ```
 * ```
 * // returns {errorCodes: [], valid: true}
 * ibanita.validateIBAN('CH4431999123000889012');
 * ```
 * ```
 * // returns {errorCodes: ['QR_IBAN_NOT_ALLOWED'], valid: false}
 * ibanita.validateIBAN('CH4431999123000889012', { allowQRIBAN: false });
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
 * // returns NL91ABNA0417164300
 * ibanita.composeIBAN("NL", "ABNA0417164300");
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
 * // returns {iban: "NL91ABNA0417164300", bban: "ABNA0417164300", countryCode: "NL", valid: true, accountNumber: '0417164300', bankIdentifier: 'ABNA'}
 * ibanita.extractIBAN("NL91 ABNA 0417 1643 00");
 * ```
 */
export function extractIBAN(input?: string | null): IBANExtractionResult {
  return extractIBANWith(ibanSpecs, input);
}
