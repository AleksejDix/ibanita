/**
 * BBAN validation functions
 * @module bban
 */

import { type BBANValidationOptions, type BBANValidator } from './core/types';
import { checkFormatBBAN, stripSpacesAndPeriods } from './core/checksum';
import { ibanSpecs } from './countries/specs';

/** The validator for a country: the one passed in the options, or the built-in one. */
export function bbanValidatorFor(
  countryCode: string,
  options: Readonly<BBANValidationOptions>,
): BBANValidator | undefined {
  return options.bbanValidators?.[countryCode] ?? ibanSpecs[countryCode]?.bbanValidator;
}

/**
 * Validate BBAN
 *
 * ```
 * // returns true
 * ibanita.isValidBBAN("ABNA0417164300", "NL");
 * ```
 * ```
 * // returns false
 * ibanita.isValidBBAN("A7NA0517164300", "NL");
 * ```
 */
export function isValidBBAN(
  bban: string | null | undefined,
  countryCode: string | null | undefined,
  options: Readonly<BBANValidationOptions> = {},
): boolean {
  if (bban === undefined || bban === null || countryCode === undefined || countryCode === null) {
    return false;
  }

  const spec = ibanSpecs[countryCode];
  if (spec?.bbanPattern === undefined || spec.ibanLength === undefined) {
    return false;
  }

  if (spec.ibanLength - 4 !== bban.length || !checkFormatBBAN(bban, spec.bbanPattern)) {
    return false;
  }
  const validator = bbanValidatorFor(countryCode, options);
  return validator === undefined || validator(stripSpacesAndPeriods(bban));
}
