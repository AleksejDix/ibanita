/// <reference types="node" />
import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { type IBANParts } from '../src/index';

const REGISTRY_DIR = join(__dirname, '..', 'registry');

function registryVersion(file: string): number {
  return Number(/\d+/u.exec(file)?.[0] ?? 0);
}

function latestRegistryFile(): string {
  const files = readdirSync(REGISTRY_DIR).filter((file) => /^iban-registry-v\d+\.txt$/u.test(file));
  files.sort((left, right) => registryVersion(right) - registryVersion(left));
  return join(REGISTRY_DIR, files[0] ?? '');
}

function readRow(rows: readonly string[], name: string): string[] {
  const row = rows.find((line) => line.startsWith(`${name}\t`));
  return (row ?? '').split('\t').map((cell) => cell.trim());
}

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

const lines = readFileSync(latestRegistryFile(), 'utf8').split(/\r?\n/u);
const codes = readRow(lines, 'IBAN prefix country code (ISO 3166)').slice(1);
const ibanExamples = readRow(lines, 'IBAN electronic format example').slice(1);
const bankPositions = readRow(lines, 'Bank identifier position within the BBAN').slice(1);
const branchPositions = readRow(lines, 'Branch identifier position within the BBAN').slice(1);
const bbanStructures = readRow(lines, 'BBAN structure').slice(1);
const ibanLengths = readRow(lines, 'IBAN length').slice(1);
const sepaFlags = readRow(lines, 'SEPA country').slice(1);

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
const specs = iban.getCountrySpecifications();

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

  it.each(formats.map(([code, , , sepa]) => [code, sepa] as const))(
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
