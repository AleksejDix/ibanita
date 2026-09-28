import { weightedSum } from '../core/checksum';

/** Weights for the 13 digits between the bank code and the control digit. */
const WEIGHTS = [7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7] as const;

/**
 * Estonia: 16-digit BBAN. After the 2-digit bank code, 13 digits are covered by a MOD 10
 * control digit at position 16.
 */
export function checkEstonianBBAN(bban: string): boolean {
  const controlDigit = Number(bban.charAt(15));
  const remainder = weightedSum(bban.slice(2, 15), WEIGHTS) % 10;
  return controlDigit === (remainder === 0 ? 0 : 10 - remainder);
}
