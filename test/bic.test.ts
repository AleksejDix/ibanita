import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';

describe('bic', () => {
  describe('When calling isValidBIC()', () => {
    it('with valid BIC ABNANL2A should return true', () => {
      expect(iban.isValidBIC('ABNANL2A')).toBe(true);
    });
    it('with valid BIC ABNANL2A000 should return true', () => {
      expect(iban.isValidBIC('ABNANL2A000')).toBe(true);
    });
    it('with valid BIC ABNANL2AXXX should return true', () => {
      expect(iban.isValidBIC('ABNANL2AXXX')).toBe(true);
    });
    it('with valid BIC ABNAAA2AXXX should return true', () => {
      expect(iban.isValidBIC('ABNAAA2AXXX')).toBe(false);
    });
    it('with valid BIC NOLADE21KI should return true', () => {
      expect(iban.isValidBIC('NOLADE21KIE')).toBe(true);
    });
    it('with valid BIC INGDDEFFXXX should return true', () => {
      expect(iban.isValidBIC('INGDDEFFXXX')).toBe(true);
    });
    it('with invalid BIC INGDEFFXXX should return false', () => {
      expect(iban.isValidBIC('INGDEFFXXX')).toBe(false);
    });
    it('with invalid BIC ABN4NL2A should return false', () => {
      expect(iban.isValidBIC('ABN4NL2A')).toBe(false);
    });
    it('with invalid BIC ABNANL2A01F should return true', () => {
      expect(iban.isValidBIC('ABNANL2A01F')).toBe(true);
    });
    it('with invalid BIC `null` should return false', () => {
      expect(iban.isValidBIC(null)).toBe(false);
    });
    it('with invalid BIC `undefined` should return false', () => {
      expect(iban.isValidBIC(undefined)).toBe(false);
    });
    it('with invalid BIC ABNAXX2A should return false', () => {
      expect(iban.isValidBIC('ABNAXX2A')).toBe(false);
    });
  });

  describe('When calling validateBIC()', () => {
    it('with null BIC should return false', () => {
      expect(iban.validateBIC(null)).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsBIC.NoBICProvided],
      });
    });

    it('with empty BIC should return false', () => {
      expect(iban.validateBIC('')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsBIC.NoBICProvided],
      });
    });

    it('with undefined BIC should return false', () => {
      expect(iban.validateBIC(undefined)).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsBIC.NoBICProvided],
      });
    });

    it('with invalid BIC should return false with correct code', () => {
      expect(iban.validateBIC('ABN4NL2A')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsBIC.WrongBICFormat],
      });
    });

    it('with invalid BIC country should return false with correct code', () => {
      expect(iban.validateBIC('ABNAXX2A')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsBIC.NoBICCountry],
      });
    });

    it('with too short BIC should return false with format code', () => {
      expect(iban.validateBIC('AB')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsBIC.WrongBICFormat],
      });
    });

    it('with valid BIC should return true', () => {
      expect(iban.validateBIC('ABNANL2A')).toEqual({ valid: true, errorCodes: [] });
    });
  });

  describe('extractBIC()', () => {
    it.each<[string, iban.ExtractBICResult]>([
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
