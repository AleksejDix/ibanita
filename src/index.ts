/**
 * Validation, extraction and creation of IBAN, BBAN, BIC/SWIFT numbers plus some other helpful stuff
 * @author Aleksej Dix
 * @module ibanita
 * @version 4.5.1
 * @license MIT
 */
// Re-export all public types
export { ValidationErrorsBIC, ValidationErrorsIBAN } from './core/types';
export type {
  ComposeIBANParams,
  CountryMap,
  CountryMapInternal,
  CountrySpec,
  CountrySpecInternal,
  ExtractBICResult,
  ExtractIBANResult,
  ValidateBICResult,
  ValidateIBANOptions,
  ValidateIBANResult,
} from './core/types';

// Re-export utility functions
export { electronicFormatIBAN, friendlyFormatIBAN } from './format';

// Re-export IBAN functions
export { composeIBAN, extractIBAN, isQRIBAN, isValidIBAN, validateIBAN } from './iban';

// Re-export BIC functions
export { extractBIC, isValidBIC, validateBIC } from './bic';

// Re-export BBAN functions
export { isValidBBAN } from './bban';

// Re-export country utilities and specs
export { getCountrySpecifications, isSEPACountry, setCountryBBANValidation } from './countries/sepa';
export { countrySpecs } from './countries/all';
