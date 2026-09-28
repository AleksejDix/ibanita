/**
 * Error codes returned by {@link validateIBAN} in {@link ValidateIBANResult.errorCodes}.
 */
export const ValidationErrorsIBAN = {
  /** No IBAN was provided, or it was empty. */
  NoIBANProvided: 0,
  /** The first two characters are not the code of a country that uses IBAN. */
  NoIBANCountry: 1,
  /** The IBAN does not have the length defined for its country. */
  WrongBBANLength: 2,
  /** The BBAN does not match the format defined for its country. */
  WrongBBANFormat: 3,
  /** The check digits (characters 3 and 4) are not two digits. */
  ChecksumNotNumber: 4,
  /** The MOD 97-10 check digits of the IBAN are wrong. */
  WrongIBANChecksum: 5,
  /** The national check digits of the bank, branch or account number are wrong. */
  WrongAccountBankBranchChecksum: 6,
  /** The IBAN is a Swiss or Liechtenstein QR-IBAN, and QR-IBANs were not allowed. */
  QRIBANNotAllowed: 7,
} as const;

/** One of the {@link ValidationErrorsIBAN} error codes. */
export type ValidationErrorsIBAN = (typeof ValidationErrorsIBAN)[keyof typeof ValidationErrorsIBAN];

/** Options for {@link isValidIBAN} and {@link validateIBAN}. */
export interface ValidateIBANOptions {
  /** Whether Swiss and Liechtenstein QR-IBANs count as valid. Defaults to `true`. */
  allowQRIBAN?: boolean;
}

/** Result of {@link validateIBAN}. */
export interface ValidateIBANResult {
  /** Every problem found, as {@link ValidationErrorsIBAN} codes. Empty when the IBAN is valid. */
  errorCodes: ValidationErrorsIBAN[];
  /** Whether the IBAN is valid. */
  valid: boolean;
}

/** Parameters for {@link composeIBAN}. */
export interface ComposeIBANParams {
  /** ISO 3166-1 alpha-2 country code, such as `NL`. */
  countryCode?: string | null;
  /** Domestic account number (BBAN). Spaces and dashes are removed. */
  bban?: string | null;
}

/** Result of {@link extractIBAN}. Only `iban` and `valid` are set when the IBAN is invalid. */
export interface ExtractIBANResult {
  /** The IBAN in electronic format, without spaces or dashes. */
  iban: string;
  /** The domestic account number (BBAN): everything after the first four characters. */
  bban?: string;
  /** ISO 3166-1 alpha-2 country code. */
  countryCode?: string;
  /** Account number, for countries whose account position is known. */
  accountNumber?: string;
  /** Branch identifier, for countries that define one. */
  branchIdentifier?: string;
  /** Bank identifier, for countries that define one. */
  bankIdentifier?: string;
  /** Whether the IBAN is valid. */
  valid: boolean;
}

/**
 * Error codes returned by {@link validateBIC} in {@link ValidateBICResult.errorCodes}.
 */
export const ValidationErrorsBIC = {
  /** No BIC was provided, or it was empty. */
  NoBICProvided: 0,
  /** Characters 5 and 6 are not a known country code. */
  NoBICCountry: 1,
  /** The BIC does not have the format of an 8 or 11 character BIC. */
  WrongBICFormat: 2,
} as const;

/** One of the {@link ValidationErrorsBIC} error codes. */
export type ValidationErrorsBIC = (typeof ValidationErrorsBIC)[keyof typeof ValidationErrorsBIC];

/** Result of {@link validateBIC}. */
export interface ValidateBICResult {
  /** Every problem found, as {@link ValidationErrorsBIC} codes. Empty when the BIC is valid. */
  errorCodes: ValidationErrorsBIC[];
  /** Whether the BIC is valid. */
  valid: boolean;
}

/** Result of {@link extractBIC}. Only `valid` is set when the BIC is invalid. */
export interface ExtractBICResult {
  /** Bank code: characters 1 to 4. */
  bankCode?: string;
  /** ISO 3166-1 alpha-2 country code: characters 5 and 6. */
  countryCode?: string;
  /** Location code: characters 7 and 8. */
  locationCode?: string;
  /** Branch code: characters 9 to 11, or `null` for an 8 character BIC. */
  branchCode?: string | null;
  /** Whether this is a test BIC, meaning the second character of the location code is `0`. */
  testBIC?: boolean;
  /** Whether the BIC is valid. */
  valid: boolean;
}

/** Public specification of one country, as returned by {@link getCountrySpecifications}. */
export interface CountrySpec {
  /** IBAN length, or `null` if the country does not use IBAN. */
  chars: number | null;
  /** Regular expression for the BBAN, or `null` if the country does not use IBAN. */
  bban_regexp: string | null;
  /** Whether the country is listed in the SWIFT IBAN Registry. */
  IBANRegistry: boolean;
  /** Whether the country takes part in SEPA. */
  SEPA: boolean;
}

/** Country specifications by ISO 3166-1 alpha-2 country code. */
export type CountryMap = Record<string, CountrySpec>;

/** Full specification of one country, as stored in {@link countrySpecs}. */
export interface CountrySpecInternal {
  /** IBAN length. Unset for countries that do not use IBAN. */
  chars?: number;
  /** Regular expression for the BBAN. Unset for countries that do not use IBAN. */
  bban_regexp?: string;
  /** Extra national checksum validation for the BBAN. See {@link setCountryBBANValidation}. */
  bban_validation_func?: (bban: string) => boolean;
  /** Whether the country is listed in the SWIFT IBAN Registry. */
  IBANRegistry?: boolean;
  /** Whether the country takes part in SEPA. */
  SEPA?: boolean;
  /** Position of the branch identifier within the BBAN, as `start-end` (0-based, inclusive). */
  branch_indentifier?: string;
  /** Position of the bank identifier within the BBAN, as `start-end` (0-based, inclusive). */
  bank_identifier?: string;
  /** Position of the account number within the IBAN, as `start-end` (0-based, inclusive). */
  account_indentifier?: string;
}

/** Full country specifications by ISO 3166-1 alpha-2 country code. */
export type CountryMapInternal = Record<string, CountrySpecInternal>;
