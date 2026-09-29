import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';
import { COUNTRY_CODES } from '../src/countries/codes';
import { ibanSpecs } from '../src/countries/specs';

describe('countries', () => {
  describe('countrySpecs', () => {
    const specs = iban.countrySpecs;
    it.each(['BI', 'DJ', 'FK'])('%s should be in IBAN registry', (code) => {
      expect(specs[code]?.ibanRegistry).toBe(true);
    });
    it.each(['EG', 'VA'])('%s BBAN regexp should reject extra characters', (code) => {
      expect(specs[code]?.bbanRegExp?.test('0'.repeat(30))).toBe(false);
    });
  });

  describe('When calling isSEPACountry()', () => {
    it.each<[string | null | undefined, boolean]>([
      ['NL', true],
      [undefined, false],
      ['PK', false],
      ['XX', false],
    ])('isSEPACountry(%s)', (countryCode, expected) => {
      expect(iban.isSEPACountry(countryCode)).toBe(expected);
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

  describe('countrySpecs', () => {
    const ext = iban.countrySpecs;
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

describe('SEPA membership', () => {
  // The EPC list of SEPA scheme countries, EPC409-09 v8.0 (December 2025): EU and EEA members, the eleven non-EEA
  // countries (Albania, Andorra, Moldova, Monaco, Montenegro, North Macedonia, San Marino, Serbia, Switzerland,
  // the United Kingdom, Vatican), Gibraltar, Åland and the French territories. Guernsey, Jersey and the Isle of Man
  // use GB IBANs, and the Canary Islands, Azores and Madeira use ES and PT.
  const SEPA = `AD AL AT AX BE BG BL CH CY CZ DE DK EE ES FI FR GB GF GI GP GR HR HU IE IS IT LI LT LU LV MC MD ME MF MK MQ MT NL NO PL PM PT RE RO RS SE SI SK SM VA YT`;
  it('matches the SEPA country list', () => {
    const specs = iban.countrySpecs;
    const sepa = Object.keys(specs).filter((code) => specs[code]?.sepa === true);
    expect(sepa).toEqual(SEPA.split(' '));
  });
});

describe('per-country modules', () => {
  it('CH exports the same frozen spec as ibanSpecs', async () => {
    const { CH } = await import('../src/countries/CH');
    expect(CH).toBe(ibanSpecs['CH']);
    expect(Object.isFrozen(CH)).toBe(true);
  });
});
