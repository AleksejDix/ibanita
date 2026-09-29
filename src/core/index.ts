/**
 * The rules without the data. Pair {@link withCountries} with the countries you need
 * from `@aleksejdix/ibanita/countries/<CC>`.
 * @module core
 */
export { withCountries, type Ibanita } from './tools';
export { isQRIBAN } from './iban';
export { electronicFormat } from './format';
export { BBANValidationError, BICValidationError, IBANValidationError } from './errors';
export type * from './types';
