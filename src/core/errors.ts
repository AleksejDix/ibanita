// Error codes as `as const` objects. The matching union types are derived here and re-exported from types.ts.

/**
 * Error codes returned by {@link validateBBAN} in {@link BBANValidationResult.errorCodes}.
 * {@link validateIBAN} reports the same codes for the BBAN part of an IBAN.
 */
export const BBANValidationError = {
  /** No BBAN or no country code was provided, or the BBAN was empty. */
  NoBBANProvided: 'NO_BBAN_PROVIDED',
  /** The country code is not the code of a country that uses IBAN. */
  NoIBANCountry: 'NO_IBAN_COUNTRY',
  /** The BBAN does not have the length defined for its country. */
  WrongBBANLength: 'WRONG_BBAN_LENGTH',
  /** The BBAN does not match the format defined for its country. */
  WrongBBANFormat: 'WRONG_BBAN_FORMAT',
  /** The national check digits of the bank, branch or account number are wrong. */
  WrongBBANChecksum: 'WRONG_BBAN_CHECKSUM',
} as const;

/** One of the {@link BBANValidationError} error codes. */
export type BBANValidationError = (typeof BBANValidationError)[keyof typeof BBANValidationError];

/**
 * Error codes returned by {@link validateIBAN} in {@link IBANValidationResult.errorCodes}.
 * The BBAN codes come from {@link BBANValidationError}.
 */
export const IBANValidationError = {
  /** No IBAN was provided, or it was empty. */
  NoIBANProvided: 'NO_IBAN_PROVIDED',
  /** The first two characters are not the code of a country that uses IBAN. */
  NoIBANCountry: 'NO_IBAN_COUNTRY',
  /** The BBAN, and so the IBAN, does not have the length defined for its country. */
  WrongBBANLength: 'WRONG_BBAN_LENGTH',
  /** The BBAN does not match the format defined for its country. */
  WrongBBANFormat: 'WRONG_BBAN_FORMAT',
  /** The national check digits of the bank, branch or account number are wrong. */
  WrongBBANChecksum: 'WRONG_BBAN_CHECKSUM',
  /** The check digits (characters 3 and 4) are not two digits. */
  CheckDigitsNotNumeric: 'CHECK_DIGITS_NOT_NUMERIC',
  /** The MOD 97-10 check digits of the IBAN are wrong. */
  WrongIBANChecksum: 'WRONG_IBAN_CHECKSUM',
  /** The IBAN is a Swiss or Liechtenstein QR-IBAN, and QR-IBANs were not allowed. */
  QRIBANNotAllowed: 'QR_IBAN_NOT_ALLOWED',
} as const;

/** One of the {@link IBANValidationError} error codes. */
export type IBANValidationError = (typeof IBANValidationError)[keyof typeof IBANValidationError];

/**
 * Error codes returned by {@link validateBIC} in {@link BICValidationResult.errorCodes}.
 */
export const BICValidationError = {
  /** No BIC was provided, or it was empty. */
  NoBICProvided: 'NO_BIC_PROVIDED',
  /** Characters 5 and 6 are not a known country code. */
  NoBICCountry: 'NO_BIC_COUNTRY',
  /** The BIC does not have the format of an 8 or 11 character BIC. */
  WrongBICFormat: 'WRONG_BIC_FORMAT',
} as const;

/** One of the {@link BICValidationError} error codes. */
export type BICValidationError = (typeof BICValidationError)[keyof typeof BICValidationError];
