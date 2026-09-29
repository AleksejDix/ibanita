import {
  type BBANValidationOptions,
  type BBANValidationResult,
  type BBANValidator,
  type IBANCountrySpec,
  type IBANCountrySpecs,
} from './types';
import { BBANValidationError } from './errors';
import { electronicFormat } from './format';

/** The BBAN codes that describe the content of a BBAN, as opposed to missing input or an unknown country. */
export type BBANContentError = (typeof BBANValidationError)[
  | 'WrongBBANLength'
  | 'WrongBBANFormat'
  | 'WrongBBANChecksum'];

/** The national validator for a country: the one passed in the options, or the built-in one. */
export function bbanValidatorFor(
  spec: IBANCountrySpec,
  countryCode: string,
  options: Readonly<BBANValidationOptions>,
): BBANValidator | undefined {
  return options.bbanValidators?.[countryCode] ?? spec.bbanValidator;
}

/**
 * The length, format and national checksum problems of a BBAN in electronic format,
 * checked against its country's specification. Shared by `validateBBAN` and `validateIBAN`.
 */
export function bbanErrors(
  spec: IBANCountrySpec,
  bban: string,
  validator: BBANValidator | undefined,
): BBANContentError[] {
  const errorCodes: BBANContentError[] = [];
  if (spec.ibanLength - 4 !== bban.length) {
    errorCodes.push(BBANValidationError.WrongBBANLength);
  }
  if (!spec.bbanRegExp.test(bban)) {
    errorCodes.push(BBANValidationError.WrongBBANFormat);
  }
  // The national checksum is only meaningful when length and format are right.
  if (errorCodes.length === 0 && validator !== undefined && !validator(bban)) {
    errorCodes.push(BBANValidationError.WrongBBANChecksum);
  }
  return errorCodes;
}

/** `validateBBAN` against the given country specifications. */
export function validateBBANWith(
  specs: IBANCountrySpecs,
  bban: string | null | undefined,
  countryCode: string | null | undefined,
  options: Readonly<BBANValidationOptions> = {},
): BBANValidationResult {
  const electronicBban = electronicFormat(bban ?? '');
  const code = electronicFormat(countryCode ?? '');
  if (electronicBban === '' || code === '') {
    return { errorCodes: [BBANValidationError.NoBBANProvided], valid: false };
  }
  const spec = specs[code];
  if (spec === undefined) {
    return { errorCodes: [BBANValidationError.NoIBANCountry], valid: false };
  }
  const errorCodes = bbanErrors(spec, electronicBban, bbanValidatorFor(spec, code, options));
  return { errorCodes, valid: errorCodes.length === 0 };
}
