import {
  type BBANValidationOptions,
  type CountrySpec,
  type IBANCountrySpecs,
  type IBANExtractionResult,
  type IBANValidationOptions,
  type IBANValidationResult,
  type IdentifierPosition,
} from './types';
import { bbanErrors, bbanValidatorFor, validateBBANWith } from './bban';
import { IBANValidationError } from './errors';
import { electronicFormat } from './format';
import { ibanCheckDigits } from './checksum';

const CHECK_DIGITS_REGEX = /^[0-9]{2}$/u;
const QRIBAN_REGEX = /^3[0-1][0-9]{3}$/u;
/** QR-IBANs exist in Switzerland and Liechtenstein. Their bank clearing number (IID) is in the range 30000 to 31999. */
const QRIBAN_COUNTRIES: ReadonlySet<string> = new Set(['CH', 'LI']);

function slicePosition(value: string, [start, end]: IdentifierPosition): string {
  return value.slice(start, end + 1);
}

/**
 * Check if IBAN is a Swiss or Liechtenstein QR-IBAN, meaning its bank clearing number is between 30000 and 31999.
 * Needs no country data.
 */
export function isQRIBAN(input?: string | null): boolean {
  const iban = electronicFormat(input);
  if (!QRIBAN_COUNTRIES.has(iban.slice(0, 2))) {
    return false;
  }
  return QRIBAN_REGEX.test(iban.slice(4, 9));
}

/** `validateIBAN` against the given country specifications. */
export function validateIBANWith(
  specs: IBANCountrySpecs,
  input?: string | null,
  validationOptions: Readonly<IBANValidationOptions> = {},
): IBANValidationResult {
  const iban = electronicFormat(input);
  if (iban === '') {
    return { errorCodes: [IBANValidationError.NoIBANProvided], valid: false };
  }
  const countryCode = iban.slice(0, 2);
  const checkDigits = iban.slice(2, 4);
  const bban = iban.slice(4);
  const spec = specs[countryCode];
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

/** `composeIBAN` against the given country specifications. */
export function composeIBANWith(
  specs: IBANCountrySpecs,
  countryCode: string | null | undefined,
  bban: string | null | undefined,
  options: Readonly<BBANValidationOptions> = {},
): string | null {
  const code = electronicFormat(countryCode);
  const electronicBban = electronicFormat(bban);
  if (!validateBBANWith(specs, electronicBban, code, options).valid) {
    return null;
  }
  return `${code}${ibanCheckDigits(code, electronicBban)}${electronicBban}`;
}

/** `extractIBAN` against the given country specifications. */
export function extractIBANWith(specs: IBANCountrySpecs, input?: string | null): IBANExtractionResult {
  const iban = electronicFormat(input);
  if (!validateIBANWith(specs, iban).valid) {
    return { valid: false, iban };
  }
  const countryCode = iban.slice(0, 2);
  const bban = iban.slice(4);
  const spec: CountrySpec = specs[countryCode] ?? {};
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

/** `isSEPACountry` against the given country specifications. */
export function isSEPACountryWith(specs: IBANCountrySpecs, countryCode?: string | null): boolean {
  return specs[electronicFormat(countryCode)]?.sepa ?? false;
}
