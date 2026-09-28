/**
 * IBAN validation, extraction, and creation functions
 * @module iban
 */
import {
  type ComposeIBANParams,
  type ExtractIBANResult,
  type ValidateIBANOptions,
  type ValidateIBANResult,
  ValidationErrorsIBAN,
} from './core/types';
import { checkFormatBBAN, isValidIBANChecksum, mod9710Iban } from './core/checksum';
import { MOD_97_REMAINDER } from './core/constants';
import { electronicFormatIBAN } from './format';
import { ibanSpecs } from './countries/specs';
import { isValidBBAN } from './bban';

const CHECKSUM_REGEX = /^[0-9]{2}$/u;
const QRIBAN_REGEX = /^3[0-1][0-9]{3}$/u;

/**
 * Validate IBAN
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
  iban: string | null | undefined,
  validationOptions: Readonly<ValidateIBANOptions> = {},
): boolean {
  if (iban === undefined || iban === null) {
    return false;
  }

  const countryCode = iban.slice(0, 2);
  const spec = ibanSpecs[countryCode];

  if (spec === undefined || spec.bban_regexp === undefined || spec.bban_regexp === null || spec.chars === undefined) {
    return false;
  }

  return (
    spec.chars === iban.length &&
    CHECKSUM_REGEX.test(iban.slice(2, 4)) &&
    isValidBBAN(iban.slice(4), countryCode) &&
    isValidIBANChecksum(iban) &&
    (validationOptions.allowQRIBAN !== false || !isQRIBAN(iban))
  );
}

/**
 * validateIBAN
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
 * // returns {errorCodes: [7], valid: false}
 * ibanita.validateIBAN('CH4431999123000889012', { allowQRIBAN: false });
 * ```
 */
export function validateIBAN(
  iban?: string | null,
  validationOptions: Readonly<ValidateIBANOptions> = {},
): ValidateIBANResult {
  const result: ValidateIBANResult = { errorCodes: [], valid: true };
  if (iban !== undefined && iban !== null && iban !== '') {
    const spec = ibanSpecs[iban.slice(0, 2)];
    if (!spec || !(spec.bban_regexp || spec.chars)) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.NoIBANCountry);
      return result;
    }
    if (spec && spec.chars && spec.chars !== iban.length) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.WrongBBANLength);
    }
    if (spec && spec.bban_regexp && !checkFormatBBAN(iban.slice(4), spec.bban_regexp)) {
      result.valid = false;
      result.errorCodes.push(ValidationErrorsIBAN.WrongBBANFormat);
    }
    if (result.valid && spec.bban_validation_func && !spec.bban_validation_func(iban.slice(4))) {
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
export function composeIBAN(params: Readonly<ComposeIBANParams>): string | null {
  const formated_bban: string = electronicFormatIBAN(params.bban ?? undefined) ?? '';
  if (params.countryCode === null || params.countryCode === undefined) {
    return null;
  }
  const spec = ibanSpecs[params.countryCode];
  if (
    formated_bban !== '' &&
    spec !== undefined &&
    spec.chars &&
    spec.chars !== null &&
    spec.chars === formated_bban.length + 4 &&
    spec.bban_regexp &&
    spec.bban_regexp !== null &&
    checkFormatBBAN(formated_bban, spec.bban_regexp) &&
    (!spec.bban_validation_func || spec.bban_validation_func(formated_bban))
  ) {
    const checksom = mod9710Iban(`${params.countryCode}00${formated_bban}`);
    return `${params.countryCode}${`0${MOD_97_REMAINDER - checksom}`.slice(-2)}${formated_bban}`;
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
    if (spec?.account_indentifier) {
      const [start, end] = spec.account_indentifier.split('-');
      if (start && end) {
        result.accountNumber = result.iban.slice(parseInt(start, 10), parseInt(end, 10) + 1);
      }
    }
    if (spec?.bank_identifier) {
      const [start, end] = spec.bank_identifier.split('-');
      if (start && end) {
        result.bankIdentifier = result.bban.slice(parseInt(start, 10), parseInt(end, 10) + 1);
      }
    }
    if (spec?.branch_indentifier) {
      const [start, end] = spec.branch_indentifier.split('-');
      if (start && end) {
        result.branchIdentifier = result.bban.slice(parseInt(start, 10), parseInt(end, 10) + 1);
      }
    }
  }
  return result;
}
