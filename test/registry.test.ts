/// <reference types="node" />
import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';
import { registryExamples, registryRow } from './registry-file';
import { type IBANParts } from '../src/index';
import { ibanSpecs } from '../src/countries/specs';

// Registry positions are 1-based and inclusive, counted within the BBAN.
function slicePosition(electronicIban: string, position: string): string | undefined {
  const match = /^(\d+)-(\d+)$/u.exec(position);
  return match ? electronicIban.slice(3 + Number(match[1]), 4 + Number(match[2])) : undefined;
}

function parts(example: string): IBANParts {
  const result = iban.extractIBAN(example);
  if (!result.valid) {
    throw new Error(`${example} is not a valid IBAN`);
  }
  return result;
}

const codes = registryRow('IBAN prefix country code (ISO 3166)');
const ibanExamples = registryRow('IBAN electronic format example');
const bankPositions = registryRow('Bank identifier position within the BBAN');
const branchPositions = registryRow('Branch identifier position within the BBAN');
const bbanStructures = registryRow('BBAN structure');
const ibanLengths = registryRow('IBAN length');
const sepaFlags = registryRow('SEPA country');

// Registry field types, following the library convention of upper case letters only.
const FIELD_CLASSES = new Map([
  ['n', '[0-9]'],
  ['a', '[A-Z]'],
  ['c', '[A-Z0-9]'],
]);

// Converts registry notation such as 4!n12!c into an anchored pattern with one character class per position.
function structureToPattern(structure: string): string {
  const classes = structure.replace(/(\d+)!([nac])/gu, (_match, count: string, type: string) =>
    (FIELD_CLASSES.get(type) ?? '?').repeat(Number(count)),
  );
  return `^${classes}$`;
}

// Expands a library pattern such as ^[0-9]{16}$ into one character class per position, for comparison.
function expandPattern(pattern: string): string {
  return pattern.replace(/(\[[^\]]+\])\{(\d+)\}/gu, (_match, charClass: string, count: string) =>
    charClass.repeat(Number(count)),
  );
}

// Each row: country code, BBAN pattern, IBAN length and SEPA membership from the registry.
const formats = codes.map((code, index): readonly [string, string, number, boolean] => [
  code,
  structureToPattern(bbanStructures[index] ?? ''),
  Number(ibanLengths[index]),
  sepaFlags[index] === 'Yes',
]);
const specs = iban.countrySpecs;

// Each row: country code, example IBAN, bank identifier and branch identifier at the registry positions.
const examples = codes.map((code, index): readonly [string, string, string | undefined, string | undefined] => {
  const example = (ibanExamples[index] ?? '').replace(/\s/gu, '');
  return [
    code,
    example,
    slicePosition(example, bankPositions[index] ?? ''),
    slicePosition(example, branchPositions[index] ?? ''),
  ];
});

// Deliberate deviations from the registry: SI splits its 5-digit bank code into bank and branch,
// and FR has a branch identifier the registry does not define.
const BANK_DEVIATIONS = new Set(['SI']);
const BRANCH_DEVIATIONS = new Set(['FR', 'SI']);
// In the SEPA scope per the EPC list (EPC409-09 v8.0) before the SWIFT registry recorded it.
const SEPA_DEVIATIONS = new Set(['AL', 'MD', 'ME', 'MK', 'RS']);

describe('SWIFT IBAN Registry examples', () => {
  it('should contain all registry countries', () => {
    expect(examples.length).toBeGreaterThan(80);
  });

  it.each(formats)('%s should match the registry BBAN structure', (code, pattern) => {
    expect(expandPattern(specs[code]?.bbanRegExp?.source ?? '')).toBe(pattern);
  });

  it.each(formats)('%s should match the registry IBAN length', (code, _pattern, length) => {
    expect(specs[code]?.ibanLength).toBe(length);
  });

  it.each(formats.filter(([code]) => !SEPA_DEVIATIONS.has(code)).map(([code, , , sepa]) => [code, sepa] as const))(
    '%s should match the registry SEPA flag',
    (code, sepa) => {
      expect(specs[code]?.sepa).toBe(sepa);
    },
  );

  it.each(codes)('%s should be flagged as an IBAN registry country', (code) => {
    expect(specs[code]?.ibanRegistry).toBe(true);
  });

  it.each(examples)('%s example IBAN should be valid', (_code, example) => {
    expect(iban.validateIBAN(example)).toEqual({ valid: true, errorCodes: [] });
  });

  it.each(examples.filter(([code]) => !BANK_DEVIATIONS.has(code)))(
    '%s example should extract the bank identifier at the registry position',
    (_code, example, bank) => {
      expect(parts(example).bankIdentifier).toBe(bank);
    },
  );

  it.each(
    examples
      .filter(([code]) => !BRANCH_DEVIATIONS.has(code))
      .map(([code, example, , branch]) => [code, example, branch]),
  )('%s example should extract the branch identifier at the registry position', (_code, example, branch) => {
    expect(parts(example).branchIdentifier).toBe(branch);
  });
});

describe('SWIFT IBAN Registry examples, mutated', () => {
  const Errors = iban.IBANValidationError;
  const changeCheckDigits = (example: string): string =>
    example.slice(0, 2) + String((Number(example.slice(2, 4)) + 1) % 100).padStart(2, '0') + example.slice(4);
  // Changes the last BBAN character to another one of the same kind, so the format stays valid.
  const changeLastCharacter = (example: string): string => {
    const last = example.at(-1) ?? '0';
    if (/[0-9]/u.test(last)) {
      return example.slice(0, -1) + String((Number(last) + 1) % 10);
    }
    return example.slice(0, -1) + (last === 'Z' ? 'A' : String.fromCharCode(last.charCodeAt(0) + 1));
  };

  it.each(registryExamples)('%s with changed check digits is rejected', (_code, example) => {
    expect(iban.validateIBAN(changeCheckDigits(example)).errorCodes).toContain(Errors.WrongIBANChecksum);
  });

  it.each(registryExamples)('%s with a changed BBAN character is rejected', (_code, example) => {
    expect(iban.isValidIBAN(changeLastCharacter(example))).toBe(false);
  });

  it.each(registryExamples)('%s with an extra character is rejected', (_code, example) => {
    expect(iban.validateIBAN(`${example}0`).errorCodes).toContain(Errors.WrongBBANLength);
  });
});

describe('SWIFT IBAN Registry examples, round trips', () => {
  const tools = iban.withCountries(ibanSpecs);

  it.each(registryExamples)('%s composes back to itself', (code, example) => {
    expect(iban.composeIBAN(code, example.slice(4))).toBe(example);
  });

  it.each(registryExamples)('%s extracts parts that compose back to itself', (_code, example) => {
    const extracted = parts(example);
    expect(iban.composeIBAN(extracted.countryCode, extracted.bban)).toBe(example);
  });

  it.each(registryExamples)('%s survives friendly then electronic formatting', (_code, example) => {
    expect(iban.electronicFormat(iban.friendlyFormatIBAN(example))).toBe(example);
    expect(iban.electronicFormat(iban.friendlyFormatIBAN(example, '-'))).toBe(example);
  });

  it.each(registryExamples)('%s gives the same results through withCountries', (code, example) => {
    expect(tools.validateIBAN(example)).toEqual(iban.validateIBAN(example));
    expect(tools.extractIBAN(example)).toEqual(iban.extractIBAN(example));
    expect(tools.validateBBAN(example.slice(4), code)).toEqual(iban.validateBBAN(example.slice(4), code));
    expect(tools.isSEPACountry(code)).toBe(iban.isSEPACountry(code));
  });
});
