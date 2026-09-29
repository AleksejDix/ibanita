import { type BBANValidationOptions, type IBANCountrySpec, ValidationErrorsBBAN } from './types';

/** The BBAN codes that describe the content of a BBAN, as opposed to missing input or an unknown country. */
export type BBANContentError = (typeof ValidationErrorsBBAN)[
  | 'WrongBBANLength'
  | 'WrongBBANFormat'
  | 'WrongBBANChecksum'];

/**
 * The length, format and national checksum problems of a BBAN in electronic format,
 * checked against its country's specification. Shared by {@link validateBBAN} and {@link validateIBAN}.
 */
export function bbanErrors(
  spec: IBANCountrySpec,
  countryCode: string,
  bban: string,
  options: Readonly<BBANValidationOptions>,
): BBANContentError[] {
  const errorCodes: BBANContentError[] = [];
  if (spec.ibanLength - 4 !== bban.length) {
    errorCodes.push(ValidationErrorsBBAN.WrongBBANLength);
  }
  if (!spec.bbanRegExp.test(bban)) {
    errorCodes.push(ValidationErrorsBBAN.WrongBBANFormat);
  }
  // The national checksum is only meaningful when length and format are right.
  const validator = options.bbanValidators?.[countryCode] ?? spec.bbanValidator;
  if (errorCodes.length === 0 && validator !== undefined && !validator(bban)) {
    errorCodes.push(ValidationErrorsBBAN.WrongBBANChecksum);
  }
  return errorCodes;
}
