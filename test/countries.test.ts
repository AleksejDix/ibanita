import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';
import { COUNTRY_CODES } from '../src/countries/codes';
import { ibanSpecs } from '../src/countries/specs';

describe('countries', () => {
  describe('When calling getCountrySpecifications()', () => {
    const specs = iban.getCountrySpecifications();
    it.each(['BI', 'DJ', 'FK'])('%s should be in IBAN registry', (code) => {
      expect(specs[code]?.ibanRegistry).toBe(true);
    });
    it.each(['EG', 'VA'])('%s BBAN regexp should reject extra characters', (code) => {
      expect(specs[code]?.bbanRegExp?.test('0'.repeat(30))).toBe(false);
    });
  });

  describe('When calling isSEPACountry()', () => {
    it('with valid country code NL should return true', () => {
      expect(iban.isSEPACountry('NL')).toBe(true);
    });
    it('with undefined country code should return false', () => {
      expect(iban.isSEPACountry(undefined)).toBe(false);
    });
    it('with valid country code PK return false', () => {
      expect(iban.isSEPACountry('PK')).toBe(false);
    });
    it('with non valid country code XX return false', () => {
      expect(iban.isSEPACountry('XX')).toBe(false);
    });
  });

  describe('Country code list', () => {
    it.each(Object.keys(ibanSpecs))('should contain IBAN country %s', (code) => {
      expect(COUNTRY_CODES.has(code)).toBe(true);
    });
  });

  describe('Country spec account positions', () => {
    // RU is excluded: its registry "branch" is the first part of the 20-digit account number.
    const codes = Object.keys(iban.countrySpecs).filter(
      (code) => code !== 'RU' && iban.countrySpecs[code]?.accountPosition !== undefined,
    );
    it.each(codes)('%s account range should follow bank and branch and fit the IBAN', (code) => {
      const spec = iban.countrySpecs[code] ?? {};
      const [start, end] = spec.accountPosition ?? [0, 0];
      const identifierEnds = [spec.bankPosition, spec.branchPosition].map((range) =>
        range === undefined ? 3 : range[1] + 4,
      );
      expect(start).toBeGreaterThan(Math.max(...identifierEnds));
      expect(end).toBeLessThanOrEqual(spec.ibanLength ?? 0);
    });
  });

  describe('countrySpecs', () => {
    it('is frozen', () => {
      expect(Object.isFrozen(iban.countrySpecs)).toBe(true);
      expect(Object.isFrozen(iban.countrySpecs['NL'])).toBe(true);
      expect(Object.isFrozen(iban.countrySpecs['AF'])).toBe(true);
    });
  });

  describe('When calling getCountrySpecifications()', () => {
    const ext = iban.getCountrySpecifications();
    it('Country with code BE should return ibanLength 16', () => {
      expect(ext['BE']?.ibanLength).toBe(16);
    });
    it('Country with code AF should return ibanLength undefined', () => {
      expect(ext['AF']?.ibanLength).toBeUndefined();
    });
    it('Country with code AL should return bbanRegExp /^[0-9]{8}[A-Z0-9]{16}$/u', () => {
      expect(ext['AL']?.bbanRegExp).toEqual(/^[0-9]{8}[A-Z0-9]{16}$/u);
    });
    it('Country with code AF should return bbanRegExp undefined', () => {
      expect(ext['AF']?.bbanRegExp).toBeUndefined();
    });
    it('Country with code BA should return ibanRegistry true', () => {
      expect(ext['BA']?.ibanRegistry).toBe(true);
    });
    it('Country with code AO should return ibanRegistry false', () => {
      expect(ext['AO']?.ibanRegistry).toBe(false);
    });
    it('Country with code NL should return SEPA true', () => {
      expect(ext['NL']?.sepa).toBe(true);
    });
    it('Country with code PK should return SEPA false', () => {
      expect(ext['PK']?.sepa).toBe(false);
    });
    it('Country with code NO should have extra BBAN valication function', () => {
      expect(iban.countrySpecs['NO']?.bbanValidator).not.toBeNull();
    });
  });
});
