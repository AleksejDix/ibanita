import { MOD_97 } from '../core/constants';

/**
 * Belgium: 12-digit BBAN. The last two digits are the first 10 digits modulo 97,
 * where a remainder of 0 is written as 97.
 */
export function checkBelgianBBAN(bban: string): boolean {
  const account = Number(bban.slice(0, 10));
  const checkDigits = Number(bban.slice(10, 12));
  const remainder = account % MOD_97;
  return (remainder === 0 ? MOD_97 : remainder) === checkDigits;
}
