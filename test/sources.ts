/// <reference types="node" />
// The official documents the country data is checked against: the newest SWIFT IBAN Registry file in registry/,
// and the EPC list of SEPA scheme countries.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const REGISTRY_DIR = join(__dirname, '..', 'registry');

function registryVersion(file: string): number {
  return Number(/\d+/u.exec(file)?.[0] ?? 0);
}

function latestRegistryFile(): string {
  const files = readdirSync(REGISTRY_DIR).filter((file) => /^iban-registry-v\d+\.txt$/u.test(file));
  files.sort((left, right) => registryVersion(right) - registryVersion(left));
  return files[0] ?? '';
}

/** File name of the registry release the data is checked against, such as `iban-registry-v103.txt`. */
export const REGISTRY_FILE: string = latestRegistryFile();
/** Release number of that registry file. */
export const REGISTRY_RELEASE: number = registryVersion(REGISTRY_FILE);

const lines = readFileSync(join(REGISTRY_DIR, REGISTRY_FILE), 'utf8').split(/\r?\n/u);

/** One registry row, one cell per country, in registry column order. */
export function registryRow(name: string): string[] {
  const row = lines.find((line) => line.startsWith(`${name}\t`));
  return (row ?? '')
    .split('\t')
    .map((cell) => cell.trim().replace(/^"|"$/gu, ''))
    .slice(1);
}

/** Country code and electronic-format example IBAN of every registry country. */
export const registryExamples: readonly (readonly [code: string, example: string])[] = registryRow(
  'IBAN prefix country code (ISO 3166)',
).map(
  (code, index) => [code, (registryRow('IBAN electronic format example')[index] ?? '').replace(/\s/gu, '')] as const,
);

/** Territories the registry lists under another country's entry, mapped to that entry: AX to FI, GF to FR, ... */
function territories(): Map<string, string> {
  const map = new Map<string, string>();
  const includes = registryRow('Country code includes other countries/territories');
  registryRow('IBAN prefix country code (ISO 3166)').forEach((code, index) => {
    for (const territory of (includes[index] ?? '').match(/\b[A-Z]{2}\b/gu) ?? []) {
      map.set(territory, code);
    }
  });
  return map;
}

/** Territories the registry lists under another country's entry, mapped to that entry: AX to FI, GF to FR, ... */
export const REGISTRY_TERRITORIES: ReadonlyMap<string, string> = territories();

// Registry field types, following the library convention of upper case letters only.
const FIELD_CLASSES = new Map([
  ['n', '[0-9]'],
  ['a', '[A-Z]'],
  ['c', '[A-Z0-9]'],
]);

/** Converts registry notation such as 4!n12!c into an anchored pattern with one character class per position. */
export function structureToPattern(structure: string): string {
  const classes = structure.replace(/(\d+)!([nac])/gu, (_match, count: string, type: string) =>
    (FIELD_CLASSES.get(type) ?? '?').repeat(Number(count)),
  );
  return `^${classes}$`;
}

/** Expands a library pattern such as ^[0-9]{16}$ into one character class per position, for comparison. */
export function expandPattern(pattern: string): string {
  return pattern.replace(/(\[[^\]]+\])\{(\d+)\}/gu, (_match, charClass: string, count: string) =>
    charClass.repeat(Number(count)),
  );
}

/** Writes a library pattern in registry notation, such as 4!n12!c. */
export function patternToStructure(pattern: string): string {
  const type = new Map<string, string>();
  for (const [key, value] of FIELD_CLASSES) {
    type.set(value, key);
  }
  let structure = '';
  for (const match of pattern.matchAll(/(\[[^\]]+\])\{(\d+)\}/gu)) {
    structure += `${match[2] ?? ''}!${type.get(match[1] ?? '') ?? '?'}`;
  }
  return structure;
}

/** Registry positions are 1-based and inclusive, counted within the BBAN. Returns that part of an IBAN. */
export function slicePosition(electronicIban: string, position: string): string | undefined {
  const match = /^(\d+)-(\d+)$/u.exec(position);
  return match ? electronicIban.slice(3 + Number(match[1]), 4 + Number(match[2])) : undefined;
}

/** Deliberate deviations from the registry: SI splits its 5-digit bank code into bank and branch. */
export const BANK_DEVIATIONS: ReadonlySet<string> = new Set(['SI']);
/** Deliberate deviations from the registry: FR has a branch identifier the registry does not define, SI as above. */
export const BRANCH_DEVIATIONS: ReadonlySet<string> = new Set(['FR', 'SI']);

/** Version of the EPC list of SEPA scheme countries that SEPA membership is checked against. */
export const EPC_LIST = 'EPC list of SEPA scheme countries (EPC409-09 v8.0, 24 December 2025)';

/**
 * IBAN country codes in the SEPA schemes' geographical scope, per the EPC list: EU and EEA members, the eleven
 * non-EEA countries, Gibraltar, Åland and the French territories. Guernsey, Jersey and the Isle of Man use GB IBANs,
 * and the Canary Islands, Azores and Madeira use ES and PT.
 */
export const EPC_SEPA: ReadonlySet<string> = new Set(
  'AD AL AT AX BE BG BL CH CY CZ DE DK EE ES FI FR GB GF GI GP GR HR HU IE IS IT LI LT LU LV MC MD ME MF MK MQ MT NL NO PL PM PT RE RO RS SE SI SK SM VA YT'.split(
    ' ',
  ),
);
