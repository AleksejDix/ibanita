/**
 * BIC/SWIFT validation and extraction functions
 * @module bic
 */
import { type ExtractBICResult, type ValidateBICResult, ValidationErrorsBIC } from './core/types';
import { COUNTRY_CODES } from './countries/codes';

const BIC_REGEX = /^[a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?$/u;

/**
 * Validate BIC/SWIFT
 *
 * ```
 * // returns true
 * ibanita.isValidBIC("ABNANL2A");
 *
 * // returns true
 * ibanita.isValidBIC("NEDSZAJJXXX");
 *
 * // returns false
 * ibanita.isValidBIC("ABN4NL2A");
 *
 * // returns false
 * ibanita.isValidBIC("ABNA NL 2A");
 * ```
 */
export function isValidBIC(bic: string | null | undefined): boolean {
  return validateBIC(bic).valid;
}

/**
 * BIC validation errors
 */
/**
 * validateBIC
 * ```
 * // returns {errorCodes: [], valid: true}
 * ibanita.validateBIC("NEDSZAJJXXX");
 * ```
 */
export function validateBIC(bic?: string | null): ValidateBICResult {
  const errorCodes: ValidationErrorsBIC[] = [];
  if (bic === undefined || bic === null || bic === '') {
    errorCodes.push(ValidationErrorsBIC.NoBICProvided);
  } else if (!BIC_REGEX.test(bic)) {
    errorCodes.push(ValidationErrorsBIC.WrongBICFormat);
  } else if (!COUNTRY_CODES.has(bic.toUpperCase().slice(4, 6))) {
    errorCodes.push(ValidationErrorsBIC.NoBICCountry);
  }
  return { errorCodes, valid: errorCodes.length === 0 };
}

/**
 * extractBIC
 * ```
 * // returns {bankCode: "ABNA", countryCode: "NL", locationCode: "2A", branchCode: null, testBIC: false, valid: true}
 * ibanita.extractBIC("ABNANL2A");
 * ```
 */
export function extractBIC(inputBic?: string | null): ExtractBICResult {
  const bic = (inputBic ?? '').toUpperCase();
  if (!isValidBIC(bic)) {
    return { valid: false };
  }
  const locationCode = bic.slice(6, 8);
  return {
    bankCode: bic.slice(0, 4),
    countryCode: bic.slice(4, 6),
    locationCode,
    testBIC: locationCode[1] === '0',
    branchCode: bic.length > 8 ? bic.slice(8) : null,
    valid: true,
  };
}
