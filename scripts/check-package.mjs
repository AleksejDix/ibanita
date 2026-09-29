#!/usr/bin/env node
// Checks the built package: every export path resolves and imports, and the gzipped size stays under the limit.
import { readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { relative, resolve } from 'node:path';
import { build } from 'vite';

// Gzipped size of each entry bundled with everything it imports.
const SIZE_LIMITS = {
  'dist/index.js': 8 * 1024,
  'dist/bic.js': 1536,
  [coreWithOneCountry()]: 2048,
};

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
let failed = false;

// A wildcard export such as ./countries/* is checked with one sample country.
const SAMPLE = 'CH';
for (const [pattern, target] of Object.entries(pkg.exports)) {
  const path = pattern.replace('*', SAMPLE);
  for (const file of [target.types, target.import].map((file) => file.replace('*', SAMPLE))) {
    try {
      statSync(file);
    } catch {
      console.error(`export ${path}: missing ${file}`);
      failed = true;
    }
  }
  const mod = await import(resolve(target.import.replace('*', SAMPLE)));
  console.log(`export ${path.padEnd(9)} ${Object.keys(mod).length} symbols`);
}

/** An entry that uses the core with a single country, written next to dist so relative imports resolve. */
function coreWithOneCountry() {
  const entry = resolve('dist/core-with-one-country.js');
  writeFileSync(
    entry,
    "import { withCountries } from './core/index.js';\nimport { CH } from './countries/CH.js';\nexport const tools = withCountries({ CH });\n",
  );
  return entry;
}

/** Gzipped size of an entry bundled and minified with Vite, which is what an application ships. */
async function bundleSize(entry) {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    build: { write: false, minify: true, lib: { entry: resolve(entry), formats: ['es'], fileName: 'bundle' } },
  });
  const chunk = result[0].output.find((item) => item.type === 'chunk');
  return gzipSync(chunk.code).length;
}

for (const [entry, limit] of Object.entries(SIZE_LIMITS)) {
  const bytes = await bundleSize(entry);
  console.log(`${String(bytes).padStart(6)} gzipped  ${relative('.', entry)} (limit ${limit})`);
  if (bytes > limit) {
    console.error(`${entry}: gzipped size ${bytes} exceeds the limit of ${limit} bytes`);
    failed = true;
  }
}
unlinkSync(resolve('dist/core-with-one-country.js'));
process.exit(failed ? 1 : 0);
