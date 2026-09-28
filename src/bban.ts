/**
 * BBAN validation functions
 * @module bban
 */
import { checkFormatBBAN, stripSpacesAndPeriods } from './core/checksum';
import { ibanSpecs } from './countries/specs';

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
export function isValidBBAN(bban: string | null | undefined, countryCode: string | null | undefined): boolean {
  if (bban === undefined || bban === null || countryCode === undefined || countryCode === null) {
    return false;
  }

  const spec = ibanSpecs[countryCode];

  if (
    spec === undefined ||
    spec === null ||
    spec.bban_regexp === undefined ||
    spec.bban_regexp === null ||
    spec.chars === undefined ||
    spec.chars === null
  ) {
    return false;
  }

  if (spec.chars - 4 === bban.length && checkFormatBBAN(bban, spec.bban_regexp)) {
    if (spec.bban_validation_func) {
      return spec.bban_validation_func(stripSpacesAndPeriods(bban));
    }
    return true;
  }
  return false;
}
