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
  if (!bic) {
    return false;
  }
  return BIC_REGEX.test(bic) && COUNTRY_CODES.has(bic.toUpperCase().slice(4, 6));
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
  const result = { errorCodes: [], valid: true } as ValidateBICResult;
  if (bic !== undefined && bic !== null && bic !== '') {
    if (!BIC_REGEX.test(bic)) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsBIC.WrongBICFormat);
    } else if (!COUNTRY_CODES.has(bic.toUpperCase().slice(4, 6))) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsBIC.NoBICCountry);
    }
  } else {
    result.valid = false;
    result.errorCodes.push(ValidationErrorsBIC.NoBICProvided);
  }
  return result;
}

/**
 * extractBIC
 * ```
 * // returns {bankCode: "ABNA", countryCode: "NL", locationCode: "2A", branchCode: null, testBIC: false, valid: true}
 * ibanita.extractBIC("ABNANL2A");
 * ```
 */
export function extractBIC(inputBic?: string | null): ExtractBICResult {
  const result = {} as ExtractBICResult;
  const bic = (inputBic ?? '').toUpperCase();
  if (isValidBIC(bic)) {
    result.bankCode = bic.slice(0, 4);
    result.countryCode = bic.slice(4, 6);
    result.locationCode = bic.slice(6, 8);
    result.testBIC = result.locationCode[1] === '0';
    result.branchCode = bic.length > 8 ? bic.slice(8) : null;
    result.valid = true;
  } else {
    result.valid = false;
  }
  return result;
}
