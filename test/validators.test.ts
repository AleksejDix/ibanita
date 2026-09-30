import { describe, expect, it } from 'vitest';
import { ibanSpecs } from '../src/countries/specs';
import { registryExamples } from './sources';

/** BBAN indexes of the control digits each validator checks. */
const CONTROL_DIGITS: Readonly<Record<string, (bban: string) => readonly number[]>> = {
  checkBelgianBBAN: () => [10, 11],
  checkNorwayBBAN: () => [10],
  checkPolandBBAN: () => [7],
  checkSpainBBAN: () => [8, 9],
  checkCroatianBBAN: () => [6, 16],
  checkCzechAndSlovakBBAN: () => [9, 19],
  checkEstonianBBAN: () => [15],
  checkFrenchBBAN: (bban) => [bban.length - 2, bban.length - 1],
  checkHungarianBBAN: (bban) => [7, bban.endsWith('00000000') ? 15 : 23],
  checkMod9710BBAN: (bban) => [bban.length - 2, bban.length - 1],
};

function changeDigit(bban: string, index: number): string {
  return bban.slice(0, index) + String((Number(bban.charAt(index)) + 1) % 10) + bban.slice(index + 1);
}

function validate(code: string, bban: string): boolean {
  return ibanSpecs[code]?.bbanValidator?.(bban) ?? true;
}

function validatorName(code: string): string {
  return ibanSpecs[code]?.bbanValidator?.name ?? '';
}

// Every registry country with a national validator, with its example BBAN.
const cases = registryExamples
  .filter(([code]) => validatorName(code) !== '')
  .map(([code, example]) => [code, example.slice(4)] as const);

describe('national BBAN validators', () => {
  it('cover every validator', () => {
    const names = new Set(cases.map(([code]) => validatorName(code)));
    expect([...names].sort()).toEqual(Object.keys(CONTROL_DIGITS).sort());
  });

  it.each(cases)('%s accepts the registry example', (code, bban) => {
    expect(validate(code, bban)).toBe(true);
  });

  it.each(cases)('%s rejects the example with a changed control digit', (code, bban) => {
    const positions = CONTROL_DIGITS[validatorName(code)]?.(bban) ?? [];
    expect(positions.length).toBeGreaterThan(0);
    for (const index of positions) {
      expect(validate(code, changeDigit(bban, index)), `control digit at ${index}`).toBe(false);
    }
  });
});

describe('remainder zero', () => {
  // Each algorithm has a special case when the weighted sum or remainder is 0.
  const zeros = (length: number): string => '0'.repeat(length);
  it.each<[string, string, boolean]>([
    // Belgium writes remainder 0 as check digits 97.
    ['BE', `${zeros(8)}9797`, true],
    ['BE', `${zeros(8)}9700`, false],
    // Norway, Estonia and Poland use control digit 0 for remainder 0.
    ['NO', zeros(11), true],
    ['EE', zeros(16), true],
    ['PL', zeros(24), true],
    ['NO', `${zeros(10)}1`, false],
    ['EE', `${zeros(15)}1`, false],
    ['PL', `${zeros(7)}1${zeros(16)}`, false],
  ])('%s %s', (code, bban, expected) => {
    expect(validate(code, bban)).toBe(expected);
  });
});
