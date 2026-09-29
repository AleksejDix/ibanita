/**
 * BIC/SWIFT validation and extraction functions
 * @module bic
 */
import { type BICExtractionResult, BICValidationError, type BICValidationResult } from './core/types';
import { COUNTRY_CODES } from './countries/codes';
import { electronicFormat } from './format';

const BIC_REGEX = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/u;

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
 * // returns true, spaces are removed first
 * ibanita.isValidBIC("ABNA NL 2A");
 * ```
 */
export function isValidBIC(bic: string | null | undefined): boolean {
  return validateBIC(bic).valid;
}

/**
 * validateBIC
 * ```
 * // returns {errorCodes: [], valid: true}
 * ibanita.validateBIC("NEDSZAJJXXX");
 * ```
 */
export function validateBIC(input?: string | null): BICValidationResult {
  const errorCodes: BICValidationError[] = [];
  const bic = electronicFormat(input ?? '');
  if (bic === '') {
    errorCodes.push(BICValidationError.NoBICProvided);
  } else if (!BIC_REGEX.test(bic)) {
    errorCodes.push(BICValidationError.WrongBICFormat);
  } else if (!COUNTRY_CODES.has(bic.slice(4, 6))) {
    errorCodes.push(BICValidationError.NoBICCountry);
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
export function extractBIC(inputBic?: string | null): BICExtractionResult {
  const bic = electronicFormat(inputBic ?? '');
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
