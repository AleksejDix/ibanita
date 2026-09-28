import { weightedSum } from '../core/checksum';

/** Weights for the 10 digits before the control digit. */
const WEIGHTS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2] as const;

/**
 * Norway: 11-digit BBAN. The last digit is a MOD 11 control digit over the first 10 digits,
 * with a remainder of 0 giving control digit 0.
 */
export function checkNorwayBBAN(bban: string): boolean {
  const controlDigit = Number(bban.charAt(10));
  const remainder = weightedSum(bban.slice(0, 10), WEIGHTS) % 11;
  return controlDigit === (remainder === 0 ? 0 : 11 - remainder);
}
