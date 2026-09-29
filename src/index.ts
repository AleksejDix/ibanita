/**
 * Validation, extraction and creation of IBAN, BBAN, BIC/SWIFT numbers plus some other helpful stuff
 * @author Aleksej Dix
 * @module ibanita
 * @license MIT
 */
// Re-export all public types
export { BBANValidationError, BICValidationError, IBANValidationError } from './core/types';
export type {
  BBANValidationOptions,
  BBANValidationResult,
  BBANValidator,
  BICExtractionResult,
  BICParts,
  BICValidationResult,
  CountryMap,
  CountrySpec,
  IBANCountrySpec,
  IBANExtractionResult,
  IBANParts,
  IBANValidationOptions,
  IBANValidationResult,
  IdentifierPosition,
  InvalidBICParts,
  InvalidIBANParts,
} from './core/types';

// Re-export utility functions
export { electronicFormat, electronicFormatIBAN, friendlyFormatIBAN } from './format';

// Re-export IBAN functions
export { composeIBAN, extractIBAN, isQRIBAN, isValidIBAN, validateIBAN } from './iban';

// Re-export BIC functions
export { extractBIC, isValidBIC, validateBIC } from './bic';

// Re-export BBAN functions
export { isValidBBAN, validateBBAN } from './bban';

// Re-export country functions and data
export { countrySpecs, isSEPACountry } from './country';
