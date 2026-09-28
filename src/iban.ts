/**
 * IBAN validation, extraction, and creation functions
 * @module iban
 */
import {
  type BBANValidationOptions,
  type ComposeIBANParams,
  type ExtractIBANResult,
  type IdentifierPosition,
  type ValidateIBANOptions,
  type ValidateIBANResult,
  ValidationErrorsIBAN,
} from './core/types';
import { checkFormatBBAN, isValidIBANChecksum, mod9710Iban } from './core/checksum';
import { MOD_97_REMAINDER } from './core/constants';
import { bbanValidatorFor } from './bban';
import { electronicFormatIBAN } from './format';
import { ibanSpecs } from './countries/specs';

const CHECKSUM_REGEX = /^[0-9]{2}$/u;
const QRIBAN_REGEX = /^3[0-1][0-9]{3}$/u;

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
  validationOptions: Readonly<ValidateIBANOptions> = {},
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
  validationOptions: Readonly<ValidateIBANOptions> = {},
): ValidateIBANResult {
  const result: ValidateIBANResult = { errorCodes: [], valid: true };
  const iban = electronicFormatIBAN(input);
  if (iban !== null && iban !== '') {
    const spec = ibanSpecs[iban.slice(0, 2)];
    if (!spec || !(spec.bbanPattern || spec.ibanLength)) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.NoIBANCountry);
      return result;
    }
    if (spec && spec.ibanLength && spec.ibanLength !== iban.length) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.WrongBBANLength);
    }
    if (spec && spec.bbanPattern && !checkFormatBBAN(iban.slice(4), spec.bbanPattern)) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.WrongBBANFormat);
    }
    const validator = bbanValidatorFor(iban.slice(0, 2), validationOptions);
    if (result.valid && validator && !validator(iban.slice(4))) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.WrongAccountBankBranchChecksum);
    }
    if (!CHECKSUM_REGEX.test(iban.slice(2, 4))) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.ChecksumNotNumber);
    }
    if (result.errorCodes.includes(ValidationErrorsIBAN.WrongBBANFormat) || !isValidIBANChecksum(iban)) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.WrongIBANChecksum);
    }
    if (validationOptions.allowQRIBAN === false && isQRIBAN(iban)) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.QRIBANNotAllowed);
    }
  } else {
    result.valid = false;
    result.errorCodes.push(ValidationErrorsIBAN.NoIBANProvided);
  }
  return result;
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
export function isQRIBAN(iban?: string | null): boolean {
  if (iban === undefined || iban === null) {
    return false;
  }
  const countryCode = iban.slice(0, 2);
  const QRIBANCountries: string[] = ['LI', 'CH'];
  if (!QRIBANCountries.includes(countryCode)) {
    return false;
  }
  return QRIBAN_REGEX.test(iban.slice(4, 9));
}

/**
 * composeIBAN
 *
 * ```
 * // returns NL91ABNA0417164300
 * ibanita.composeIBAN({ countryCode: "NL", bban: "ABNA0417164300" });
 * ```
 */
export function composeIBAN(
  params: Readonly<ComposeIBANParams>,
  options: Readonly<BBANValidationOptions> = {},
): string | null {
  const formattedBban: string = electronicFormatIBAN(params.bban ?? undefined) ?? '';
  if (params.countryCode === null || params.countryCode === undefined) {
    return null;
  }
  const spec = ibanSpecs[params.countryCode];
  if (
    formattedBban !== '' &&
    spec !== undefined &&
    spec.ibanLength &&
    spec.ibanLength !== null &&
    spec.ibanLength === formattedBban.length + 4 &&
    spec.bbanPattern &&
    spec.bbanPattern !== null &&
    checkFormatBBAN(formattedBban, spec.bbanPattern) &&
    (bbanValidatorFor(params.countryCode, options)?.(formattedBban) ?? true)
  ) {
    const checkDigits = mod9710Iban(`${params.countryCode}00${formattedBban}`);
    return `${params.countryCode}${`0${MOD_97_REMAINDER - checkDigits}`.slice(-2)}${formattedBban}`;
  }
  return null;
}

/**
 * extractIBAN
 * ```
 * // returns {iban: "NL91ABNA0417164300", bban: "ABNA0417164300", countryCode: "NL", valid: true, accountNumber: '0417164300', bankIdentifier: 'ABNA'}
 * ibanita.extractIBAN("NL91 ABNA 0417 1643 00");
 * ```
 */
export function extractIBAN(iban?: string | null): ExtractIBANResult {
  const eFormatIBAN: string | null = electronicFormatIBAN(iban);
  const result: ExtractIBANResult = {
    iban: eFormatIBAN ?? '',
    valid: false,
  };
  if (eFormatIBAN !== null && isValidIBAN(eFormatIBAN)) {
    result.bban = eFormatIBAN.slice(4);
    result.countryCode = eFormatIBAN.slice(0, 2);
    result.valid = true;
    const spec = ibanSpecs[result.countryCode];
    if (spec?.accountPosition) {
      result.accountNumber = slicePosition(result.iban, spec.accountPosition);
    }
    if (spec?.bankPosition) {
      result.bankIdentifier = slicePosition(result.bban, spec.bankPosition);
    }
    if (spec?.branchPosition) {
      result.branchIdentifier = slicePosition(result.bban, spec.branchPosition);
    }
  }
  return result;
}
