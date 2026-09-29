/**
 * Validation, extraction and creation of IBAN, BBAN, BIC/SWIFT numbers plus some other helpful stuff
 * @author Aleksej Dix
 * @module ibanita
 * @license MIT
 */
// Re-export all public types
export { BBANValidationError, BICValidationError, IBANValidationError } from './core/errors';
export type {
  BBANValidationOptions,
  BBANValidationResult,
  BBANValidator,
  BICExtractionResult,
  BICParts,
  BICValidationResult,
  CountryMap,
  CountrySpec,
  IBANCountryCode,
  IBANCountrySpec,
  IBANCountrySpecs,
  IBANExtractionResult,
  IBANParts,
  IBANValidationOptions,
  IBANValidationResult,
  IdentifierPosition,
  InvalidBICParts,
  InvalidIBANParts,
} from './core/types';

export { withCountries, type Ibanita } from './core/tools';

// Re-export utility functions
export { electronicFormat, friendlyFormatIBAN } from './format';

// Re-export IBAN functions
export { composeIBAN, extractIBAN, isQRIBAN, isValidIBAN, validateIBAN } from './iban';

// Re-export BIC functions
export { extractBIC, isValidBIC, validateBIC } from './bic';

// Re-export BBAN functions
export { isValidBBAN, validateBBAN } from './bban';

// Re-export country functions and data
export { countrySpecs, isSEPACountry } from './country';
