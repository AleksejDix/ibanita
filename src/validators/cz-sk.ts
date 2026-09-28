import { weightedSum } from '../core/checksum';

/** Weights for the 6-digit account prefix. */
const PREFIX_WEIGHTS = [10, 5, 8, 4, 2, 1] as const;
/** Weights for the 10-digit account number. */
const SUFFIX_WEIGHTS = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1] as const;

/**
 * Czech Republic and Slovakia: 20-digit BBAN made of a 4-digit bank code, a 6-digit account prefix
 * and a 10-digit account number. The prefix and the account number each have a weighted sum
 * divisible by 11. Their last digit acts as the control digit.
 */
export function checkCzechAndSlovakBBAN(bban: string): boolean {
  return (
    weightedSum(bban.slice(4, 10), PREFIX_WEIGHTS) % 11 === 0 &&
    weightedSum(bban.slice(10, 20), SUFFIX_WEIGHTS) % 11 === 0
  );
}
