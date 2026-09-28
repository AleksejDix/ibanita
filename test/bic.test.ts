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

  describe('When calling extractBIC() with valid BIC ABNANL2A', () => {
    const ext = iban.extractBIC('ABNANL2A');
    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });
    it('bankCode should be ABNA', () => {
      expect(ext.bankCode).toBe('ABNA');
    });
    it('countryCode should be NL', () => {
      expect(ext.countryCode).toBe('NL');
    });
    it('locationCode should be 2A', () => {
      expect(ext.locationCode).toBe('2A');
    });
    it('testBIC should be false', () => {
      expect(ext.testBIC).toBe(false);
    });
    it('branchCode should be null', () => {
      expect(ext.branchCode).toBe(null);
    });
  });

  describe('When calling extractBIC() with lowercase BIC dnbanokk', () => {
    const ext = iban.extractBIC('dnbanokk');
    it('countryCode should be NO', () => {
      expect(ext.countryCode).toBe('NO');
    });
  });

  describe('When calling extractBIC() with invalid BIC ABN7NL2A', () => {
    const ext = iban.extractBIC('ABN7NL2A');
    it('valid should be false', () => {
      expect(ext.valid).toBe(false);
    });
    it('bankCode should be undefined', () => {
      expect(ext.bankCode).toBeUndefined();
    });
    it('countryCode should be undefined', () => {
      expect(ext.countryCode).toBeUndefined();
    });
    it('locationCode should be undefined', () => {
      expect(ext.locationCode).toBeUndefined();
    });
    it('testBIC should be undefined', () => {
      expect(ext.testBIC).toBeUndefined();
    });
    it('branchCode should be undefined', () => {
      expect(ext.branchCode).toBeUndefined();
    });
  });

  describe('When calling extractBIC() with valid BIC NEDSZAJ0XXX', () => {
    const ext = iban.extractBIC('NEDSZAJ0XXX');
    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });
    it('bankCode should be NEDS', () => {
      expect(ext.bankCode).toBe('NEDS');
    });
    it('countryCode should be ZA', () => {
      expect(ext.countryCode).toBe('ZA');
    });
    it('locationCode should be J0', () => {
      expect(ext.locationCode).toBe('J0');
    });
    it('testBIC should be true', () => {
      expect(ext.testBIC).toBe(true);
    });
    it('branchCode should be XXX', () => {
      expect(ext.branchCode).toBe('XXX');
    });
  });
});
