import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';

describe('bic', () => {
  describe('When calling isValidBIC()', () => {
    it.each<[string | null | undefined, boolean]>([
      ['DEMONL2A', true],
      ['DEMONL2A000', true],
      ['DEMONL2AXXX', true],
      ['DEMOAA2AXXX', false],
      ['BANKDE21KIE', true],
      ['BANKDEFFXXX', true],
      ['BANDEFFXXX', false],
      ['DEM4NL2A', false],
      ['DEMONL2A01F', true],
      [null, false],
      [undefined, false],
      ['DEMOXX2A', false],
    ])('isValidBIC(%s)', (input, expected) => {
      expect(iban.isValidBIC(input)).toBe(expected);
    });
  });

  describe('When calling validateBIC()', () => {
    it.each<[string | null | undefined, iban.BICValidationResult]>([
      [
        null,
        {
          valid: false,
          errorCodes: [iban.BICValidationError.NoBICProvided],
        },
      ],
      [
        '',
        {
          valid: false,
          errorCodes: [iban.BICValidationError.NoBICProvided],
        },
      ],
      [
        undefined,
        {
          valid: false,
          errorCodes: [iban.BICValidationError.NoBICProvided],
        },
      ],
      [
        'DEM4NL2A',
        {
          valid: false,
          errorCodes: [iban.BICValidationError.WrongBICFormat],
        },
      ],
      [
        'DEMOXX2A',
        {
          valid: false,
          errorCodes: [iban.BICValidationError.NoBICCountry],
        },
      ],
      [
        'AB',
        {
          valid: false,
          errorCodes: [iban.BICValidationError.WrongBICFormat],
        },
      ],
      ['DEMONL2A', { valid: true, errorCodes: [] }],
    ])('validateBIC(%s)', (input, expected) => {
      expect(iban.validateBIC(input)).toEqual(expected);
    });
  });

  describe('extractBIC()', () => {
    it.each<[string, iban.BICExtractionResult]>([
      [
        'DEMONL2A',
        { bankCode: 'DEMO', countryCode: 'NL', locationCode: '2A', testBIC: false, branchCode: null, valid: true },
      ],
      [
        'banknokk',
        { bankCode: 'BANK', countryCode: 'NO', locationCode: 'KK', testBIC: false, branchCode: null, valid: true },
      ],
      ['DEM7NL2A', { valid: false }],
      [
        'TESTZAJ0XXX',
        { bankCode: 'TEST', countryCode: 'ZA', locationCode: 'J0', testBIC: true, branchCode: 'XXX', valid: true },
      ],
    ])('%s', (input, expected) => {
      expect(iban.extractBIC(input)).toEqual(expected);
    });
  });
});

describe('BIC input rule', () => {
  it.each<[string, boolean]>([
    ['DEMO NL 2A', true],
    ['demo-nl-2a', true],
    [' TESTZAJJXXX ', true],
    ['ABNA NL 2', false],
  ])('isValidBIC(%s)', (input, expected) => {
    expect(iban.isValidBIC(input)).toBe(expected);
  });
  it('extractBIC normalises its input', () => {
    expect(iban.extractBIC('demo nl 2a')).toEqual({
      valid: true,
      bankCode: 'DEMO',
      countryCode: 'NL',
      locationCode: '2A',
      branchCode: null,
      testBIC: false,
    });
  });
});
