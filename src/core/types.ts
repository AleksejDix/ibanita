import { type BBANValidationError, type BICValidationError, type IBANValidationError } from './errors';
import { type IBANCountryCode } from '../countries/iban-country-code';

export type { BBANValidationError, BICValidationError, IBANCountryCode, IBANValidationError };

/** Result of {@link validateBBAN}. */
export interface BBANValidationResult {
  /** Every problem found, as {@link BBANValidationError} codes. Empty when the BBAN is valid. */
  readonly errorCodes: readonly BBANValidationError[];
  /** Whether the BBAN is valid. */
  readonly valid: boolean;
}

/** Options for {@link isValidBBAN}, {@link validateBBAN} and {@link composeIBAN}. */
export interface BBANValidationOptions {
  /**
   * National checksum validators by country code. A validator given here replaces the built-in one
   * for that country. Use it to plug in stricter checks, for example a German bank-code validator.
   */
  bbanValidators?: Readonly<Partial<Record<IBANCountryCode, BBANValidator>>>;
}

/** Options for {@link isValidIBAN} and {@link validateIBAN}. */
export interface IBANValidationOptions extends BBANValidationOptions {
  /** Whether Swiss and Liechtenstein QR-IBANs count as valid. Defaults to `true`. */
  allowQRIBAN?: boolean;
}

/** Result of {@link validateIBAN}. */
export interface IBANValidationResult {
  /** Every problem found, as {@link IBANValidationError} codes. Empty when the IBAN is valid. */
  readonly errorCodes: readonly IBANValidationError[];
  /** Whether the IBAN is valid. */
  readonly valid: boolean;
}

/** The parts of a valid IBAN, returned by {@link extractIBAN}. */
export interface IBANParts {
  /** Always `true`. */
  readonly valid: true;
  /** The IBAN in electronic format, without spaces or dashes. */
  readonly iban: string;
  /** ISO 3166-1 alpha-2 country code. */
  readonly countryCode: IBANCountryCode;
  /** The domestic account number (BBAN): everything after the first four characters. */
  readonly bban: string;
  /** Account number, for countries whose account position is known. */
  readonly accountNumber?: string;
  /** Bank identifier, for countries that define one. */
  readonly bankIdentifier?: string;
  /** Branch identifier, for countries that define one. */
  readonly branchIdentifier?: string;
}

/** Returned by {@link extractIBAN} for an invalid IBAN. */
export interface InvalidIBANParts {
  /** Always `false`. */
  readonly valid: false;
  /** The input in electronic format, or an empty string for `null` and `undefined`. */
  readonly iban: string;
}

/** Result of {@link extractIBAN}. Check `valid` to narrow to {@link IBANParts}. */
export type IBANExtractionResult = IBANParts | InvalidIBANParts;

/** Result of {@link validateBIC}. */
export interface BICValidationResult {
  /** Every problem found, as {@link BICValidationError} codes. Empty when the BIC is valid. */
  readonly errorCodes: readonly BICValidationError[];
  /** Whether the BIC is valid. */
  readonly valid: boolean;
}

/** The parts of a valid BIC, returned by {@link extractBIC}. */
export interface BICParts {
  /** Always `true`. */
  readonly valid: true;
  /** Bank code: characters 1 to 4. */
  readonly bankCode: string;
  /** ISO 3166-1 alpha-2 country code: characters 5 and 6. */
  readonly countryCode: string;
  /** Location code: characters 7 and 8. */
  readonly locationCode: string;
  /** Branch code: characters 9 to 11, or `null` for an 8 character BIC. */
  readonly branchCode: string | null;
  /** Whether this is a test BIC, meaning the second character of the location code is `0`. */
  readonly testBIC: boolean;
}

/** Returned by {@link extractBIC} for an invalid BIC. */
export interface InvalidBICParts {
  /** Always `false`. */
  readonly valid: false;
}

/** Result of {@link extractBIC}. Check `valid` to narrow to {@link BICParts}. */
export type BICExtractionResult = BICParts | InvalidBICParts;

/** Position of an identifier as `[start, end]` character indexes, 0-based and inclusive. */
export type IdentifierPosition = readonly [start: number, end: number];

/** National checksum validation for a BBAN in electronic format. Returns whether the BBAN is valid. */
export type BBANValidator = (bban: string) => boolean;

/**
 * Specification of a country that uses IBAN. The data is frozen.
 * Pass {@link BBANValidationOptions.bbanValidators} to change validation for a country.
 */
export interface IBANCountrySpec {
  /** IBAN length. */
  readonly ibanLength: number;
  /** Regular expression the BBAN must match. */
  readonly bbanRegExp: Readonly<RegExp>;
  /** Whether the country is listed in the SWIFT IBAN Registry. */
  readonly ibanRegistry: boolean;
  /** Whether the country takes part in SEPA. */
  readonly sepa: boolean;
  /** Built-in national checksum validation for the BBAN. */
  readonly bbanValidator?: BBANValidator;
  /** Position of the bank identifier within the BBAN. */
  readonly bankPosition?: IdentifierPosition;
  /** Position of the branch identifier within the BBAN. */
  readonly branchPosition?: IdentifierPosition;
  /** Position of the account number within the IBAN. */
  readonly accountPosition?: IdentifierPosition;
}

/** IBAN country specifications by country code, as passed to {@link withCountries}. */
export type IBANCountrySpecs = Readonly<Partial<Record<IBANCountryCode, IBANCountrySpec>>>;

/** Specification of one country, as stored in {@link countrySpecs}. All fields are unset for countries without IBAN. */
export type CountrySpec = Partial<IBANCountrySpec>;

/** Country specifications by ISO 3166-1 alpha-2 country code. */
export type CountryMap = Readonly<Record<string, CountrySpec>>;
