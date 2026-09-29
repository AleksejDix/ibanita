#!/usr/bin/env node
// Checks the built package: every export path resolves and imports, and the gzipped size stays under the limit.
import { readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { resolve } from 'node:path';
import { build } from 'vite';

// Gzipped size of each entry bundled with everything it imports.
const SIZE_LIMITS = {
  'dist/index.js': 8 * 1024,
  'dist/bic.js': 1536,
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
  console.log(`${String(bytes).padStart(6)} gzipped  ${entry} (limit ${limit})`);
  if (bytes > limit) {
    console.error(`${entry}: gzipped size ${bytes} exceeds the limit of ${limit} bytes`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
