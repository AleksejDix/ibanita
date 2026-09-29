/**
 * IBAN validation, extraction, and creation functions
 * @module iban
 */
import {
  type BBANValidationOptions,
  type CountrySpec,
  type IBANExtractionResult,
  IBANValidationError,
  type IBANValidationOptions,
  type IBANValidationResult,
  type IdentifierPosition,
} from './core/types';
import { bbanErrors, bbanValidatorFor } from './core/bban';
import { electronicFormatIBAN } from './format';
import { ibanCheckDigits } from './core/checksum';
import { ibanSpecs } from './countries/specs';
import { isValidBBAN } from './bban';

const CHECK_DIGITS_REGEX = /^[0-9]{2}$/u;
const QRIBAN_REGEX = /^3[0-1][0-9]{3}$/u;
/** QR-IBANs exist in Switzerland and Liechtenstein. Their bank clearing number (IID) is in the range 30000 to 31999. */
const QRIBAN_COUNTRIES: ReadonlySet<string> = new Set(['CH', 'LI']);

function slicePosition(value: string, [start, end]: IdentifierPosition): string {
  return value.slice(start, end + 1);
}

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
  return validateIBAN(input, validationOptions).valid;
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
  const iban = electronicFormatIBAN(input) ?? '';
  if (iban === '') {
    return { errorCodes: [IBANValidationError.NoIBANProvided], valid: false };
  }
  const countryCode = iban.slice(0, 2);
  const checkDigits = iban.slice(2, 4);
  const bban = iban.slice(4);
  const spec = ibanSpecs[countryCode];
  if (spec === undefined) {
    return { errorCodes: [IBANValidationError.NoIBANCountry], valid: false };
  }

  const validator = bbanValidatorFor(spec, countryCode, validationOptions);
  const errorCodes: IBANValidationError[] = bbanErrors(spec, bban, validator);
  if (!CHECK_DIGITS_REGEX.test(checkDigits)) {
    errorCodes.push(IBANValidationError.CheckDigitsNotNumeric);
  }
  // A malformed BBAN makes the MOD 97-10 result meaningless, so the checksum counts as wrong too.
  if (errorCodes.includes(IBANValidationError.WrongBBANFormat) || checkDigits !== ibanCheckDigits(countryCode, bban)) {
    errorCodes.push(IBANValidationError.WrongIBANChecksum);
  }
  if (validationOptions.allowQRIBAN === false && isQRIBAN(iban)) {
    errorCodes.push(IBANValidationError.QRIBANNotAllowed);
  }
  return { errorCodes, valid: errorCodes.length === 0 };
}

/**
 * Check if IBAN is QR-IBAN
 * ```
 * // returns true
 * ibanita.isQRIBAN("CH4431999123000889012");
 * ```
 * ```
 * // returns false
 * ibanita.isQRIBAN("NL92ABNA0517164300");
 * ```
 */
export function isQRIBAN(input?: string | null): boolean {
  const iban = electronicFormatIBAN(input);
  if (iban === null || !QRIBAN_COUNTRIES.has(iban.slice(0, 2))) {
    return false;
  }
  return QRIBAN_REGEX.test(iban.slice(4, 9));
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
  const electronicBban = electronicFormatIBAN(bban) ?? '';
  if (countryCode === undefined || countryCode === null || !isValidBBAN(electronicBban, countryCode, options)) {
    return null;
  }
  return `${countryCode}${ibanCheckDigits(countryCode, electronicBban)}${electronicBban}`;
}

/**
 * extractIBAN
 * ```
 * // returns {iban: "NL91ABNA0417164300", bban: "ABNA0417164300", countryCode: "NL", valid: true, accountNumber: '0417164300', bankIdentifier: 'ABNA'}
 * ibanita.extractIBAN("NL91 ABNA 0417 1643 00");
 * ```
 */
export function extractIBAN(input?: string | null): IBANExtractionResult {
  const iban = electronicFormatIBAN(input) ?? '';
  if (!isValidIBAN(iban)) {
    return { valid: false, iban };
  }
  const countryCode = iban.slice(0, 2);
  const bban = iban.slice(4);
  const spec: CountrySpec = ibanSpecs[countryCode] ?? {};
  return {
    valid: true,
    iban,
    countryCode,
    bban,
    ...(spec.accountPosition ? { accountNumber: slicePosition(iban, spec.accountPosition) } : {}),
    ...(spec.bankPosition ? { bankIdentifier: slicePosition(bban, spec.bankPosition) } : {}),
    ...(spec.branchPosition ? { branchIdentifier: slicePosition(bban, spec.branchPosition) } : {}),
  };
}
