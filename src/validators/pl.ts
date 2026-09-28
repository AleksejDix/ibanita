import { weightedSum } from '../core/checksum';

/** Weights for the 7 digits of the bank and branch code. */
const WEIGHTS = [3, 9, 7, 1, 3, 9, 7] as const;

/**
 * Poland: the 8-digit bank code ends with a MOD 10 control digit over its first 7 digits.
 * The 16-digit account number that follows is not checked.
 */
export function checkPolandBBAN(bban: string): boolean {
  const controlDigit = Number(bban.charAt(7));
  const remainder = weightedSum(bban.slice(0, 7), WEIGHTS) % 10;
  return controlDigit === (remainder === 0 ? 0 : 10 - remainder);
}
