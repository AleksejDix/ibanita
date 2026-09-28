/**
 * Error codes returned by {@link validateIBAN} in {@link ValidateIBANResult.errorCodes}.
 */
export const ValidationErrorsIBAN = {
  /** No IBAN was provided, or it was empty. */
  NoIBANProvided: 'NO_IBAN_PROVIDED',
  /** The first two characters are not the code of a country that uses IBAN. */
  NoIBANCountry: 'NO_IBAN_COUNTRY',
  /** The IBAN does not have the length defined for its country. */
  WrongBBANLength: 'WRONG_BBAN_LENGTH',
  /** The BBAN does not match the format defined for its country. */
  WrongBBANFormat: 'WRONG_BBAN_FORMAT',
  /** The check digits (characters 3 and 4) are not two digits. */
  ChecksumNotNumber: 'CHECKSUM_NOT_NUMBER',
  /** The MOD 97-10 check digits of the IBAN are wrong. */
  WrongIBANChecksum: 'WRONG_IBAN_CHECKSUM',
  /** The national check digits of the bank, branch or account number are wrong. */
  WrongAccountBankBranchChecksum: 'WRONG_ACCOUNT_BANK_BRANCH_CHECKSUM',
  /** The IBAN is a Swiss or Liechtenstein QR-IBAN, and QR-IBANs were not allowed. */
  QRIBANNotAllowed: 'QR_IBAN_NOT_ALLOWED',
} as const;

/** One of the {@link ValidationErrorsIBAN} error codes. */
export type ValidationErrorsIBAN = (typeof ValidationErrorsIBAN)[keyof typeof ValidationErrorsIBAN];

/** Options for {@link isValidBBAN} and {@link composeIBAN}. */
export interface BBANValidationOptions {
  /**
   * National checksum validators by country code. A validator given here replaces the built-in one
   * for that country. Use it to plug in stricter checks, for example from `ibantools-germany`.
   */
  bbanValidators?: Readonly<Record<string, BBANValidator>>;
}

/** Options for {@link isValidIBAN} and {@link validateIBAN}. */
export interface ValidateIBANOptions extends BBANValidationOptions {
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
  NoBICProvided: 'NO_BIC_PROVIDED',
  /** Characters 5 and 6 are not a known country code. */
  NoBICCountry: 'NO_BIC_COUNTRY',
  /** The BIC does not have the format of an 8 or 11 character BIC. */
  WrongBICFormat: 'WRONG_BIC_FORMAT',
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

/** Position of an identifier as `[start, end]` character indexes, 0-based and inclusive. */
export type IdentifierPosition = readonly [start: number, end: number];

/** National checksum validation for a BBAN in electronic format. Returns whether the BBAN is valid. */
export type BBANValidator = (bban: string) => boolean;

/**
 * Specification of one country, as stored in {@link countrySpecs}. All fields are unset for countries without IBAN.
 * The data is frozen. Pass {@link BBANValidationOptions.bbanValidators} to change validation for a country.
 */
export interface CountrySpec {
  /** IBAN length. */
  readonly ibanLength?: number;
  /** Regular expression source for the BBAN. */
  readonly bbanPattern?: string;
  /** Built-in national checksum validation for the BBAN. */
  readonly bbanValidator?: BBANValidator;
  /** Whether the country is listed in the SWIFT IBAN Registry. */
  readonly ibanRegistry?: boolean;
  /** Whether the country takes part in SEPA. */
  readonly sepa?: boolean;
  /** Position of the bank identifier within the BBAN. */
  readonly bankPosition?: IdentifierPosition;
  /** Position of the branch identifier within the BBAN. */
  readonly branchPosition?: IdentifierPosition;
  /** Position of the account number within the IBAN. */
  readonly accountPosition?: IdentifierPosition;
}

/** Country specifications by ISO 3166-1 alpha-2 country code. */
export type CountryMap = Readonly<Record<string, CountrySpec>>;
