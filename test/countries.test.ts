import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';
import { COUNTRY_CODES } from '../src/countries/codes';
import { ibanSpecs } from '../src/countries/specs';

const specs = iban.countrySpecs;

describe('countrySpecs', () => {
  it('lists every country code, with an empty spec for countries without IBAN', () => {
    expect(Object.keys(specs).sort()).toEqual([...COUNTRY_CODES].sort());
    expect(specs['AF']).toEqual({});
    expect(specs['US']).toEqual({});
  });

  it('shares the spec objects with ibanSpecs', () => {
    for (const code of Object.keys(ibanSpecs)) {
      expect(specs[code], code).toBe(ibanSpecs[code]);
    }
  });

  it('is frozen, down to each spec', () => {
    expect(Object.isFrozen(specs)).toBe(true);
    for (const code of Object.keys(specs)) {
      expect(Object.isFrozen(specs[code]), code).toBe(true);
    }
  });

  it.each<[string, Partial<iban.IBANCountrySpec>]>([
    ['BE', { ibanLength: 16, ibanRegistry: true, sepa: true }],
    ['AL', { ibanLength: 28, bbanRegExp: /^[0-9]{8}[A-Z0-9]{16}$/u, ibanRegistry: true, sepa: true }],
    ['AO', { ibanLength: 25, ibanRegistry: false, sepa: false }],
    ['BA', { ibanRegistry: true, sepa: false }],
    ['PK', { ibanRegistry: true, sepa: false }],
    ['BI', { ibanRegistry: true }],
    ['DJ', { ibanRegistry: true }],
    ['FK', { ibanRegistry: true }],
  ])('%s', (code, expected) => {
    expect(specs[code]).toMatchObject(expected);
  });

  it.each(['EG', 'VA'])('%s pattern rejects extra characters', (code) => {
    expect(specs[code]?.bbanRegExp?.test('0'.repeat(30))).toBe(false);
  });

  it.each<[string, string | undefined]>([
    ['NO', 'checkNorwayBBAN'],
    ['MC', 'checkFrenchBBAN'],
    ['SK', 'checkCzechAndSlovakBBAN'],
    ['DE', undefined],
  ])('%s national validator', (code, name) => {
    expect(specs[code]?.bbanValidator?.name).toBe(name);
  });
});

describe('account positions', () => {
  // RU is excluded: its registry "branch" is the first part of the 20-digit account number.
  const codes = Object.keys(specs).filter((code) => code !== 'RU' && specs[code]?.accountPosition !== undefined);
  it.each(codes)('%s account range follows bank and branch and fits the IBAN', (code) => {
    const spec = specs[code] ?? {};
    const [start, end] = spec.accountPosition ?? [0, 0];
    const identifierEnds = [spec.bankPosition, spec.branchPosition].map((range) =>
      range === undefined ? 3 : range[1] + 4,
    );
    expect(start).toBeGreaterThan(Math.max(...identifierEnds));
    expect(end).toBeLessThanOrEqual(spec.ibanLength ?? 0);
  });
});

describe('SEPA membership', () => {
  // The EPC list of SEPA scheme countries, EPC409-09 v8.0 (December 2025): EU and EEA members, the eleven non-EEA
  // countries (Albania, Andorra, Moldova, Monaco, Montenegro, North Macedonia, San Marino, Serbia, Switzerland,
  // the United Kingdom, Vatican), Gibraltar, Åland and the French territories. Guernsey, Jersey and the Isle of Man
  // use GB IBANs, and the Canary Islands, Azores and Madeira use ES and PT.
  const SEPA = `AD AL AT AX BE BG BL CH CY CZ DE DK EE ES FI FR GB GF GI GP GR HR HU IE IS IT LI LT LU LV MC MD ME MF MK MQ MT NL NO PL PM PT RE RO RS SE SI SK SM VA YT`;

  it('matches the EPC list', () => {
    expect(Object.keys(specs).filter((code) => specs[code]?.sepa === true)).toEqual(SEPA.split(' '));
  });

  it.each<[string | null | undefined, boolean]>([
    ['NL', true],
    ['ch', true],
    [' CH ', true],
    ['c-h', true],
    ['PK', false],
    ['ua', false],
    ['XX', false],
    [undefined, false],
    [null, false],
  ])('isSEPACountry(%j)', (input, expected) => {
    expect(iban.isSEPACountry(input)).toBe(expected);
  });
});

describe('per-country modules', () => {
  it('CH exports the same frozen spec as ibanSpecs', async () => {
    const { CH } = await import('../src/countries/CH');
    expect(CH).toBe(ibanSpecs['CH']);
  });
});
