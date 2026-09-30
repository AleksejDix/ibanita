/// <reference types="node" />
// Generates the country table in README.md from the official documents and the library itself.
// The test fails when README.md is out of date; `npm run readme` rewrites it.
import * as iban from '../src/index';
import {
  BANK_DEVIATIONS,
  BRANCH_DEVIATIONS,
  EPC_LIST,
  EPC_SEPA,
  REGISTRY_RELEASE,
  REGISTRY_TERRITORIES,
  expandPattern,
  patternToStructure,
  registryRow,
  slicePosition,
  structureToPattern,
} from './sources';
import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const README = join(__dirname, '..', 'README.md');
const START = '<!-- country-table:start -->';
const END = '<!-- country-table:end -->';
const OK = '✓';
const FAIL = '✗';
const NONE = '–';

const names = new Intl.DisplayNames(['en'], { type: 'region' });
const registryCodes = registryRow('IBAN prefix country code (ISO 3166)');

/** Registry entry of a country, following REGISTRY_TERRITORIES for territories listed under another country. */
function registryEntry(code: string): { readonly entry: string; readonly index: number } | undefined {
  const entry = registryCodes.includes(code) ? code : REGISTRY_TERRITORIES.get(code);
  if (entry === undefined) {
    return undefined;
  }
  return { entry, index: registryCodes.indexOf(entry) };
}

function cell(index: number, row: string): string {
  return registryRow(row)[index] ?? '';
}

const mark = (passed: boolean, note = ''): string => (passed ? OK : FAIL) + note;

interface Row {
  readonly cells: readonly string[];
  readonly failed: boolean;
}

function countryRow(code: string): Row {
  const spec = iban.countrySpecs[code] ?? {};
  const pattern = spec.bbanRegExp?.source ?? '';
  const source = registryEntry(code);
  const checks: string[] = [];

  if (source === undefined) {
    checks.push(NONE, NONE, NONE, NONE);
  } else {
    const { entry, index } = source;
    const territory = entry !== code;
    checks.push(mark(spec.ibanLength === Number(cell(index, 'IBAN length'))));
    checks.push(mark(expandPattern(pattern) === structureToPattern(cell(index, 'BBAN structure'))));
    if (territory) {
      // The registry example belongs to the parent entry; check that the territory accepts the same BBAN format.
      const example = cell(index, 'IBAN electronic format example').replace(/\s/gu, '');
      const composed = iban.composeIBAN(code, example.slice(4));
      checks.push(mark(composed !== null && iban.isValidIBAN(composed)));
      checks.push(NONE);
    } else {
      const example = cell(index, 'IBAN electronic format example').replace(/\s/gu, '');
      const parts = iban.extractIBAN(example);
      checks.push(mark(parts.valid));
      const bank = slicePosition(example, cell(index, 'Bank identifier position within the BBAN'));
      const branch = slicePosition(example, cell(index, 'Branch identifier position within the BBAN'));
      const deviation = BANK_DEVIATIONS.has(code) || BRANCH_DEVIATIONS.has(code);
      const identifiersMatch =
        parts.valid &&
        (BANK_DEVIATIONS.has(code) || parts.bankIdentifier === bank) &&
        (BRANCH_DEVIATIONS.has(code) || parts.branchIdentifier === branch);
      checks.push(mark(identifiersMatch, deviation ? ' ¹' : ''));
    }
  }

  const registrySepa = source === undefined ? undefined : cell(source.index, 'SEPA country') === 'Yes';
  const sepaNote = source !== undefined && source.entry === code && registrySepa !== EPC_SEPA.has(code) ? ' ²' : '';
  checks.push(mark(spec.sepa === EPC_SEPA.has(code), sepaNote));

  let registry = 'no ³';
  if (source !== undefined) {
    registry = source.entry === code ? 'yes' : `in ${source.entry}`;
  }
  const cells = [
    names.of(code) ?? code,
    `\`${code}\``,
    String(spec.ibanLength ?? ''),
    `\`${patternToStructure(pattern)}\``,
    spec.sepa === true ? 'yes' : 'no',
    registry,
    ...checks,
  ];
  return { cells, failed: checks.some((check) => check.startsWith(FAIL)) };
}

const codes = Object.keys(iban.countrySpecs)
  .filter((code) => iban.countrySpecs[code]?.ibanLength !== undefined)
  .sort((left, right) => (names.of(left) ?? left).localeCompare(names.of(right) ?? right));
const rows = codes.map((code) => countryRow(code));

const inRegistry = codes.filter((code) => registryCodes.includes(code)).length;
const territories = codes.filter((code) => REGISTRY_TERRITORIES.has(code)).length;
const outside = codes.length - inRegistry - territories;
const parents = [...new Set(codes.flatMap((code) => REGISTRY_TERRITORIES.get(code) ?? []))]
  .sort()
  .map((code) => `\`${code}\``);

const table = [
  START,
  '',
  `${codes.length} countries and territories. ${inRegistry} have their own entry in SWIFT IBAN Registry release ${REGISTRY_RELEASE}, ${territories} are territories the registry lists under the ${parents.join(' and ')} entries, and ${outside} use IBAN outside the registry. SEPA membership is checked against the ${EPC_LIST}.`,
  '',
  'The first six columns are the library data. The last five are checked by `test/readme.test.ts` against the official documents on every CI run, so this table cannot drift from them:',
  '',
  '- **Length**, **Structure**: the IBAN length and BBAN structure match the registry entry.',
  '- **Example**: the registry example IBAN validates. For a territory, the parent entry example BBAN composes into a valid IBAN for the territory.',
  '- **Bank / branch**: the bank and branch identifiers extracted from the example are the ones at the registry positions.',
  '- **SEPA**: the library flag matches the EPC list.',
  '',
  `${OK} checked and matching, ${NONE} no official source for this check.`,
  '',
  '| Country | Code | Length | BBAN | SEPA | Registry | Length ✓ | Structure ✓ | Example ✓ | Bank / branch ✓ | SEPA ✓ |',
  '|---|---|--:|---|---|---|:-:|:-:|:-:|:-:|:-:|',
  ...rows.map((row) => `| ${row.cells.join(' | ')} |`),
  '',
  '¹ Deliberate deviation: France also has a branch identifier, and Slovenia splits its five-digit bank code into bank and branch. Both identifiers are checked against the national layout instead.',
  `² In the SEPA scope per the ${EPC_LIST}, while SWIFT IBAN Registry release ${REGISTRY_RELEASE} still lists the country as not SEPA.`,
  '³ Not in the SWIFT IBAN Registry. The format follows the national IBAN standard and is not checked against an official document.',
  '',
  END,
].join('\n');

describe('README country table', () => {
  it('has no failed check', () => {
    expect(rows.filter((row) => row.failed).map((row) => row.cells[1])).toEqual([]);
  });

  it('is up to date', () => {
    const readme = readFileSync(README, 'utf8');
    const start = readme.indexOf(START);
    const end = readme.indexOf(END);
    expect(start, 'README.md has no country table markers').toBeGreaterThanOrEqual(0);
    const current = readme.slice(start, end + END.length);
    if (process.env['UPDATE_README'] === '1' && current !== table) {
      writeFileSync(README, readme.slice(0, start) + table + readme.slice(end + END.length));
      return;
    }
    expect(current, 'README.md country table is out of date; run npm run readme').toBe(table);
  });
});
