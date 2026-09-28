import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';

describe('bban', () => {
  describe('When calling isValidBBAN()', () => {
    it.each<[string | null | undefined, string | null | undefined, boolean]>([
      ['117730171111101800000000', 'HU', false],
      ['08000000610000000000', 'CZ', false],
      ['08000000000000000601', 'CZ', false],
      ['12000000610000000000', 'SK', false],
      ['ABNA0417164300', 'NL', true],
      ['PSTB0000054322', 'NL', true],
      ['A7NA0417164300', 'NL', false],
      ['ABNA0417164300', 'ZZ', false],
      ['ABNA0417164300', null, false],
      ['12043175441', 'NO', false],
      ['12043175449', 'NO', true],
      ['1204317544', 'NO', false],
    ])('isValidBBAN(%s, %s)', (bban, countryCode, expected) => {
      expect(iban.isValidBBAN(bban, countryCode)).toBe(expected);
    });
  });
});
