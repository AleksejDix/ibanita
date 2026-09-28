import { mod9710 } from '../core/checksum';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
/** Digit for each letter: A J are 1, B K S are 2, C L T are 3, and so on up to I R Z as 9. */
const DIGITS = '12345678912345678923456789';

/**
 * France and Monaco: 23-character BBAN whose last two digits are the RIB key.
 * Letters in the account number are replaced by digits with the RIB table,
 * and the whole BBAN must then have a MOD 97-10 remainder of 0.
 */
export function checkFrenchBBAN(bban: string): boolean {
  const digits = bban.replace(/[A-Z]/gu, (letter) => DIGITS.charAt(LETTERS.indexOf(letter)));
  return mod9710(digits) === 0;
}
