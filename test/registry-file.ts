/// <reference types="node" />
// Reads the newest SWIFT IBAN Registry file in registry/, for tests that check the library against it.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const REGISTRY_DIR = join(__dirname, '..', 'registry');

function registryVersion(file: string): number {
  return Number(/\d+/u.exec(file)?.[0] ?? 0);
}

function latestRegistryFile(): string {
  const files = readdirSync(REGISTRY_DIR).filter((file) => /^iban-registry-v\d+\.txt$/u.test(file));
  files.sort((left, right) => registryVersion(right) - registryVersion(left));
  return join(REGISTRY_DIR, files[0] ?? '');
}

const lines = readFileSync(latestRegistryFile(), 'utf8').split(/\r?\n/u);

/** One registry row, one cell per country, in registry column order. */
export function registryRow(name: string): string[] {
  const row = lines.find((line) => line.startsWith(`${name}\t`));
  return (row ?? '')
    .split('\t')
    .map((cell) => cell.trim())
    .slice(1);
}

/** Country code and electronic-format example IBAN of every registry country. */
export const registryExamples: readonly (readonly [code: string, example: string])[] = registryRow(
  'IBAN prefix country code (ISO 3166)',
).map(
  (code, index) => [code, (registryRow('IBAN electronic format example')[index] ?? '').replace(/\s/gu, '')] as const,
);
