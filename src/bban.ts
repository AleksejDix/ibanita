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
    spec.bbanPattern === undefined ||
    spec.bbanPattern === null ||
    spec.ibanLength === undefined ||
    spec.ibanLength === null
  ) {
    return false;
  }

  if (spec.ibanLength - 4 === bban.length && checkFormatBBAN(bban, spec.bbanPattern)) {
    if (spec.bbanValidator) {
      return spec.bbanValidator(stripSpacesAndPeriods(bban));
    }
    return true;
  }
  return false;
}
