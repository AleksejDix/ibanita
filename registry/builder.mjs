#!/usr/bin/env node
/**
 * IBAN Registry Builder
 *
 * Parses the newest SWIFT IBAN Registry TXT file in this folder and generates
 * one file per country in src/countries, plus the specs.ts, codes.ts and all.ts barrels,
 * by merging the hand-maintained overrides.mjs over the registry values.
 *
 * Usage:
 *   npm run registry          (runs this script and formats the output)
 *   node registry/builder.mjs [--output path]
 *
 * Options:
 *   --output dir    Output directory (default: src/countries)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { names, overrides } from './overrides.mjs';
import { countryCodes } from './country-codes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const args = process.argv.slice(2);
let outputDir = path.join(__dirname, '..', 'src', 'countries');

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--output' && args[i + 1]) {
    outputDir = args[i + 1];
    i++;
  }
}

/**
 * Convert BBAN structure notation to regex, merging adjacent fields of the same type
 * e.g., "4!n4!n12!c" -> "^[0-9]{8}[A-Z0-9]{12}$"
 */
function structureToRegex(structure) {
  const runs = [];
  for (const [, amount, type] of structure.matchAll(/(\d+)!(.)/g)) {
    let range = '[A-Z0-9]';
    if (type === 'n') range = '[0-9]';
    else if (type === 'a') range = '[A-Z]';
    const last = runs.at(-1);
    if (last && last.range === range) last.amount += parseInt(amount, 10);
    else runs.push({ range, amount: parseInt(amount, 10) });
  }
  return `^${runs.map(({ range, amount }) => `${range}{${amount}}`).join('')}$`;
}

/**
 * Find the latest iban-registry-vXXX.txt file in the registry folder
 */
function findLatestRegistry() {
  const files = fs.readdirSync(__dirname);
  const registryFiles = files
    .filter((f) => /^iban-registry-v\d+\.txt$/.test(f))
    .sort((a, b) => {
      const versionA = parseInt(a.match(/v(\d+)/)[1], 10);
      const versionB = parseInt(b.match(/v(\d+)/)[1], 10);
      return versionB - versionA; // Descending order (latest first)
    });

  if (registryFiles.length === 0) {
    throw new Error('No iban-registry-vXXX.txt file found in registry folder');
  }

  return path.join(__dirname, registryFiles[0]);
}

/**
 * Parse SWIFT TXT registry file
 */
function parseRegistry(txtPath) {
  console.log(`Using: ${path.basename(txtPath)}`);

  const rawContent = fs.readFileSync(txtPath, 'latin1');

  // Join lines that are continuations (handle quoted multi-line values)
  const lines = [];
  let currentLine = '';

  for (const line of rawContent.split('\n')) {
    if (line.startsWith('"\t') && currentLine) {
      currentLine += line.slice(1);
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = line;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  const result = [];

  lines.forEach((line) => {
    const data = line.split('\t').map((e) => e.trim().replace(/^"|"$/g, ''));
    const key = data[0];
    const values = data.slice(1);

    if (key === 'Name of country') {
      values.forEach((el, i) => {
        result[i] = { country_name: el };
      });
    }
    if (key === 'IBAN prefix country code (ISO 3166)') {
      values.forEach((el, i) => {
        if (result[i]) result[i].code = el;
      });
    }
    if (key === 'SEPA country') {
      values.forEach((el, i) => {
        if (result[i]) result[i].sepa = el === 'Yes';
      });
    }
    if (key === 'IBAN length') {
      values.forEach((el, i) => {
        if (result[i]) result[i].ibanLength = parseInt(el, 10);
      });
    }
    if (key === 'BBAN structure') {
      values.forEach((el, i) => {
        if (result[i]) {
          result[i].bbanPattern = structureToRegex(el);
        }
      });
    }
    if (key === 'Bank identifier position within the BBAN') {
      values.forEach((el, i) => {
        if (result[i] && el !== 'N/A' && el !== '') {
          const parts = el.split('-').map((n) => parseInt(n, 10) - 1);
          result[i].bankPosition = parts;
        }
      });
    }
    if (key === 'Branch identifier position within the BBAN') {
      values.forEach((el, i) => {
        if (result[i] && el !== 'N/A' && el !== '') {
          const parts = el.split('-').map((n) => parseInt(n, 10) - 1);
          result[i].branchPosition = parts;
        }
      });
    }
    if (key === 'IBAN electronic format example') {
      values.forEach((el, i) => {
        if (result[i]) result[i].iban_example = el;
      });
    }
  });

  return result.filter((s) => s.code).sort((a, b) => a.code.localeCompare(b.code));
}

/** Validator export name to its module in src/validators. */
const VALIDATOR_MODULES = {
  checkBelgianBBAN: 'be',
  checkCroatianBBAN: 'hr',
  checkCzechAndSlovakBBAN: 'cz-sk',
  checkEstonianBBAN: 'ee',
  checkFrenchBBAN: 'fr',
  checkHungarianBBAN: 'hu',
  checkMod9710BBAN: 'mod97-10',
  checkNorwayBBAN: 'no',
  checkPolandBBAN: 'pl',
  checkSpainBBAN: 'es',
};

/** Overrides that deliberately differ from the registry. Any other difference is an error. */
const DEVIATIONS = new Set([
  'SI.bankPosition',
  'SI.branchPosition',
  'FR.branchPosition',
  // In the EPC SEPA scope (EPC409-09 v8.0) but still 'No' in the SWIFT registry
  'AL.sepa',
  'MD.sepa',
  'ME.sepa',
  'MK.sepa',
  'RS.sepa',
]);

/**
 * Merge the hand-maintained overrides over the registry data, one entry per country.
 */
function mergeSpecs(registrySpecs) {
  const byCode = Object.fromEntries(registrySpecs.map((spec) => [spec.code, spec]));
  const codes = [...new Set([...Object.keys(byCode), ...Object.keys(overrides)])].sort();
  return codes.map((code) => {
    const registry = byCode[code];
    const override = overrides[code] ?? {};
    for (const key of Object.keys(override)) {
      const differs = registry && key in registry && JSON.stringify(registry[key]) !== JSON.stringify(override[key]);
      if (differs && !DEVIATIONS.has(`${code}.${key}`)) {
        throw new Error(`${code}.${key}: override ${JSON.stringify(override[key])} conflicts with registry ${JSON.stringify(registry[key])}`);
      }
    }
    const merged = { code, ibanRegistry: registry !== undefined, sepa: false, ...registry, ...override };
    merged.name = registry?.country_name ?? names[code];
    if (!merged.name) throw new Error(`${code}: no country name; add it to names in overrides.mjs`);
    if (!countryCodes.includes(code)) throw new Error(`${code}: not in country-codes.mjs`);
    if (merged.bbanValidator && !(merged.bbanValidator in VALIDATOR_MODULES)) {
      throw new Error(`${code}: unknown validator ${merged.bbanValidator}`);
    }
    return merged;
  });
}

const HEADER = (registryFile) =>
  `// Generated by registry/builder.mjs from ${registryFile} and overrides.mjs. Do not edit; run \`npm run registry\` instead.\n\n`;

/** Generate src/countries/<CC>.ts: the specification of one country. */
function generateCountry(spec, registryFile) {
  const position = (value) => `[${value.join(', ')}]`;
  let output = HEADER(registryFile);
  output += "import { type IBANCountrySpec } from '../core/types';\n";
  if (spec.bbanValidator) output += `import { ${spec.bbanValidator} } from '../validators/${VALIDATOR_MODULES[spec.bbanValidator]}';\n`;
  output += '\n';
  output += `/** ${spec.name} */\n`;
  output += `export const ${spec.code}: IBANCountrySpec = Object.freeze<IBANCountrySpec>({\n`;
  output += `  ibanLength: ${spec.ibanLength},\n`;
  output += `  bbanRegExp: /${spec.bbanPattern}/u,\n`;
  output += `  ibanRegistry: ${spec.ibanRegistry},\n`;
  output += `  sepa: ${spec.sepa},\n`;
  if (spec.bankPosition) output += `  bankPosition: ${position(spec.bankPosition)},\n`;
  if (spec.branchPosition) output += `  branchPosition: ${position(spec.branchPosition)},\n`;
  if (spec.accountPosition) output += `  accountPosition: ${position(spec.accountPosition)},\n`;
  if (spec.bbanValidator) output += `  bbanValidator: ${spec.bbanValidator},\n`;
  output += '});\n';
  return output;
}

/** Generate src/countries/specs.ts: every IBAN country collected in ibanSpecs. */
function generateSpecs(specs, registryFile) {
  let output = HEADER(registryFile);
  output += "import type * as Types from '../core/types';\n";
  for (const spec of specs) output += `import { ${spec.code} } from './${spec.code}';\n`;
  output += '\n';
  output += '/**\n';
  output += ' * IBAN format rules, national BBAN validation, identifier positions and SEPA membership\n';
  output += ' * for every country that uses IBAN. Positions are 0-based and inclusive: bank and branch\n';
  output += ' * within the BBAN, account within the IBAN.\n';
  output += ' */\n';
  output += 'export const ibanSpecs: Readonly<Record<string, Types.IBANCountrySpec>> = Object.freeze({\n';
  output += specs.map((spec) => `  ${spec.code},\n`).join('');
  output += '});\n';
  return output;
}

/** Generate src/countries/codes.ts: every country code, for BIC validation. */
function generateCodes(registryFile) {
  let output = HEADER(registryFile);
  output += '/**\n';
  output += ' * ISO 3166-1 alpha-2 codes of all countries known to the library, including countries without IBAN.\n';
  output += ' * Kept separate from the country specifications so BIC validation does not bundle the IBAN data.\n';
  output += ' */\n';
  output += 'export const COUNTRY_CODES: ReadonlySet<string> = new Set(\n';
  output += '  `';
  for (let i = 0; i < countryCodes.length; i += 20) output += (i ? '\n  ' : '') + countryCodes.slice(i, i + 20).join(' ');
  output += '`.split(/\\s+/u),\n';
  output += ');\n';
  return output;
}

/** Generate src/countries/all.ts: every country, with an empty specification for countries without IBAN. */
function generateAll(specs, registryFile) {
  const ibanCodes = new Set(specs.map((spec) => spec.code));
  let output = HEADER(registryFile);
  output += "import type * as Types from '../core/types';\n";
  output += "import { ibanSpecs } from './specs';\n\n";
  output += 'const NO_IBAN: Types.CountrySpec = Object.freeze({});\n\n';
  output += '/**\n';
  output += ' * Country specifications for all countries. Countries without IBAN have an empty specification.\n';
  output += ' * Kept in its own module so bundlers can drop it when only IBAN functions are used.\n';
  output += ' */\n';
  output += 'export const countrySpecs: Types.CountryMap = Object.freeze({\n';
  for (const code of [...countryCodes].sort()) {
    if (!ibanCodes.has(code)) output += `  ${code}: NO_IBAN,\n`;
  }
  output += '  ...ibanSpecs,\n';
  output += '});\n';
  return output;
}

// Main
console.log('IBAN Registry Builder');
console.log('');

const registryPath = findLatestRegistry();
const registrySpecs = parseRegistry(registryPath);
console.log(`Parsed ${registrySpecs.length} registry countries`);
const specs = mergeSpecs(registrySpecs);
console.log(`Merged ${specs.length} countries`);

const registryFile = path.basename(registryPath);
for (const file of fs.readdirSync(outputDir)) {
  if (/^[A-Z]{2}\.ts$/.test(file)) fs.unlinkSync(path.join(outputDir, file));
}
for (const spec of specs) fs.writeFileSync(path.join(outputDir, `${spec.code}.ts`), generateCountry(spec, registryFile));
fs.writeFileSync(path.join(outputDir, 'specs.ts'), generateSpecs(specs, registryFile));
fs.writeFileSync(path.join(outputDir, 'codes.ts'), generateCodes(registryFile));
fs.writeFileSync(path.join(outputDir, 'all.ts'), generateAll(specs, registryFile));
console.log(`Generated ${specs.length} country files, specs.ts, codes.ts and all.ts in ${outputDir}`);
