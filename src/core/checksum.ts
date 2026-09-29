/** ISO 7064 MOD 97-10 modulus. */
export const MOD_97 = 97;
/** The check digits are 98 minus the MOD 97 remainder. */
const MOD_97_REMAINDER = 98;

// 'A'.charCodeAt(0) - 10, so A is 10, B is 11, ... Z is 35
const LETTER_OFFSET = 55;

/** Replaces every uppercase letter with its ISO 7064 number: A is 10, B is 11, ... Z is 35. */
export function lettersToDigits(value: string): string {
  return value.replace(/[A-Z]/gu, (letter) => String(letter.charCodeAt(0) - LETTER_OFFSET));
}

/**
 * ISO 7064 MOD 97-10 remainder of a digit string of any length,
 * computed in chunks so the number never exceeds the safe integer range.
 * Returns NaN when the string contains anything but digits.
 */
export function mod9710(digits: string): number {
  let rest = digits;
  while (rest.length > 2) {
    const chunk = rest.slice(0, 6);
    const value = parseInt(chunk, 10);
    if (isNaN(value)) {
      return NaN;
    }
    rest = (value % MOD_97) + rest.slice(chunk.length);
  }
  return parseInt(rest, 10) % MOD_97;
}

/**
 * The two IBAN check digits for a country code and BBAN, as defined by ISO 13616:
 * `98 - mod97(bban + countryCode + '00')`, with letters converted to numbers.
 */
export function ibanCheckDigits(countryCode: string, bban: string): string {
  const remainder = mod9710(lettersToDigits(`${bban}${countryCode}00`));
  return String(MOD_97_REMAINDER - remainder).padStart(2, '0');
}

/** Sum of each digit multiplied by the weight at the same index. */
export function weightedSum(digits: string, weights: readonly number[]): number {
  let sum = 0;
  for (let index = 0; index < digits.length; index++) {
    sum += Number(digits.charAt(index)) * weights[index]!;
  }
  return sum;
}

/** Control digit for a MOD 11 remainder, where remainders 0 and 1 map to themselves. */
export function mod11CheckDigit(remainder: number): number {
  return remainder <= 1 ? remainder : 11 - remainder;
}

/** ISO 7064 MOD 11-10 check: whether `control` is the control digit for `digits`. */
export function checkMod1110(digits: string, control: number): boolean {
  let product = 10;
  for (const digit of digits) {
    const sum = (product + Number(digit)) % 10;
    product = ((sum === 0 ? 10 : sum) * 2) % 11;
  }
  const check = 11 - product;
  return control === (check === 10 ? 0 : check);
}
