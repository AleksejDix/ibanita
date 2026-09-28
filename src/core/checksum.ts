import { MOD_97, MOD_97_REMAINDER } from './constants';

const bbanRegexCache = new Map<string, RegExp>();
const WHITESPACE_REGEX = /[\s.]+/gu;

export function stripSpacesAndPeriods(str: string): string {
  return str.replace(WHITESPACE_REGEX, '');
}

export function checkFormatBBAN(bban: string, bformat: string): boolean {
  let reg = bbanRegexCache.get(bformat);
  if (!reg) {
    reg = new RegExp(bformat, 'u');
    bbanRegexCache.set(bformat, reg);
  }
  return reg.test(bban);
}

export function replaceCharacterWithCode(str: string): string {
  return str
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      return code >= 65 ? (code - 55).toString() : char;
    })
    .join('');
}

export function mod9710(validationString: string): number {
  while (validationString.length > 2) {
    const part = validationString.slice(0, 6);
    const partInt = parseInt(part, 10);
    if (isNaN(partInt)) {
      return NaN;
    }
    validationString = (partInt % MOD_97) + validationString.slice(part.length);
  }
  return parseInt(validationString, 10) % MOD_97;
}

export function mod9710Iban(iban: string): number {
  return mod9710(replaceCharacterWithCode(iban.slice(4) + iban.slice(0, 4)));
}

export function isValidIBANChecksum(iban: string): boolean {
  const countryCode: string = iban.slice(0, 2);
  const providedChecksum: number = parseInt(iban.slice(2, 4), 10);
  const bban: string = iban.slice(4);
  const validationString = replaceCharacterWithCode(`${bban}${countryCode}00`);
  const rest = mod9710(validationString);
  return MOD_97_REMAINDER - rest === providedChecksum;
}

export function weightedSum(digits: string, weights: readonly number[]): number {
  let sum = 0;
  for (let idx = 0; idx < digits.length; idx++) {
    sum += parseInt(digits.charAt(idx), 10) * weights[idx]!;
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
