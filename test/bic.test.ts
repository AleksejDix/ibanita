import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';

describe('bic', () => {
  describe('When calling isValidBIC()', () => {
    it.each<[string | null | undefined, boolean]>([
      ['ABNANL2A', true],
      ['ABNANL2A000', true],
      ['ABNANL2AXXX', true],
      ['ABNAAA2AXXX', false],
      ['NOLADE21KIE', true],
      ['INGDDEFFXXX', true],
      ['INGDEFFXXX', false],
      ['ABN4NL2A', false],
      ['ABNANL2A01F', true],
      [null, false],
      [undefined, false],
      ['ABNAXX2A', false],
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
        'ABN4NL2A',
        {
          valid: false,
          errorCodes: [iban.BICValidationError.WrongBICFormat],
        },
      ],
      [
        'ABNAXX2A',
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
      ['ABNANL2A', { valid: true, errorCodes: [] }],
    ])('validateBIC(%s)', (input, expected) => {
      expect(iban.validateBIC(input)).toEqual(expected);
    });
  });

  describe('extractBIC()', () => {
    it.each<[string, iban.BICExtractionResult]>([
      [
        'ABNANL2A',
        { bankCode: 'ABNA', countryCode: 'NL', locationCode: '2A', testBIC: false, branchCode: null, valid: true },
      ],
      [
        'dnbanokk',
        { bankCode: 'DNBA', countryCode: 'NO', locationCode: 'KK', testBIC: false, branchCode: null, valid: true },
      ],
      ['ABN7NL2A', { valid: false }],
      [
        'NEDSZAJ0XXX',
        { bankCode: 'NEDS', countryCode: 'ZA', locationCode: 'J0', testBIC: true, branchCode: 'XXX', valid: true },
      ],
    ])('%s', (input, expected) => {
      expect(iban.extractBIC(input)).toEqual(expected);
    });
  });
});

describe('BIC input rule', () => {
  it.each<[string, boolean]>([
    ['ABNA NL 2A', true],
    ['abna-nl-2a', true],
    [' NEDSZAJJXXX ', true],
    ['ABNA NL 2', false],
  ])('isValidBIC(%s)', (input, expected) => {
    expect(iban.isValidBIC(input)).toBe(expected);
  });
  it('extractBIC normalises its input', () => {
    expect(iban.extractBIC('abna nl 2a')).toEqual({
      valid: true,
      bankCode: 'ABNA',
      countryCode: 'NL',
      locationCode: '2A',
      branchCode: null,
      testBIC: false,
    });
  });
});
