import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';

describe('bban', () => {
  describe('When calling isValidBBAN()', () => {
    it.each<[string | null | undefined, string | null | undefined, boolean]>([
      ['117730171111101800000000', 'HU', false],
      ['08000000610000000000', 'CZ', false],
      ['08000000000000000601', 'CZ', false],
      ['12000000610000000000', 'SK', false],
      ['KNNF4736942347', 'NL', true],
      ['KNNF4736942347', 'NL', true],
      ['7NNF4736942347', 'NL', false],
      ['KNNF4736942347', 'ZZ', false],
      ['KNNF4736942347', null, false],
      ['40189051472', 'NO', false],
      ['07500893839', 'NO', true],
      ['NO8430696301065', 'NO', false],
    ])('isValidBBAN(%s, %s)', (bban, countryCode, expected) => {
      expect(iban.isValidBBAN(bban, countryCode)).toBe(expected);
    });
  });
});

describe('validateBBAN', () => {
  const Errors = iban.BBANValidationError;
  it.each<[string | null | undefined, string | null | undefined, iban.BBANValidationResult]>([
    ['KNNF4736942347', 'NL', { valid: true, errorCodes: [] }],
    ['abna 0417.1643-00', 'nl', { valid: true, errorCodes: [] }],
    ['', 'NL', { valid: false, errorCodes: [Errors.NoBBANProvided] }],
    [null, 'NL', { valid: false, errorCodes: [Errors.NoBBANProvided] }],
    ['KNNF4736942347', undefined, { valid: false, errorCodes: [Errors.NoBBANProvided] }],
    ['KNNF4736942347', 'XX', { valid: false, errorCodes: [Errors.NoIBANCountry] }],
    ['ABNA04171643001', 'NL', { valid: false, errorCodes: [Errors.WrongBBANLength, Errors.WrongBBANFormat] }],
    ['7NNF4736942347', 'NL', { valid: false, errorCodes: [Errors.WrongBBANFormat] }],
    ['86011117948', 'NO', { valid: false, errorCodes: [Errors.WrongBBANChecksum] }],
    ['86011117947', 'NO', { valid: true, errorCodes: [] }],
  ])('validateBBAN(%s, %s)', (bban, countryCode, expected) => {
    expect(iban.validateBBAN(bban, countryCode)).toEqual(expected);
  });

  it('uses the validator from the options', () => {
    const rejectNO = { bbanValidators: { NO: () => false } };
    expect(iban.validateBBAN('86011117947', 'NO', rejectNO)).toEqual({
      valid: false,
      errorCodes: [Errors.WrongBBANChecksum],
    });
  });
});
